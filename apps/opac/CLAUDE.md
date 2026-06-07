# CLAUDE.md - OPAC（利用者向け検索）

大学図書館SaaS 利用者向け蔵書検索 (@libra-net/opac)

> 未着手（ディレクトリ新規）。本書と `.claude/rules/opac/` は「これから建てる実装を導く規約」。

## 技術スタック

- **フレームワーク**: Next.js（**App Router**）
- **レンダリング**: React Server Components 中心。蔵書詳細 = ISR、検索結果 = 動的 SSR
- **i18n**: next-intl（`[locale]` ルーティング）
- **スタイリング**: Tailwind CSS（admin と統一）
- **API**: server が生成する OpenAPI を Aspida で取込（admin と同じ型の源泉）
- **言語**: React 19 / TypeScript

## コマンド（想定。opac の package.json に定義する）

```bash
pnpm --filter @libra-net/opac dev          # 開発サーバー
pnpm --filter @libra-net/opac build        # 本番ビルド
pnpm --filter @libra-net/opac lint         # ESLint
pnpm --filter @libra-net/opac tsc --noEmit # 型チェック
```

## 開発ルール

詳細は `.claude/rules/opac/`（`project-structure` / `rendering-data` / `i18n` / `security`）を参照。
