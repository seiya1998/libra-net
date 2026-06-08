---
paths:
  - 'apps/server/**/*.ts'
---

# ロギング / 可観測性規約

マルチテナント SaaS では「**どのテナントの・どのリクエストの**ログか」を追えることが必須。基本フォーマットは aeon-pet の `responseLogger` 方式に倣う。

## 構造化ログ（pino）

- **YOU MUST**: **構造化ログ（pino）**で JSON 出力する。
- **onRequest フック**: リクエストごとに **request-id（相関ID）を発行**し **AsyncLocalStorage** に保持（経路全体・ログ・ジョブで共有）。`startTime` も記録。
- **onSend フック**: 統一ログを1件出力する。フィールド: `timestamp` / `endpoint` / `method` / `statusCode` / `requestBody` / `responseBody` / `time`（処理時間）/ **`tenantId`** / **`requestId`** / **`errors`**（下記）。
- ログレベルは **statusCode で決定**（`>=500` → `error`、`>=400` → `warn`、その他 → `info`）。

## サービス層エラー配列（errors）

「DB エラー / 型(TS)エラー / 業務ロジックエラー / サービス層エラー」を**1リクエストのログにまとめて出す**。**Fastify で実現可能**:

- **YOU MUST**: `fastify.decorateRequest('errors', () => [])` で request に**エラー収集配列**を用意する。
- 各層でエラーが出たら `request.errors.push({ layer, code, message })` 等で**追記**する（layer 例: `repository`(DB) / `application`(サービス) / `domain`(業務ルール)。ROP の `Failure` を返す箇所で push）。
- **onSend** で `errors` をログに含める。これで失敗の内訳が**1ログ行で追える**。

## 秘密情報

- **NEVER**: 秘密情報・個人情報・トークン・パスワードをログ（request/response body 含む）に出さない（`security.md`）。必要なら sanitize / redact する。

## エラー監視

- 5xx・重大エラーは監視基盤（Sentry / Datadog 等）へ送る（ベンダーは別途選定）。`tenantId` / `requestId` / `errors` を文脈として含める。

## 非同期ジョブ

- **YOU MUST**: 非同期処理（`async-jobs.md`）も**同じ `tenantId` / 相関ID を引き継ぐ**（リクエスト経路外でも追跡可能に）。

## 原則

- ログは観測の手段。過剰ログを避け、**境界（入出力）・エラー・重要イベント**に絞る。
