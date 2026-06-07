# DB スキーマ

エンティティ / ER / 制約。Drizzle スキーマ定義（`apps/server/src/db/schema.ts`）を source of truth とし、基本設計フェーズまたは `docs-updater` で整備する。

## 高レベル方針（詳細は基本設計）

- DB は MySQL（Drizzle）。**イミュータブルデータモデリング**を採用（規約 `.claude/rules/server/db.md` / ADR-009）。
- **全テーブルに `tenant_id`**（複合インデックスの先頭）。
- テーブルは **リソース `r_`** と **イベント `e_`** に分類（テーブル名は複数形）:
  - **リソース（r_）**: `r_tenants`（大学）/ `r_campuses`（拠点）/ `r_books`（蔵書: ISBN・配架場所）/ `r_users`（利用者: 学生/教職員/一般・図書カード番号）/ `r_notices`（お知らせ）/ `r_theme_configs`（テナント別テーマ）
  - **イベント（e_）**: `e_loans`（貸出）/ `e_returns`（返却）/ `e_reservations`（予約）/ `e_delivery_requests`（拠点間配送）… **`created_at`（発生日時）のみ・append-only・不変**
- **貸出中 / 在庫 / 延滞 / 予約待ち は イベントから導出**（状態を持たず事実から計算）。
- `updated_at` は使わない。認証のパスワードはハッシュ、学籍番号 / 図書カード番号 / ISBN は一意。

※ 実体（Drizzle 定義・マイグレーション）は基本設計/実装フェーズで作成。
