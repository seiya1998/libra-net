# 意思決定記録 (ADR)

重要な技術・設計判断を記録する。

## ADR-001: サーバーアーキテクチャ

- **状態**: 採用
- **文脈**: `@libra-net/server`（Fastify + Drizzle）のアーキテクチャと、ORM 乗り換えやテスト容易性への耐性が必要。
- **決定**:
  - **オニオンアーキテクチャ**（`domain` / `application` / `infrastructure` / `presentation`）＋ **リポジトリパターン**を採用。
  - ビジネスロジックは **domain に置く（リッチドメイン）**。`application` は薄いユースケース層。
  - Web 層は **Railway Oriented Programming**（`ramda` の `pipe` + `ts-pattern` の `match.exhaustive`）。
  - API 型は **OpenAPI**（JSON Schema → `@fastify/swagger` 生成 → admin が Aspida で取込）。
- **結果**: ORM（Drizzle）依存が `infrastructure` 層に隔離され、`domain` / `application` を ORM・Fastify 非依存で単体テストできる。規約は `.claude/rules/server/`。

## ADR-002: マルチテナント分離

- **状態**: 採用
- **文脈**: 契約大学ごとの SaaS。複数大学データの横断活用が差別化の核。DB は MySQL。
- **決定**: **共有DB ＋ 行レベル `tenant_id`**。テナント識別は**サブドメイン**。MySQL は RLS が無いため、分離は **リポジトリ層の `tenant_id` 強制 ＋ 型での必須化 ＋ 分離テスト**で担保。横断分析は明示的な専用 read-only パス。
- **結果**: 横断分析が容易・オンボーディング低コスト。分離責任がアプリ/型/テストに集中（規約 `multi-tenancy.md`）。

## ADR-003: 外部連携・検索の腐敗防止層

- **状態**: 採用
- **文脈**: NDL / Google Calendar / AI / 検索を扱う。外部の不確実性を domain に持ち込みたくない。
- **決定**: domain にポート、infrastructure にアダプタ。外部モデルは境界で domain モデルへ変換。timeout/retry/フォールバック。
- **結果**: 外部依存が infrastructure 1層に隔離。検索は将来エンジン差し替え可（規約 `integrations.md`）。

## ADR-004: テナント別テーマ

- **状態**: 採用
- **文脈**: 大学ごとにカラーテーマ。同一デプロイで多テナント。
- **決定**: **実行時 CSS 変数 ＋ テナント設定駆動**。Tailwind を CSS 変数にバインド。
- **結果**: ビルド分岐不要（規約 `theming.md`）。

## ADR-005: 検索基盤

- **状態**: 採用（初期）
- **文脈**: OPAC 蔵書検索。
- **決定**: **MySQL FULLTEXT** で開始。検索を domain の `SearchPort` で抽象化。
- **結果**: 初期はシンプル、将来 Meilisearch/OpenSearch 等へアダプタ差し替えで移行可。

## ADR-006: 非同期処理基盤

- **状態**: 保留（入口の抽象化は採用、ランタイムは未決）
- **文脈**: 返却通知・予約順番・延滞検出・NDL同期・カレンダー連携。
- **決定**: 非同期は HTTP と別入口から application ユースケースを実行（冪等・リトライ）。**ランタイム（ワーカー＋キュー / Lambda・バッチ）は未決**。application/domain はランタイム非依存。
- **結果**: ランタイム選定を後回しにしても手戻りなし（規約 `async-jobs.md`）。

## ADR-007: 認証方式

- **状態**: 採用
- **文脈**: 学生 / 教職員 / 一般の3層。
- **決定**: **独自認証**。学籍番号 / 従業員ID / 図書カード番号で突合。SSO なし。パスワードはハッシュ化。
- **結果**: SSO 連携の運用負荷を回避。番号一意制約で重複防止（規約 `security.md`）。

## ADR-008: API エンドポイント分離

- **状態**: 採用
- **文脈**: 管理画面（PC・書き込み多）と OPAC（モバイル・公開・読み多）。
- **決定**: 共有 domain/application/infrastructure の上に、presentation を **admin API / opac API の2面**。`@fastify/autoload` を surface ごとに register し、**管理画面＝`/admin/*`、OPAC＝root（`/*`、例 `/books`）**でマウント。認可/ミドルウェアは surface 単位でカプセル化。OPAC を root に置くのは「公開 API を主・admin を namespace」の慣用に沿う。
- **結果**: アクセス特性に応じた認可/キャッシュ最適化を分離可能。register 分割は起動時のみで実行時ルーティング性能に影響なし（規約 `architecture.md`）。
