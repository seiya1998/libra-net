---
paths:
  - 'apps/server/**/*.ts'
---

# API レスポンス規約

型生成は `schema.md`、ROP のエラーハンドリングは `handler.md`。本ファイルは**レスポンスの形と HTTP ステータス**を全エンドポイントで統一する。

## HTTP ステータスコード（REST）

成否は **HTTP ステータスコード**で表す（body に `success` フラグは付けない＝内部 `Result.success` とは別レイヤー）。ドメインエラーの `Failure.errorCode` を下記に写像する（`handler.md`）。

- **2xx**: `200 OK`（取得/更新）・`201 Created`（作成）・`204 No Content`（削除等・本文なし）
- **4xx**: `400 Bad Request`（バリデーション）・`401 Unauthorized`（未認証）・`403 Forbidden`（認可なし）・`404 Not Found`・`409 Conflict`（重複・状態矛盾）・`422 Unprocessable Entity`（業務ルール違反・任意）・`429 Too Many Requests`（レート制限）
- **5xx**: `500 Internal Server Error`

## 成功レスポンス

- **単一リソース**: リソースをそのまま返す（取得 `200` / 作成 `201`）。
- **一覧**: **ページング envelope** `{ items: T[]; nextCursor: string | null }`（カーソルページング。`performance.md`）。

## エラーレスポンス（統一形）

- **YOU MUST**: エラー本文は **`{ error: { code: string; message: string } }`**。
  - `code`: 機械可読の安定キー（例 `LOAN_LIMIT_EXCEEDED` / `BAD_REQUEST` / `NOT_FOUND`）。**フロントは `code` で分岐・i18n 翻訳**する。
  - `message`: 開発/フォールバック用の説明（ユーザー表示前提にしない）。
- この形を JSON Schema の `response` に定義する（`schema.md`。OpenAPI に反映され admin/opac の型になる）。

## バージョニング

- 現状は**不要**（admin/opac は first-party で OpenAPI 再生成により追従）。外部公開 API が必要になった時点で `/v1` 等を導入する。
