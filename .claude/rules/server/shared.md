---
paths:
  - 'apps/server/**/*.ts'
---

# shared 層の規約（railway / tenant / DI）

`shared/` は **複数コンテキスト・複数層で使う横断基盤**だけを置く（型・小さなユーティリティ・合成）。**ビジネスロジックは置かない**。

- **NEVER**: ドメイン固有ロジック（books/loans 等）を `shared/` に置く。
- **NEVER**: 1 箇所でしか使わないものを `shared/` に置く（co-location。`architecture.md`）。

> スタイルは **関数型**（factory 関数・カリー化 DI、クラス/DI コンテナ不使用）。
> 命名は `naming.md`: 型(ポート) `BookRepository` / factory `bookRepository(db)` / インスタンス `books`。

## railway（ROP の基盤）

```typescript
export type Failure = { errorCode: number };                 // HTTP に写像できるコード
export type Result<Ok, Ng extends Failure> =
  | { success: true; data: Ok }
  | { success: false; error: Ng };
// 各ユースケースは Ng を具体的な errorCode の union にして exhaustive を効かせる
// 例: Result<Book, { errorCode: 400 } | { errorCode: 409 } | { errorCode: 500 }>
// start(value): パイプの起点（成功で開始）
// bypass(fn):   前段成功なら fn 実行、失敗ならスキップして失敗を伝播
```

- **YOU MUST**: ユースケース/サービスは `Result` を返す（例外で制御フローしない）。
- **YOU MUST**: handler は `pipe(start(...), bypass(useCase), match(...).exhaustive())` で `Result` を HTTP に写像（`handler.md`）。
- ドメインエラー → `Failure(errorCode)` の翻訳は **application** で行う。`errorCode` 定数は `shared/` に定義。

## バリデーション（validateParams）

- リクエスト検証は **`validateParams(data, rules)`**（rule ベース）を使い、**`Result<T, { errorCode: 400 }>`** を返す。`extractParamsForXxx`（presentation）の中で使う。
- util は `shared/validate/` に置く。ルールは配列で宣言（例 `{ userId: ['required', 'cuid'], isbn: ['required', 'digits:13'] }`）。
- 検証の役割分担は `schema.md` 参照（request の実検証は validateParams、`schema.ts` は型/OpenAPI 中心）。

## tenant（チョークポイント）

```typescript
export type TenantContext = { tenantId: TenantId };
// リポジトリは TenantContext を必須引数に取る（型で必須化＝ctx 無しでは呼べない）
type BookRepository = {                                 // ポート(型)・naming.md
  save(ctx: TenantContext, book: Book): Promise<Result<Book>>;
};
```

- **YOU MUST**: 全リポジトリは `shared/tenant` の scoped ヘルパ経由で DB アクセスし、**全クエリに `tenant_id = ctx.tenantId` を自動注入**（単一チョークポイント）。
- **YOU MUST**: リポジトリ関数は `TenantContext` を引数に取る（ctx 無しでは呼べない型）。
- **NEVER**: チョークポイント迂回の生クエリ／domain に `TenantContext` を渡す（`multi-tenancy.md`）。

## DI（合成ルート・関数型）

**DI コンテナライブラリ（inversify 等）は使わない**。`shared/di.ts` の**合成ルート**で手で配線する。依存注入は**カリー化**（ユースケースの第1引数に deps を部分適用）で行う。

- 静的な依存（リポジトリ/アダプタ）＝**起動時に合成ルートで部分適用**。
- per-request の `TenantContext` ＝**呼び出し時に渡す**。

```typescript
// application/books/BookService.ts（ユースケース＝カリー化関数）
export const registerBook =
  (deps: { books: BookRepository; bibliography: Bibliography }) =>  // ① DI（起動時）
  (ctx: TenantContext) =>                                           // ② per-request
  async (input: RegisterBookInput): Promise<Result<Book>> => { /* deps.books.save(ctx, ...) */ };

// shared/di.ts（合成ルート・起動時 1 回・手動配線）
const books = bookRepository(db);                                   // factory（クラスでない）
export const registerBookUC = registerBook({ books, bibliography: ndlBibliography(env) });

// routes/admin/books/_handlers.ts
pipe(start(extractParamsForRegisterBook(req)), bypass(registerBookUC(ctx)), /* match... */)();
```

- **YOU MUST**: 依存は **IF（型）で受け取り**、**合成ルート（`shared/di.ts`）で実装（factory の戻り）をカリー化で注入**する。
- **YOU MUST**: 静的依存は起動時に部分適用、`TenantContext` は per-request に渡す（`registerBookUC(ctx)` が `(input)=>Result`＝`bypass` 互換）。
- **NEVER**: ユースケース/handler 内で実装を直接生成・import しない（合成ルート経由）。
- **NEVER**: DI コンテナライブラリを導入しない（手動合成ルートで十分・型安全）。
