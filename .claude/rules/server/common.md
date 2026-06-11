---
paths:
  - 'apps/server/**/*.ts'
---

# Server 共通ルール

`@libriori/server`（Fastify + Drizzle ORM）のコーディング規約。

## 命名規則

### API リクエスト/レスポンスプロパティ

- **YOU MUST**: API のリクエストボディ・レスポンスボディのプロパティは必ず `camelCase` で命名する。
- 例: `bookId`, `userName`, `dueDate`, `authorIds`
- フロントエンド（`@libriori/admin`）は OpenAPI → Aspida 経由でこの型をそのまま受け取るため、命名のブレは型不整合に直結する。

## コーディング規約

### オブジェクトアクセス

- プロパティアクセスは**ドット記法**でよい（例: `book.title`, `loan.dueDate`）。
- 動的キー / インデックスアクセスは `undefined` の可能性に注意（`typescript-quality.md`・`noUncheckedIndexedAccess`）。

## 禁止事項

### テーブル操作

- **NEVER**: Drizzle のスキーマ定義（`src/db/schema.ts` 等）に存在しないテーブル・カラムを作成・変更・使用しない。
- スキーマ変更が必要な場合は、必ず Drizzle スキーマ定義とマイグレーションを先に更新する（その作業自体は別タスク／レビュー対象）。

## 参照

- 型チェックの実行タイミングはルートの `.claude/rules/typescript.md` に従う（`apps/server` も対象）。
- ハンドラー/スキーマ/テストの個別ルールは同ディレクトリの `handler.md` / `schema.md` / `e2e-test.md` を参照。
