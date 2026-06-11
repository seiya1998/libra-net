# DB スキーマ

エンティティ / ER / 制約。Drizzle スキーマ定義（`apps/server/src/db/schema.ts`）を source of truth とし、基本設計フェーズまたは `docs-updater` で整備する。

## 高レベル方針（詳細は基本設計）

- DB は **PostgreSQL**（Drizzle）。**イミュータブルデータモデリング**を採用（規約 `.claude/rules/server/db.md` / ADR-009）。
- マルチテナントは **Pool（共有スキーマ＋`tenant_id`）＋ RLS**（ADR-002）。**全テーブルに `tenant_id`**（複合インデックスの先頭）。
- テーブルは **リソース `r_`** と **イベント `e_`** に分類（テーブル名は複数形）:
  - **リソース（r_）**: `r_tenants`（大学）/ `r_campuses`（拠点）/ `r_books`（**書誌**: ISBN・タイトル等）/ `r_book_copies`（**所蔵**: バーコード・キャンパス・配架場所・`current_status`）/ `r_patrons`（利用者）/ `r_patron_types`（利用者種別＋貸出ルール）/ `r_staff`（スタッフ）/ `r_notices`（お知らせ）/ `r_theme_configs`（テナント別テーマ）
  - **イベント（e_）**: `e_loans`（貸出）/ `e_returns`（返却）/ `e_renewals`（延長）/ `e_reservations`（予約）/ `e_delivery_requests`（拠点間配送）/ `e_reminders`（督促）… **`created_at`（発生日時）のみ・append-only・不変**
- **状態（貸出中 / 在庫 / 延滞 / 予約待ち）はイベントが真実**。参照用にリソースへ **`current_status`（射影。同一 Tx で更新・再構築可能）** を持つ（ADR-009）。
- 認証は**外部 IdP**（パスワードは DB に保存しない。ADR-007）。`updated_at` は使わない。学籍番号 / 従業員ID / 図書カード番号 / ISBN / バーコードは一意。

※ 実体（Drizzle 定義・マイグレーション）は基本設計/実装フェーズで作成。
