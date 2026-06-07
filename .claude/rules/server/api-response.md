---
paths:
  - 'apps/server/**/*.ts'
---

# API レスポンス規約

型生成は `schema.md`、ROP のエラーハンドリングは `handler.md`。本ファイルは**レスポンスの形**を全エンドポイントで統一する。

## 成功レスポンス

- **単一リソース**: リソースをそのまま返す（取得 `200` / 作成 `201`）。
- **一覧**: **ページング envelope** `{ items: T[]; nextCursor: string | null }`（カーソルページング。`performance.md`）。
- 成否は HTTP ステータスで表す（`schema.md`。`success` フラグは付けない）。

## エラーレスポンス（統一形）

- **YOU MUST**: エラー本文は **`{ error: { code: string; message: string } }`** で統一する。
  - `code`: 機械可読の安定キー（例 `LOAN_LIMIT_EXCEEDED` / `BAD_REQUEST` / `NOT_FOUND`）。**フロントは `code` で分岐・i18n 翻訳**する。
  - `message`: 開発/フォールバック用の説明（人間向け。これを直接ユーザーに見せる前提にしない）。
- ドメインエラー → `Failure(errorCode: number)` → handler が HTTP ステータス＋上記 body に写像（`handler.md`）。
- この形を JSON Schema の `response` に定義する（`schema.md`。OpenAPI に反映され admin/opac の型になる）。

## バージョニング

- 現状は**不要**（admin/opac は first-party で、OpenAPI 再生成により追従するため）。
- 外部公開 API が必要になった時点で `/v1` プレフィックス等を導入する（その時に決定）。
