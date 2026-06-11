---
paths:
  - 'apps/server/**/*.ts'
---

# マルチテナント規約（PostgreSQL Pool ＋ 行レベル tenant_id ＋ RLS）

Libriori は契約大学ごとのマルチテナント SaaS。テナント分離は **Pool（共有スキーマ ＋ 行レベル `tenant_id`）**。**PostgreSQL の RLS（DB 強制）＋ アプリ層・型・テスト**の**多層防御**で守る。強セキュリティ大学は **Hybrid で Silo（専用 DB）に切り出す**（ADR-002）。

## tenant_id

- **YOU MUST**: 全ドメインテーブルに `tenant_id` を持たせ、複合インデックスの**先頭**に置く（`performance.md`）。
- テナントは**サブドメイン**（`{univ}.libriori.com`）で識別する。

## テナント文脈の流れ

- presentation でサブドメイン＋認証からテナントを解決し、application/infrastructure に**注入**する。
- **NEVER**: domain のビジネスロジックに `tenant_id` を持ち込まない（永続化・スコープの関心事）。
- **NEVER**: クライアント提供の `tenant_id` を信用しない（認証済みサブドメイン/セッションから導出）。

## 分離の強制（多層防御: RLS ＋ アプリ層）

- **YOU MUST**: **PostgreSQL の RLS で DB レベルでも強制**する（テーブルに `ENABLE` / `FORCE ROW LEVEL SECURITY`、ポリシー `tenant_id = current_setting('app.current_tenant')`、アプリは**非 owner ロール**で接続、`SET LOCAL app.current_tenant` を**トランザクション内**で設定）。
- **YOU MUST**: データアクセスは **リポジトリ層の単一チョークポイント**を通し、**全クエリに `tenant_id` を強制注入**する。
- **YOU MUST**: **テナント文脈を型で必須化**する（テナント文脈なしにクエリを書けない設計。渡し忘れはコンパイルエラー）。
- **YOU MUST**: **テナント分離テスト**（他テナントの行を読めない・書けないことの検証）を必須にする。
- **NEVER**: チョークポイントを迂回した生クエリ。

## 横断分析

- 複数大学データの横断集計は、**明示的な専用 read-only パス**で行う（**匿名・集計値・大学ごとオプトイン**。通常のテナントscope リポジトリを通さない。監査可能に。Silo 大学は対象外。ADR-002 / EP-006 / Q-021）。

## 完了チェックリスト

- [ ] 対象テーブルに `tenant_id`（インデックス先頭）
- [ ] クエリはチョークポイント経由・`tenant_id` 強制
- [ ] テナント文脈が型で必須
- [ ] テナント分離テストあり
- [ ] クライアント `tenant_id` を信用していない
