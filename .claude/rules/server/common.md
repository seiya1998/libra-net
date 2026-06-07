---
paths:
  - 'apps/server/**/*.ts'
---

# Server 共通ルール

`@libra-net/server`（Fastify + Drizzle ORM）のコーディング規約。

## 命名規則

### API リクエスト/レスポンスプロパティ

- **YOU MUST**: API のリクエストボディ・レスポンスボディのプロパティは必ず `camelCase` で命名する。
- 例: `bookId`, `userName`, `dueDate`, `authorIds`
- フロントエンド（`@libra-net/admin`）は OpenAPI → Aspida 経由でこの型をそのまま受け取るため、命名のブレは型不整合に直結する。

## コーディング規約

### オブジェクトアクセス

- **YOU MUST**: オブジェクトのプロパティアクセスはドット記法ではなくブラケット記法を使う。
- 例: `book["title"]`, `loan["dueDate"]`
- `noUncheckedIndexedAccess` 等と組み合わせ、型安全性を高める意図。

## 禁止事項

### テーブル操作

- **NEVER**: Drizzle のスキーマ定義（`src/db/schema.ts` 等）に存在しないテーブル・カラムを作成・変更・使用しない。
- スキーマ変更が必要な場合は、必ず Drizzle スキーマ定義とマイグレーションを先に更新する（その作業自体は別タスク／レビュー対象）。

## 参照

- 型チェックの実行タイミングはルートの `.claude/rules/typescript.md` に従う（`apps/server` も対象）。
- ハンドラー/スキーマ/テストの個別ルールは同ディレクトリの `handler.md` / `schema.md` / `e2e-test.md` を参照。
