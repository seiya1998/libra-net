---
paths:
  - 'apps/server/**/*.ts'
---

# DB / Drizzle スキーマ・マイグレーション規約

DB は **PostgreSQL + Drizzle**。マルチテナントは **Pool（共有スキーマ＋`tenant_id`）＋ RLS**（`multi-tenancy.md`）。スキーマ定義が source of truth。**イミュータブルデータモデリング**を採用する。

## イミュータブルデータモデリング（最重要）

テーブルを **リソース** と **イベント** に分類し、**プレフィックスで区別**する。**テーブル名は必ず複数形**。

- **リソース（Resource）= `r_` で始める・複数形**: 「〜がある」名詞・マスタ的な実体（大学・蔵書・利用者・キャンパス 等）。例 `r_books`, `r_users`, `r_campuses`。
- **イベント（Event）= `e_` で始める・複数形**: 「〜が起きた」事実・**1つの発生日時を持つ**（貸出・返却・予約・配送依頼 等）。例 `e_loans`, `e_returns`, `e_reservations`。

### イベントテーブル（`e_`）

- **YOU MUST**: 発生日時 **`created_at` を1つだけ持つ**（＝そのイベントが起きた日時）。
- **YOU MUST**: **append-only・不変**。一度記録したら**更新・物理削除しない**（事実だから）。
- **NEVER**: `updated_at` を持たせない。**状態の変化は「新しいイベント」を追加して表現**する（例: 返却は `e_returns` に追加。貸出中かは `e_loans` に対応する `e_returns` の有無で**導出**）。
- **1イベント1日時**の原則（複数の意味の異なる日時を1テーブルに混ぜない）。

### リソーステーブル（`r_`）

- マスタ的な実体。**`updated_at` は使わない**（変化はできるだけイベントで表現。本当に必要な属性更新のみ直接変更）。
- 「現在の状態」はイベントから導出が基本。ただし**読み取り性能のため `current_status` 列（イベントの射影）を持つことを許容**する（関連イベント追記と**同一トランザクションで更新**・イベントから再構築可能。ADR-009）。

### 中間テーブル（関連）

中間テーブルも **リソース / イベントに分類**する。判定軸＝「その関連は **"起きた事実（時刻が意味を持つ)"** か **"静的な構造"** か」。

- **イベント `e_`**: 時刻が意味を持ち append-only な関連（例 お気に入り `e_favorites`、貸出 `e_loans`）。**多くの中間テーブルは実はイベント**。
- **リソース `r_`**: 時刻を持たない静的・構造的な関連（例 蔵書↔著者 `r_book_authors`）。
- 迷ったら「**この関連はいつ生まれたかが重要か？**」→ Yes=`e_`、No=`r_`。

## テーブル共通

- **YOU MUST**: 全テーブルに **`tenant_id`**（複合インデックスの先頭）。**PostgreSQL の RLS でテナント分離を DB 強制**（`FORCE ROW LEVEL SECURITY`・非 owner ロール接続・`SET LOCAL app.current_tenant`。`multi-tenancy.md` / `performance.md`）。
- **命名**: テーブル名は **`r_` / `e_` ＋ snake_case ＋ 複数形**（例 `r_books`, `e_loans`）。カラムは snake_case、TS 側は camelCase（Drizzle のマッピング）。
- **主キー**: 文字列ID（cuid / ULID 等）で統一。業務上の一意キー（学籍番号 / 図書カード番号 / ISBN 等）はユニーク制約。
- 区分値は enum で表現する。

## スキーマのディレクトリ構成

- スキーマは **`src/infrastructure/db/`** に置く（persistence は infrastructure に集約。`architecture.md`）。
- 小さいうちは単一 `src/infrastructure/db/schema.ts`。増えたら **`src/infrastructure/db/schema/<context>.ts`**（books / loans / users / notices …）に分割し `index.ts` で re-export（Drizzle Kit はディレクトリ/グロブ可）。「フラット既定・増えたら分割」（co-location 原則）。

## インデックス・制約

- `tenant_id` 先頭の複合インデックス、キャンパス・絞り込みキー、蔵書検索は **PostgreSQL 全文検索（GIN）**（`performance.md`）。外部キー・制約はスキーマで表現。

## 削除

- **イベントは削除しない**（不変）。リソースの物理削除も慎重に（参照整合性・履歴）。除外が要るものはステータスで表す（蔵書の `除籍` 等）。

## マイグレーション

- **Drizzle Kit** で生成・適用。スキーマ定義が唯一の真実。**NEVER** 本番 DB を手で変更（必ずマイグレーション経由）。命名は連番＋内容。前進を基本。

## 接続

- DB 接続は `src/infrastructure/db/client.ts` の単一インスタンス。リポジトリ実装（factory）が受け取る（`shared.md`）。
