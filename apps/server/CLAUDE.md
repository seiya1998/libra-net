# CLAUDE.md - Server API

大学図書館SaaS バックエンド API (@libriori/server)

> 現状 `docs/openapi-for-admin.yaml`（OpenAPI スキーマ）のみ。実装は未着手で、本書と `.claude/rules/server/` は「これから建てる実装を導く規約」。

## 技術スタック

- **フレームワーク**: Fastify
- **ORM**: Drizzle
- **API 型定義**: JSON Schema（`json-schema-to-ts`）→ `@fastify/swagger` で OpenAPI 生成 → admin が Aspida で取込
- **エラーハンドリング**: Railway Oriented Programming（`ramda` の `pipe` + `ts-pattern` の `match.exhaustive`）
- **テスト**: Jest（`server.inject()` による E2E）

## アーキテクチャ

- **オニオンアーキテクチャ**（`domain` / `application` / `infrastructure` / `presentation`）＋ **リポジトリパターン**。
- ビジネスルールは **domain**（リッチドメイン）、`application` は薄いユースケース、ORM 依存は `infrastructure` に隔離。
- 詳細は `.claude/rules/server/architecture.md` を参照。

## コマンド（想定。server の package.json に定義する）

```bash
pnpm --filter @libriori/server dev          # 開発サーバー起動
pnpm --filter @libriori/server tsc --noEmit  # 型チェック
pnpm --filter @libriori/server lint          # ESLint
pnpm --filter @libriori/server test          # 単体テスト
pnpm --filter @libriori/server test:e2e      # E2E テスト
```

## 開発ルール

詳細なコーディング規約は `.claude/rules/server/`（`architecture.md` / `common.md` / `schema.md` / `handler.md` / `e2e-test.md`）を参照。新規エンドポイント実装・既存 API 修正は `api-developer` エージェントを使う。
