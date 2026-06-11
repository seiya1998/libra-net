# CLAUDE.md

YOU_MUST: ユーザーへの回答は常に日本語

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Libriori は大学図書館SaaS のモノレポプロジェクトです。

### Repository Structure

```
apps/
├── admin/       (@libriori/admin) - React 19 管理画面 SPA
├── opac/        - Next.js 利用者向け検索（予定）
└── server/      - Fastify バックエンド API（予定）
```

各アプリには固有の CLAUDE.md があります:
- [Admin Dashboard](./apps/admin/CLAUDE.md)
- [Server API](./apps/server/CLAUDE.md)
- [OPAC](./apps/opac/CLAUDE.md)

### 型安全な API 連携

- Server が OpenAPI 仕様を自動生成
- Aspida が型安全なクライアントコードを生成
- フロントエンドとバックエンド間の型整合性を保証
- API 変更後は `api:build` を実行してクライアントを再生成

## Environment Setup

1. **Prerequisites**
   - pnpm

2. **Initial Setup**
   ```bash
   pnpm i  # Install all dependencies
   ```

3. **.npmrc**
   - `enable-pre-post-scripts=true`: pre/post スクリプトの自動実行を有効化

## Common Commands

```bash
# Install dependencies for specific workspace
pnpm --filter @libriori/<workspace> i <package>

# Run commands in specific workspace
pnpm --filter @libriori/<workspace> <command>

# Examples:
pnpm --filter @libriori/admin dev
pnpm --filter @libriori/admin test
```

## Code Quality Checks

**IMPORTANT**: コードを編集した後は、必ず以下のコマンドを実行してリントエラーと TypeScript エラーがないことを確認してください：

```bash
pnpm --filter @libriori/admin check-changed
```

`check-changed` コマンドは、変更されたファイルに対して ESLint と TypeScript のチェックを実行します。すべてのエラーと警告を修正してから作業を続けてください。

## Workflow

- 実装タスクに取り掛かる前は、必ずPlanモードに入って計画を立て、ユーザーの承認を得てから実装すること。

## Git 規約

- **コミットメッセージ**: Conventional Commits ＋ gitmoji ＋ 日本語。形式 `<type>: :<emoji>: <説明>`
  - 例: `feat: :sparkles: 蔵書検索を追加` / `fix: :lady_beetle: 貸出延長のバグ修正`
  - type: `feat` / `fix` / `refactor` / `docs` / `test` / `chore` など
- **ブランチ名**: `<type>/<簡潔な内容>`（例 `feat/book-search`）
- **PR**: 目的・主な変更点・動作確認方法を記載
- main へ直接コミットしない（ブランチ → PR）

## Important Notes

- Monorepo using pnpm workspaces
- All packages use @libriori namespace
- Refer to app-specific CLAUDE.md files for detailed guidance
