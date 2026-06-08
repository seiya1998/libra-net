---
paths:
  - 'apps/server/**/*.ts'
---

# 外部連携・検索の腐敗防止層

外部システム（国立国会図書館 API、Google カレンダー、AI）と**検索**は、**infrastructure 層のアダプタ＝腐敗防止層**として隔離する。

## ポートとアダプタ

- **YOU MUST**: domain に**ポート（インターフェース）**を定義し、infrastructure に実装（アダプタ）を置く。
  - 例: ポート `Bibliography`（実装 factory `ndlBibliography(env)`）、`Calendar`（`googleCalendar(...)`）、`Search`（MySQL FULLTEXT 実装）。ポートは clean な型名、実装は factory・連携先名（`naming.md`）。
- **YOU MUST**: 外部モデルは**境界で domain モデルに変換**する（外部の生レスポンス型を内側へ漏らさない）。
- **NEVER**: domain / application が外部 SDK・HTTP クライアント・検索エンジン SDK を直接 import しない（必ずポート経由）。

## 耐障害性

- **YOU MUST**: timeout / retry / フォールバックを実装する。
  - 例: NDL 不通時は手動登録に退避し、コア処理（蔵書登録）を止めない。
- 外部呼び出しの失敗はドメインエラーに翻訳し、`Result` で返す。

## 検索

- 検索は `ISearch` で抽象化する。現状の実装は **MySQL FULLTEXT**（`performance.md`）。将来の外部検索エンジン移行はアダプタ差し替えで吸収する。
