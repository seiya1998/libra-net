# DB スキーマ

エンティティ / ER / 制約。Drizzle スキーマ定義（`apps/server/src/db/schema.ts`）を source of truth とし、基本設計フェーズまたは `docs-updater` で整備する。

## 高レベル方針（詳細は基本設計）

- **全ドメインテーブルに `tenant_id`**（複合インデックスの先頭）。DB は MySQL（Drizzle）。
- 主なエンティティ（想定）: `Tenant`（大学）/ `Campus`（拠点）/ `Book`（蔵書: ISBN・保管場所・登録日）/ `Inventory`（(book, campus) 単位の在庫）/ `User`（学生/教職員/一般・図書カード番号）/ `Loan`（貸出・返却期限）/ `Return` / `Reservation`（予約・予約待ち）/ `DeliveryRequest`（拠点間配送）/ `Notice`（お知らせ）/ `ThemeConfig`（テナント別テーマ）。
- 認証: パスワードはハッシュ保存。学籍番号 / 従業員ID / 図書カード番号は一意。

※ 実体（Drizzle 定義・マイグレーション）は基本設計/実装フェーズで作成。
