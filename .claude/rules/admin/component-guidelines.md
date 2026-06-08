---
paths:
  - "apps/admin/**/*.tsx"
---

# admin コンポーネントガイドライン

React コンポーネントの共通規約（関数コンポーネント＋named export、Props interface、React 19 の `ref`/`use()`、メモ化、ロジック分離、useEffect 制限）は **`.claude/rules/react-quality.md`** に統合した。

admin 固有のガイドラインは以下を参照:

- フォーム: `form-handling.md`（React Hook Form + Zod）
- API 連携: `api-integration.md`（Aspida + TanStack Query）
- ローディング / エラー: `error-loading.md`（Suspense / ErrorBoundary）
- Storybook: `storybook.md`
