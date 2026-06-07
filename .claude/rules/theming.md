---
paths:
  - 'apps/admin/**'
  - 'apps/opac/**'
---

# テナント別テーマ規約（admin・opac 共通）

契約大学ごとにプライマリカラー等をカスタマイズする。同一デプロイで全テナントを賄うため、**実行時 CSS 変数 ＋ テナント設定駆動**にする（ビルド時に大学ごとに分岐しない）。

## 方針

- **YOU MUST**: テーマ色は **CSS 変数**で定義し、Tailwind のテーマをその CSS 変数にバインドする（例: `--color-primary` → Tailwind の `primary`）。
- **YOU MUST**: テーマ設定（プライマリカラー等）は**テナント解決後にサーバー側で取得**し、ルート要素に CSS 変数として適用する（admin = SPA 起動時 / opac = RSC レイアウト）。
- **NEVER**: 大学ごとに色をハードコードしたり、ビルドを分けたりしない。
- **NEVER**: テーマ対象箇所に Tailwind の固定色クラス（例 `bg-blue-500`）を直書きしない（CSS 変数経由の色トークンを使う）。

## 最小例（形のみ）

```css
:root { --color-primary: #1d4ed8; } /* テナント設定で実行時に上書き */
```

```js
// tailwind.config: theme.extend.colors.primary = 'var(--color-primary)'
```
