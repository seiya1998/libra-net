---
paths:
  - 'apps/**/*.ts'
  - 'apps/**/*.tsx'
---

# テスト戦略・配置（admin・server・opac 共通）

## 配置・ランナー

- **YOU MUST**: テストは **co-location**（対象の隣に `<対象>.test.ts(x)`）。
- ランナーは **Jest**（全 app 共通）。
- server の HTTP E2E は `_handlers.e2e.test.ts`（`server/e2e-test.md`）。

## 方針（テストピラミッド）

- 単体を厚く、結合・E2E は要所に絞る。
- **振る舞い**を検証する（内部実装の詳細に結合しない）。
- **YOU MUST**: `Result` を返す関数は**成功・失敗の両レール**をテストする。
- **NEVER**: `test.skip` で恒久的にスキップ／実装詳細（呼び出し回数等）に過度に結合。

## server（層ごと）

- **domain（エンティティ／値オブジェクト／ドメインサービス）**: 純粋なので**依存なしで単体テスト**（不変条件・業務ルール・`Result`）。
- **application（ユースケース）**: **リポジトリ/外部ポートをフェイク実装で注入**して単体テスト（DB 不要）。カリー化 DI なのでフェイク注入が容易。
- **infrastructure（リポジトリ実装）**: **テスト用 DB**（インメモリ等）で結合テスト。
- **YOU MUST**: **テナント分離テスト**（他テナントの行が読めない/書けないこと）を必ず含める（`multi-tenancy.md`）。

```ts
// application/books/BookService.test.ts（ユースケース単体・ポートをフェイク注入）
const fakeBooks: BookRepository = {
  save: async (_ctx, b) => ({ success: true, data: b }),
  findByIsbn: async () => ({ success: true, data: null }),
};
const uc = registerBook({ books: fakeBooks, bibliography: fakeBib });
expect(await uc(ctx)(input)).toMatchObject({ success: true }); // 失敗系も別ケースで検証
```

## admin / opac（React）

- コンポーネント/フックは **Testing Library** で**ユーザー視点の振る舞い**を検証（実装詳細をテストしない）。
- **admin**: Storybook も併用（`admin/storybook.md`）。
- **opac**: 検索状態(URL)・レンダリング(SSR/ISR)の要所を検証（`opac/search-performance.md`・`rendering-data.md`）。

## 原則

- ポートのフェイクで十分（重いモックライブラリは基本不要）。
- テストは仕様（振る舞い）のドキュメントになるよう、ケース名を明確に。
