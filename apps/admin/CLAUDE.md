# CLAUDE.md - Admin Dashboard

大学図書館SaaS 管理画面 (@libra-net/admin)

## 技術スタック

- **ビルドツール**: Vite
- **フレームワーク**: React 19
- **ルーティング**: TanStack Router（ファイルベース）
- **スタイリング**: Tailwind CSS
- **フォーム**: React Hook Form + Zod バリデーション
- **サーバー状態管理**: TanStack Query
- **APIクライアント**: OpenAPI から Aspida で自動生成
- **コンポーネント開発**: Storybook
- **テスト**: Jest + ts-jest

## コマンド

```bash
# 開発
pnpm dev              # 開発サーバー起動（API ビルド含む）
pnpm build            # 型チェック + プロダクションビルド
pnpm preview          # ビルド結果プレビュー

# 品質チェック
pnpm lint             # ESLint 実行
pnpm check-changed    # 変更ファイルの lint + tsc チェック

# テスト
pnpm test             # Jest テスト実行
pnpm test --watch     # ウォッチモード
pnpm test --coverage  # カバレッジ付き

# API クライアント生成
pnpm api:build        # OpenAPI → Aspida クライアント再生成

# Storybook
pnpm storybook        # Storybook 起動
pnpm build-storybook  # 静的 Storybook ビルド
```

## 開発ルール

詳細なコーディング規約は `.claude/rules/admin/` を参照。
