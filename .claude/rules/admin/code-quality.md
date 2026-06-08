---
paths:
  - "apps/admin/**/*.ts"
  - "apps/admin/**/*.tsx"
---

# admin コード品質ルール

> React の共通ベストプラクティス（メモ化・パフォーマンス・useEffect 制限・カスタムフック・コンポーネント設計）は `.claude/rules/react-quality.md`、TypeScript 厳密化は `.claude/rules/typescript-quality.md` を参照。本ファイルは admin 固有のみ。

## 環境・コマンド

- **YOU MUST**: コマンドは filter 指定で実行（例: `pnpm --filter @libra-net/admin <command>`）。`package.json` の `scripts` を確認してから実行。

```bash
pnpm --filter @libra-net/admin lint
pnpm --filter @libra-net/admin test
```

## 状態管理（admin 固有）

- サーバー状態は **TanStack Query** で管理する（`useState` に入れない）。詳細は `api-integration.md`。

## 必須要件（YOU MUST）

- **YOU MUST**: すべてのコンポーネントに Storybook のストーリーを作成（`storybook.md`）。
- **YOU MUST**: 包括的なエラーハンドリングとローディング状態を実装（`error-loading.md`）。
- **YOU MUST**: アクセシビリティを考慮。
- **YOU MUST**: タスク完了時にすべての一時ファイルをクリーンアップ。

## 重要な考慮事項（IMPORTANT）

- **IMPORTANT**: 既存のコードパターンと規約に従う。
- **IMPORTANT**: エッジケースやエラーシナリオのテストを行う。
- **IMPORTANT**: パフォーマンスとユーザー体験を最適化する。
