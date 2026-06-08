---
paths:
  - 'apps/server/**/_handlers.e2e.test.ts'
---

# E2E テストファイル規約

実際に API リクエストを投げてレスポンスを検証する（Fastify の `server.inject()`）。DB は **Drizzle のテスト用インスタンス**（インメモリ DB 等）を使い、リポジトリ実装をテスト用に差し替える。

## 規約

- **YOU MUST**: 正常系・異常系の両方を含める。
- **YOU MUST**: テストデータは seed 関数で投入する。
- **NEVER**: `jest.spyOn` でテストデータを投入しない。
- リポジトリ／DB の差し替えは DI 合成ルート経由で行う（実装ロジックをモックで潰さず、テスト用 DB に向ける）。

## 最小例（形のみ）

```typescript
import fastify from 'fastify';
// テスト用 Drizzle インスタンス（インメモリ DB）を構築 → seed 投入 → サーバー登録

test('正常系', async () => {
  const res = await server.inject({ method: 'GET', url: '/xxx' });
  expect(res.statusCode).toBe(200);
});

test('異常系 - 404', async () => {
  const res = await server.inject({ method: 'GET', url: '/xxx/not-exist' });
  expect(res.statusCode).toBe(404);
});
```

## 完了チェックリスト

- [ ] 正常系・異常系を含む
- [ ] `jest.spyOn` でのテストデータ投入なし
- [ ] `pnpm --filter @libra-net/server test:e2e` が全て通る
