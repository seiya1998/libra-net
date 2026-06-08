# LibraNet ドキュメント

仕様駆動ワークフローの土台。`inputs/` の生情報を消化して docs を更新し、docs から GitHub Issue を起票して実装につなげる。

## ID 規約

| 要素 | 形式 | 置き場所 |
|---|---|---|
| エピック | `EP-NNN`（例 `EP-001`） | requirements と spec で**同名** `EP-NNN-{domain}.md`（1:1 ミラー） |
| ストーリー | `US-NNN`（全体通し連番） | requirements の EP ファイル内 |
| 機能 | `F-NN`（EP ファイル内でローカル採番） | spec の EP ファイル内 |
| 決定 | `ADR-NNN` | `decisions.md` |
| 未決事項 | `Q-NNN` | `questions.md` |

## ディレクトリ

```
docs/
├── README.md            # 本ファイル（索引・規約）
├── .source-map.md       # docs 更新時の情報源マップ
├── requirements/        # 要件定義（EP-NNN-{domain}.md）
├── spec/                # 機能仕様（requirements と 1:1 ミラー）
├── glossary.md          # 用語集（1 日本語 = 1 英語）
├── schema.md            # DB スキーマ（基本設計で整備）
├── api.md               # API 定義（基本設計で整備）
├── architecture.md      # システムアーキテクチャ
├── decisions.md         # 意思決定記録（ADR）
└── questions.md         # 未決事項
```

## 依存グラフ / 更新順序

`requirements → spec → glossary → schema → api → architecture → decisions → questions`

## 更新フロー（今回導入の基盤）

1. **`/digest-inputs`**: `inputs/` を消化して requirements / spec / decisions / glossary / questions を更新。
2. **`/sync-feature-issues`**: `spec/EP-*.md` から GitHub Issue（`feature-epic`）を起票。

> 基本設計・詳細設計・実装の自動化（update-basic-design-docs / create-detail-design-issues / implement-issue）は今回未導入。
