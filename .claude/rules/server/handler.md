---
paths:
  - 'apps/server/**/_handlers.ts'
---

# Handler ファイル規約（presentation 層 / ROP）

handlers は presentation 層。`routes/<surface>/<resource>/[_method]/_handlers.ts` に置く（多メソッドは `_get` / `_post` 等で分割。`architecture.md`）。**ROP** でユースケース（application）の `Result` を HTTP に写像するだけにする。ビジネスロジック・DB アクセスは書かない。

## 規約（ROP）

- **YOU MUST**: `pipe → start → bypass(useCase) → match(...).exhaustive()` で構成する。
- **YOU MUST**: **`extractParamsForXxx` は `validateParams` でリクエストを検証**し `Result<Params, { errorCode: 400 }>` を返す（`schema.md` / `shared.md`）。検証失敗は `bypass` でスキップされ 400 に写像。
- **YOU MUST**: `bypass` で呼ぶのは**合成ルートで deps 注入済みのユースケース**。`useCase(ctx)` で `TenantContext` を束縛し `(params) => Result` を得る。
- **NEVER**: `.otherwise()` を使わない（`.exhaustive()` で全エラーを網羅）。
- **NEVER**: handler から Drizzle・リポジトリを直接呼ぶ / 新規ロジックを書く（application 経由）。
- エラー本文は `{ error: { code, message } }`（`api-response.md`）。

## 最小例（形のみ）

```typescript
import type { FastifyInstance } from 'fastify';
import { pipe } from 'ramda';
import { match } from 'ts-pattern';
import { extractParamsForRegisterBook } from './extractParams'; // validateParams で検証 → Result
import { registerBook } from '@/shared/di';                     // 合成ルートで deps 注入済みのユースケース
import { createBookSchemas } from './schema';
import { start, bypass } from '@/shared/railway';

export default async function (fastify: FastifyInstance) {
  fastify.post('/', { schema: createBookSchemas['post'] }, async (request, reply) => {
    const ctx = request.tenantContext; // middleware が解決（multi-tenancy.md）
    return pipe(
      start(extractParamsForRegisterBook(request)), // Result<Params, { errorCode: 400 }>
      bypass(registerBook(ctx)),                    // 成功時のみ実行。registerBook(ctx) は (params) => Result
      async (r) =>
        match(await r)
          .with({ success: false, error: { errorCode: 400 } }, () => reply.code(400).send({ error: { code: 'BAD_REQUEST', message: 'Bad Request' } }))
          .with({ success: false, error: { errorCode: 409 } }, () => reply.code(409).send({ error: { code: 'CONFLICT', message: 'Conflict' } }))
          .with({ success: false, error: { errorCode: 500 } }, () => reply.code(500).send({ error: { code: 'INTERNAL', message: 'Internal Server Error' } }))
          .with({ success: true }, ({ data }) => reply.code(201).send(data))
          .exhaustive(),
    )();
  });
}
```

## 完了チェックリスト

- [ ] `pipe` / `start` / `bypass` / `match.exhaustive()` で構成（`.otherwise()` 不使用）
- [ ] `extractParamsForXxx` が `validateParams` で検証し `Result` を返す
- [ ] `bypass` は ctx 束縛済みユースケース（`useCase(ctx)`）
- [ ] エラー本文は `{ error: { code, message } }`
- [ ] handler から Drizzle・リポジトリを直接呼んでいない
- [ ] `pnpm --filter @libriori/server tsc --noEmit` / `test:e2e` / `lint` が通る
