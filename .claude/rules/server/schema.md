---
paths:
  - 'apps/server/**/schema.ts'
---

# Schema ファイル規約（presentation 層）

`schema.ts` は presentation 層で API の入出力契約を JSON Schema で定義する。ここから型を生成し、`@fastify/swagger` 経由で OpenAPI（`apps/server/docs/openapi-for-admin.yaml`）を生成する。OpenAPI は admin が Aspida で取り込むため、**schema.ts がフロントの型の源泉**になる。ORM 非依存（DB スキーマとは独立に入出力契約だけを定義）。

## 規約

- **YOU MUST**: JSON Schema でリクエスト/レスポンスを定義し、`as const satisfies JSONSchema` を付ける。
- **YOU MUST**: `GenerateRequestTypes` / `GenerateResponseTypes`（`@/shared/types`）で型を生成する。
- **YOU MUST**: 成功は 2xx（一覧/詳細は `200`、新規作成は `201`）、失敗は 4xx/5xx の HTTP ステータスで表現する。
- **NEVER**: HTTP レスポンスボディに `success` フラグを足さない（成否は**ステータスコード**＝REST。`api-response.md`）。※内部の `Result.success`（ROP 制御）とは別レイヤー。
- **NEVER**: プロパティを `snake_case` で定義しない（`common.md` の camelCase 規約）。

## 検証の役割分担（重要）

- **request の実検証は `validateParams`（`extractParamsForXxx` 内）で行う**（rule ベース・`Result<T, { errorCode: 400 }>` を返す。`handler.md` / `shared.md`）。
- **`schema.ts` の request 部は型生成・OpenAPI が主目的**。Fastify の schema 検証と `validateParams` の**二重がけを避け、業務的な検証は `validateParams` に寄せる**。
- response 部は型生成・OpenAPI・高速シリアライズ（fast-json-stringify）に使う。

## 最小例（形のみ）

```typescript
import type { JSONSchema } from 'json-schema-to-ts';
import { GenerateRequestTypes, GenerateResponseTypes } from '@/shared/types';

export const xxxSchemas = {
  get: {
    querystring: { type: 'object', properties: { /* ... */ } } as const satisfies JSONSchema,
    response: {
      200: { type: 'object', properties: { /* ... */ } } as const satisfies JSONSchema,
      500: { type: 'object', properties: { error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } } } } as const satisfies JSONSchema,  // api-response.md

    },
  },
};

export type GetXxxRequest = GenerateRequestTypes<typeof xxxSchemas.get>;
export type GetXxxResponse = GenerateResponseTypes<typeof xxxSchemas.get.response>;
```

## 完了チェックリスト

- [ ] `pnpm --filter @libriori/server tsc --noEmit` で型エラーがない
- [ ] 指定されたリクエスト/レスポンス項目がスキーマに含まれている
- [ ] スキーマから型が生成されている
- [ ] プロパティが camelCase
