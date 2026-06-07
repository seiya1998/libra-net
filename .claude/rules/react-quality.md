---
paths:
  - 'apps/admin/**/*.ts'
  - 'apps/admin/**/*.tsx'
  - 'apps/opac/**/*.ts'
  - 'apps/opac/**/*.tsx'
---

# React / コンポーネントベストプラクティス（admin・opac 共通）

React 19 アプリ共通の実装規約。TS 厳密化は `typescript-quality.md`、アプリ固有（admin: TanStack Router/Query・Storybook、opac: App Router/RSC・next-intl）は各アプリのルールを参照。

## コンポーネント設計

- **YOU MUST**: 関数コンポーネント＋named export。Props は interface / type で定義。
- **NEVER**: default export を使わない。
- ローディング・エラー状態のハンドリングを実装する（admin は `error-loading.md`、opac は `rendering-data.md` も参照）。

## React 19 の活用

- `ref` は props で直接受け取る（`forwardRef` 不要）。
- `use()` でコンテキスト／プロミスを読み取る。
- `useTransition` / `useActionState` / `useOptimistic` を適宜活用する。

## 状態管理

- 単一の値は `useState`、関連する複数 state や複雑な更新ロジックは `useReducer`。
- **NEVER**: サーバー状態をローカル state（`useState`）に入れない（admin = TanStack Query / opac = RSC・サーバー取得）。

## メモ化（必要な時だけ）

- `React.memo` を使うべき: リストアイテム / レンダリングコストが高い / 親が頻繁に再描画されるが props は不変。
- 不要: ほぼ毎回 props が変わる / 極めて軽量（比較コスト > 描画コスト）。
- **YOU MUST**: 計算コストの高い値は `useMemo`。`memo` した子に渡すコールバックは `useCallback` で安定化。
- 一律メモ化はしない（比較コストの無駄）。

## useEffect 制限

- 副作用にのみ使う（DOM 操作・購読・外部システム同期）。
- **NEVER**: データ変換（`useMemo`）／イベント応答（ハンドラ）／派生 state（描画中に計算）／props 変更への反応 に使わない。

## カスタムフック

- **YOU MUST**: ビジネスロジックはカスタムフックに抽出（コンポーネントは表示責務）。
- `use` プレフィックス＋責務名（例: `useBookSearch`）。

## パフォーマンス

- 計測に基づき最適化する（リスト仮想化・コード分割など）。早すぎる最適化はしない。
