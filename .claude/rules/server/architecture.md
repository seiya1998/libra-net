---
paths:
  - 'apps/server/**/*.ts'
---

# サーバーアーキテクチャ規約（オニオン + ROP + リポジトリ）

`@libra-net/server`（Fastify + Drizzle + MySQL）は **オニオンアーキテクチャ**を採用する。Web 層は **Railway Oriented Programming (ROP)**、データアクセスは **リポジトリパターン**で実装する。マルチテナント SaaS（共有DB＋行レベル `tenant_id`）であり、テナント分離の規約は `multi-tenancy.md` を参照。

本ファイルは層構造と依存方向の規約。ファイル種別ごとの詳細は `schema.md` / `handler.md` / `e2e-test.md`、命名は `common.md` を参照。

## レイヤー構成（レイヤー先頭）

```
apps/server/src/
  domain/          # エンティティ / 値オブジェクト / ドメインサービス / リポジトリIF(ポート) / ドメインエラー。純粋TS
  application/     # ユースケース。domain とリポジトリIF にのみ依存し Result を返す（Drizzle を知らない）
  infrastructure/  # リポジトリ実装(Drizzle で DB 操作) / 外部API・検索アダプタ
    db/            #   Drizzle schema(schema.ts or schema/) / client.ts / migrations。persistence は infrastructure に集約
  presentation/    # presentation 層
    routes/        #   ファイルベースルーティング(@fastify/autoload)。admin/→/admin・opac/→/(root)。多メソッドは _get/_post 等で分割(URL から除外)。各 _handlers.ts(ROP)・schema.ts・extractParams
    middleware/    #   テナント解決(サブドメイン→TenantContext)・認証(admin/opac別)
    plugins/       #   Fastify プラグイン(swagger 等)
  shared/          # Result/Failure・railway(pipe/start/bypass)・テナント文脈/チョークポイント・DI合成（規約 shared.md）
```

- 各層の内部は境界づけられたコンテキスト（books / loans / users / notices …）で分割する。

## 依存方向（最重要）

- 依存は **内向きのみ**: `presentation → application → domain`、`infrastructure → domain`。
- **NEVER**: `domain` / `application` が Fastify・Drizzle の型を import しない。フレームワーク/ORM 依存は `infrastructure`（と `presentation`）に閉じる。

## 各層の責務

- **domain**: エンティティ・値オブジェクト・ドメインエラー・**リポジトリインターフェース（ポート）**。検索・外部連携も domain にポートを置く。
- **application**: アプリケーションサービス（`<Context>Service`、例 `BookService`）＝**カリー化されたユースケース関数**の集まり（薄い組み立て）。domain とリポジトリ IF にのみ依存し `Result` を返す（業務ルールは持たず domain に置く）。deps は合成ルートでカリー化注入、`TenantContext` は per-request。**HTTP からもワーカー/バッチからも同じサービスが呼ばれる**（入口に依存しない）。
- **infrastructure**: リポジトリ実装（Drizzle/MySQL）・DB クライアント・**外部 API / 検索のアダプタ**（検索は MySQL FULLTEXT。`integrations.md`）・キャッシュ/キュー基盤（runtime 未決）。domain の IF を実装する側。**Drizzle による DB 操作（取得/登録/更新/削除）はこの層のリポジトリ実装にのみ書く**。
- **presentation**: 外側の API 層。`routes/`（**ファイルベースルーティング** `@fastify/autoload`。**surface ごとに register**: `routes/admin` を prefix `/admin`、`routes/opac` を prefix `/`(root) でマウント。例: `routes/admin/books`→`/admin/books`、`routes/opac/books`→`/books`。`_handlers.ts`(ROP)・`schema.ts`・`extractParams`）＋ `middleware/`（テナント解決・認証）＋ `plugins/`。**register を surface 別に分け、認可/ミドルウェアを surface 単位でカプセル化**（admin 認証は admin の register、opac 認証は opac の register）。application を呼ぶだけ（DB アクセスは書かない）。

> **入口は2系統**: ①HTTP（admin API / opac API）②非同期（ワーカー or Lambda/バッチ＝**未決**、`async-jobs.md`）。どちらも application ユースケースを叩き、domain は不変。
> **マルチテナント**: テナント文脈は presentation で解決し application/infrastructure に注入。domain のビジネスロジックには持ち込まない。詳細は `multi-tenancy.md`。

## サービス層（ビジネスロジック）の置き場所

