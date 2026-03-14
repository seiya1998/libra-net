# CLAUDE.md

YOU_MUST: ユーザーへの回答は常に日本語

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LibraNet は大学図書館SaaS のモノレポプロジェクトです。

### Repository Structure

```
apps/
├── admin/       (@libra-net/admin) - React 19 管理画面 SPA
├── opac/        - Next.js 利用者向け検索（予定）
└── server/      - Fastify バックエンド API（予定）
```

各アプリには固有の CLAUDE.md があります:
- [Admin Dashboard](./apps/admin/CLAUDE.md)

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
pnpm --filter @libra-net/<workspace> i <package>

# Run commands in specific workspace
pnpm --filter @libra-net/<workspace> <command>

# Examples:
pnpm --filter @libra-net/admin dev
pnpm --filter @libra-net/admin test
```

## Code Quality Checks

**IMPORTANT**: コードを編集した後は、必ず以下のコマンドを実行してリントエラーと TypeScript エラーがないことを確認してください：

```bash
pnpm --filter @libra-net/admin check-changed
```

`check-changed` コマンドは、変更されたファイルに対して ESLint と TypeScript のチェックを実行します。すべてのエラーと警告を修正してから作業を続けてください。

## Workflow

- 実装タスクに取り掛かる前は、必ずPlanモードに入って計画を立て、ユーザーの承認を得てから実装すること。

## Important Notes

- Monorepo using pnpm workspaces
- All packages use @libra-net namespace
- Refer to app-specific CLAUDE.md files for detailed guidance
