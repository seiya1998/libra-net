---
paths:
  - 'apps/opac/**'
---

# レンダリング・データ取得ルール

OPAC は公開ページで **SEO と初期表示速度**が効く。HTML はサーバー生成し、CSR で indexable コンテンツを描画しない。

## キャッシュ戦略（ルートごとに選ぶ）

| ルート | 戦略 | 理由 |
|---|---|---|
| 蔵書詳細 `/books/[id]` | **ISR**（`generateStaticParams` ＋ `revalidate`、在庫変更時に on-demand revalidate） | URL 安定・件数有限。SEO◎・高速・スケール |
| 検索結果 | **動的 SSR**（`dynamic` / `no-store`）＋ Suspense streaming | クエリが無限で ISR 不向き。SSR でも HTML はサーバー生成で SEO◎ |
| 静的ページ（ヘルプ等） | 静的 | 変化しない |

## データ取得

- **YOU MUST**: Server Component でのサーバー側取得を既定にする。
- **YOU MUST**: API は server 生成の OpenAPI → Aspida クライアント（admin と同じ型の源泉）。
- **YOU MUST**: client 取得が必要な箇所のみ最小限に（過度な `'use client'` を避ける）。
- **NEVER**: 取得を CSR に寄せて初期 HTML を空にしない（SEO 劣化）。
- **NEVER**: 秘密情報や内部 URL を Client Component に渡さない（`security.md` 参照）。

## App Router 特殊ファイル

- **YOU MUST**: 各セグメントに `loading.tsx`（即時スケルトン）・`error.tsx`（エラー境界）・`not-found.tsx`（404）を用意する。

## SEO / メタデータ

公開検索なので SEO は必須。

- **YOU MUST**: 各ページで Metadata API を設定する（静的 `metadata` / 動的 `generateMetadata`）。蔵書詳細は書名・著者などを動的メタデータに反映。
- **YOU MUST**: canonical URL・OG タグ・`[locale]` ごとの hreflang を設定する。

## ストリーミング境界

- 遅いデータ取得は **Suspense で分割**し、速い部分を先に描画する（streaming）。検索結果一覧はストリーミング、周辺 UI は即時表示。

## アセット最適化

- 画像（書影）は `next/image`（サイズ指定・遅延読み込み）、フォントは `next/font`。

## 最小例（形のみ）

```typescript
// books/[id]/page.tsx（ISR）
export const revalidate = 3600;
export async function generateStaticParams() { /* 主要IDのみ事前生成 */ return []; }
export default async function Page({ params }: { params: { id: string } }) {
  const book = await fetchBook(params.id); // サーバー側取得
  return <BookDetail book={book} />;
}
```
