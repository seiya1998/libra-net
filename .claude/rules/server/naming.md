---
paths:
  - 'apps/server/**/*.ts'
---

# ファイル / フォルダ命名規則

> スタイルは **関数型**（factory 関数・カリー化 DI、クラス/DI コンテナ不使用）。
> リポジトリ命名は **clean な型名(ポート) ＋ factory 関数(実装)**（下記「リポジトリ命名」）。

## フォルダ

- **レイヤー**（固定）: `domain/` `application/` `infrastructure/` `presentation/` `shared/` `db/`
- **各層内はコンテキストで分割**: `books/` `loans/` `users/` `notices/`
- **ルーティング**: `presentation/routes/<surface>/<resource>/`（`admin` / `opac`）
- **合成ルート**: `shared/di.ts`（DI を手で配線）

## casing の原則

- **型 / エンティティ = PascalCase**: `Book.ts`, `Isbn.ts`
- **関数モジュール / ファクトリ / 値 = camelCase**: `bookRepository.ts`, `errors.ts`, `extractParamsForRegisterBook.ts`
- **アプリケーションサービスのモジュール = `<Context>Service.ts`**（カリー化ユースケース関数を束ねる）

## レイヤー別の命名

| 種別 | 場所 | 命名 | 例 |
|---|---|---|---|
| エンティティ | `domain/<ctx>/` | PascalCase | `Book.ts` / `Loan.ts` |
| 値オブジェクト | `domain/<ctx>/` | PascalCase | `Isbn.ts` |
| ドメインサービス | `domain/<ctx>/` | PascalCase（**`~Service` は使わない**） | `LoanPolicy.ts`（`canBorrow` 等） |
| リポジトリ **ポート(型)** | `domain/<ctx>/` | clean `<Entity>Repository`（`I` なし） | `BookRepository.ts` |
| 外部ポート(型) | `domain/<ctx>/` | clean な capability 名（`I` なし） | `Bibliography.ts` / `Search.ts` |
| ドメインエラー | `domain/<ctx>/` | `errors.ts` | `errors.ts` |
| **アプリケーションサービス** | `application/<ctx>/` | `<Context>Service.ts`（カリー化ユースケース関数・`Result` 返却・薄い） | `BookService.ts` |
| リポジトリ **実装** | `infrastructure/<ctx>/` | factory `<entity>Repository(db)`（**ORM 名なし**・DB 操作はここ） | `bookRepository.ts` |
| 外部アダプタ実装 | `infrastructure/<ctx>/` | **連携先名**（factory 関数） | `ndlBibliography.ts` |
| ハンドラ | `presentation/routes/.../` | `_handlers.ts` | `_handlers.ts` |
| スキーマ | 同上 | `schema.ts` | `schema.ts` |
| パラメータ抽出 | 同上 | `extractParamsFor<操作>.ts` | `extractParamsForRegisterBook.ts` |
| テスト | co-locate | `<対象>.test.ts` / `_handlers.e2e.test.ts` | `LoanPolicy.test.ts` |

## ユースケース / サービス（確定）

- **アプリケーションサービス = `<Context>Service.ts`**: **カリー化されたユースケース関数**を束ねるモジュール（`registerBook = (deps) => (ctx) => (input) => Result`）。**クラスにしない**。薄い組み立て・`Result` 返却・業務ルールは持たない。
- **ドメインサービス = `<Name>Policy` 等**（`domain/`）: **複数エンティティにまたがる / どのエンティティにも属さない**業務ルール（例 貸出可否 `canBorrow`）。**1エンティティで完結するルールはエンティティ（`Book.ts` / `Loan.ts`）のメソッドに置く**＝無理に `~Policy` を作らない。`~Service` は付けない（アプリ層と区別）。

## リポジトリ命名（確定）

関数型に合わせ、**型(ポート)・factory 関数(実装)・インスタンス**を別名で持つ:

- **型(ポート)** `BookRepository`（domain・clean・`I` なし）
- **実装(factory)** `bookRepository(db): BookRepository`（infrastructure・**この中で実際の Drizzle DB 操作**・クラス不使用・`create` / `I` / ORM 名なし）
- **インスタンス** `books`（`const books = bookRepository(db)`）

```ts
// domain/books/BookRepository.ts
export type BookRepository = {
  save(ctx: TenantContext, book: Book): Promise<Result<Book>>;
  findByIsbn(ctx: TenantContext, isbn: Isbn): Promise<Result<Book | null>>;
};
// infrastructure/books/bookRepository.ts
export const bookRepository = (db: Db): BookRepository => ({
  save: (ctx, book) => /* db.insert(...) ＋ tenant_id 強制 = 実際の DB 操作 */,
  findByIsbn: (ctx, isbn) => /* db.select(...) */,
});
```

外部アダプタも同形: 型 `Bibliography` / 実装 factory `ndlBibliography(env)`（連携先名）。

## DI（合成ルート）

- `shared/di.ts` で**手動配線**（DI コンテナライブラリ不使用）。factory でリポジトリ/アダプタを生成し、ユースケースに**カリー化で注入**（`shared.md`）。
- **NEVER**: ユースケース/handler 内で実装を生成・import しない（合成ルート経由）。

## その他

- **NEVER**: default export（named export に統一）。
- ファイル名は主 export 名と一致させる。
