---
paths:
  - 'apps/server/**/_handlers.ts'
---

# Handler ファイル規約（presentation 層 / ROP）

handlers は presentation 層。**ROP** でユースケース（application）の `Result` を HTTP に写像するだけにする。ビジネスロジックや DB アクセスは書かない（application / infrastructure の責務）。

## 規約（ROP）

- **YOU MUST**: `pipe → start → bypass(useCase) → match(...).exhaustive()` で構成する。
- **NEVER**: `.otherwise()` を使わない（`.exhaustive()` で全エラーを網羅）。
- **YOU MUST**: `start` / `bypass` の引数は関数名を指定（アロー関数禁止）。
- **YOU MUST**: `bypass` で呼ぶのはユースケース（application）。handler 内に新規関数を定義しない。
- **NEVER**: handler から Drizzle・リポジトリを直接呼ばない（application 経由）。

## 最小例（形のみ）

```typescript
import type { FastifyInstance } from 'fastify';
import { pipe } from 'ramda';
import { match } from 'ts-pattern';
import { extractParams } from './extractParams';
import { getXxx } from '@/application/xxx/XxxService'; // application サービスのユースケース（実運用は DI で注入）
import { xxxSchemas } from './schema';
import { start, bypass } from '@/shared/railway';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', { schema: xxxSchemas['get'] }, async (request, reply) =>
    pipe(
      start(extractParams(request)),
      bypass(getXxx),
      async (result) =>
        match(await result)
          .with({ error: { errorCode: 400 } }, () => reply.code(400).send({ error: { code: 'BAD_REQUEST', message: 'Bad Request' } }))
          .with({ error: { errorCode: 500 } }, () => reply.code(500).send({ error: { code: 'INTERNAL', message: 'Internal Server Error' } }))
          .with({ success: true }, ({ data }) => reply.code(200).send(data))
          .exhaustive(),
    )(),
  );
}
```

> ユースケースへのリポジトリ注入は合成ルート（`shared/`）で行う。handler はユースケースを呼ぶだけ（詳細は `architecture.md`）。

## 完了チェックリスト

- [ ] `pipe` / `start` / `bypass` / `match.exhaustive()` で構成（`.otherwise()` 不使用）
- [ ] `start` / `bypass` の引数がアロー関数でない
- [ ] `bypass` はユースケースを呼ぶ（handler 内に新規関数なし）
- [ ] handler から Drizzle・リポジトリを直接呼んでいない
- [ ] `pnpm --filter @libra-net/server tsc --noEmit` / `test:e2e` / `lint` が通る