**方針: リッチドメイン（onion のベストプラクティス）。** OOP でいう「サービス層（ビジネスロジック）」は、オニオンでは責務ごとに分割する。ビジネスルールは domain に置き、application は薄いユースケース層にする。これで domain は ORM/Fastify 非依存で単体テストでき、onion の利点が活きる。

- **ドメイン層 `domain/`（ビジネスルールの本体）**: エンティティ／値オブジェクトが自身の不変条件・**自分で完結するルール**を持つ（例: `loan.isOverdue(now)` は `Loan` のメソッド）。**複数エンティティにまたがる / どのエンティティにも属さない**規則だけ **ドメインサービス**（`~Policy` 等・`~Service` は付けない）に置く（例: 貸出可否 `canBorrow`）。1エンティティで完結するなら無理に `~Policy` を作らない。
- **アプリケーション層 `application/`（アプリケーションサービス＝薄い組み立て）**: ファイル名 `<Context>Service`（例 `BookService`）。リポジトリ IF で取得 → ドメインのルール適用 → 保存、というオーケストレーションとトランザクション境界のみ。**ここに業務ルールを書かない**。handler が `bypass` で呼ぶのはこれ。
- **DB アクセス = `infrastructure/` のリポジトリ実装**: 「DB から取得・保存する処理」はサービスではなくここに置く。application はリポジトリ IF 越しに呼ぶ。

> 例外: 真の業務ルールが無い単純 CRUD では、エンティティは薄く・ユースケースはリポジトリ呼び出しだけでよい。ルールが無いのに無理にドメインサービスを作らない。

## リポジトリパターン

- **YOU MUST**: リポジトリは **domain に IF（ポート）**を定義し、**infrastructure に factory 関数で実装**を置く（**依存性逆転**・クラス不使用）。domain は「永続化の契約」だけを所有し Drizzle を知らない。
- **YOU MUST**: **Drizzle のクエリ（取得/登録/更新/削除）はリポジトリ実装にのみ**書く。application（サービス/ユースケース）は IF のメソッドを呼ぶだけ。
- **YOU MUST**: リポジトリの入出力はドメイン型（ORM の row 型をそのまま外へ漏らさない）。
- **NEVER**: application / domain から Drizzle を直接呼ばない（必ずリポジトリ経由）。
- リポジトリ実装（factory）は**合成ルート `shared/di.ts` でカリー化注入**する（`shared.md`）。`db` は factory に束縛、`TenantContext` は per-request。ユースケースは具体実装を知らない。

## 関数の配置（co-location とスコープ）

特定のユースケース/エンドポイントでしか使わない関数は **co-location**（使う場所の隣）に置き、`shared/` には上げない。

- **レイヤーは「何をする関数か」で決める**: リクエスト解釈/レスポンス整形＝presentation、処理の組み立て＝application、業務ルール＝domain、I/O・外部・DB＝infrastructure。**使用回数とは無関係**（1回しか呼ばれなくても業務ルールは domain）。
- **配置の広さは「誰が使うか」で決める**:
  - **1 ユースケース/エンドポイントだけ** → そのディレクトリに**ローカル**（export しない。同ファイル内 private か隣の `*.helpers.ts`）。
  - **1 コンテキスト内で複数** → そのコンテキスト直下（例 `application/books/`）。
  - **複数コンテキストで再利用** → `shared/`（または domain の共有）へ**昇格**。
- **NEVER**: 1 箇所でしか使わない関数を最初から `shared/` に置く（早すぎる共通化＝不要な結合）。実際に再利用が発生してから昇格する。

```
presentation/routes/admin/books/_post/{_handlers.ts, schema.ts, extractParams.ts}  # POST /admin/books（多メソッドは _get/_post で分割・URL は /admin/books）
application/books/BookService.ts        # アプリケーションサービス（registerBook 等。カリー化・薄い組み立て）
domain/books/{Book.ts, BookRepository.ts, errors.ts}  # エンティティ・ポート(型 BookRepository)・errors
infrastructure/books/bookRepository.ts  # factory bookRepository(db)（DB操作・クラス不使用・ORM名なし）
infrastructure/db/schema/books.ts       # Drizzle schema（r_books / e_loans … は infrastructure/db/schema に）
```

## ROP（Web 層）と OpenAPI

- handlers は `pipe → start → bypass(useCase) → match(...).exhaustive()` でユースケースの `Result` を HTTP に写像する（詳細 `handler.md`）。
- API 入出力は presentation の `schema.ts` に JSON Schema で定義 → `@fastify/swagger` で `docs/openapi-for-admin.yaml` を生成 → admin が Aspida で取込（詳細 `schema.md`）。
