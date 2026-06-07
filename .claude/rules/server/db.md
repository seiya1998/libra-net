---
paths:
  - 'apps/server/**/*.ts'
---

# DB / Drizzle スキーマ・マイグレーション規約

DB は **MySQL + Drizzle**。スキーマ定義（`src/db/schema.ts`）が **source of truth**。

## テーブル共通

- **YOU MUST**: **全ドメインテーブルに `tenant_id`**（複合インデックスの先頭。`multi-tenancy.md` / `performance.md`）。
- **YOU MUST**: `created_at` / `updated_at`（タイムスタンプ）を持たせる。
- **命名**: テーブル/カラムは **snake_case**（DB 慣習）。TS 側は camelCase（Drizzle のカラムマッピングで対応。API も camelCase = `common.md`）。
- 主キーは方針を統一（例: ULID/UUID 文字列、または自動採番）。学籍番号 / 従業員ID / 図書カード番号など業務上の一意キーは**ユニーク制約**。

## 削除

- 履歴・監査が要るもの（蔵書 / 利用者 / 貸出 / 返却）は**論理削除 or ステータス**で表現（蔵書は `除籍` ステータス）。**物理削除は慎重に**。

## インデックス・制約

- `tenant_id` 先頭の複合インデックス、キャンパス・絞り込みキー、蔵書検索は FULLTEXT（`performance.md`）。
- 外部キー・制約はスキーマで表現する。

## マイグレーション

- **Drizzle Kit** で生成・適用。**`db/schema.ts` が唯一の真実**。
- **NEVER**: 本番 DB を手で変更しない（必ずマイグレーション経由）。
- 命名は連番＋内容。破壊的変更は段階的に（前進のみを基本）。

## 接続

- DB 接続は `db/client.ts` の単一インスタンス。リポジトリ実装（factory）がこれを受け取る（`shared.md` / `architecture.md`）。
