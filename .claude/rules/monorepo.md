---
paths:
  - 'apps/**/*.ts'
  - 'apps/**/*.tsx'
  - 'packages/**/*.ts'
  - 'packages/**/*.tsx'
---

# モノレポ構成・共有コード規約

pnpm workspace。**`apps/*`**（アプリ: admin / server / opac）＋ **`packages/*`**（共有ライブラリ）。

## 原則

- **NEVER**: アプリ間で**直接 import しない**（`apps/admin` から `apps/opac` 等を直接参照しない）。
- **YOU MUST**: 複数アプリで使うコードは **`packages/<name>` に切り出し**、各アプリがパッケージとして依存する。
- **早すぎる共通化はしない**: 実際に 2 アプリで使う段になってから `packages/` 化する（co-location 原則と同じ）。

## API クライアント

- 各フロント（admin / opac）は server の OpenAPI から **Aspida クライアントを各々生成**する（admin=`/admin/*` 面、opac=root 面。別 OpenAPI）。
- **NEVER**: `apis/` 配下を手動編集（`pnpm api:build` で自動生成）。

## 共有候補（必要になったら `packages/` へ）

- ドメイン定数 / enum（蔵書ステータス・カテゴリ等）
- UI トークン / プリミティブ（admin・opac のテーマ統一＝`theming.md` と整合）
- 汎用ユーティリティ

## コマンド

- ワークスペース指定で実行: `pnpm --filter @libra-net/<workspace> <command>`
