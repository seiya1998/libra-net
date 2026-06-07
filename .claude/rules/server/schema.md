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
- **NEVER**: レスポンスに `success` フラグを足さない（ステータスコードで成否を表現）。
- **NEVER**: プロパティを `snake_case` で定義しない（`common.md` の camelCase 規約）。

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

- [ ] `pnpm --filter @libra-net/server tsc --noEmit` で型エラーがない
- [ ] 指定されたリクエスト/レスポンス項目がスキーマに含まれている
- [ ] スキーマから型が生成されている
- [ ] プロパティが camelCase
