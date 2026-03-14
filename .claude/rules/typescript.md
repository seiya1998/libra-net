---
paths:
  - "apps/**/*.ts"
  - "apps/**/*.tsx"
---

# TypeScript 型チェックルール

## 必須実行タイミング

以下の操作を行った直後、**必ず** `type-checker` サブエージェントを実行する：

1. `.ts` または `.tsx` ファイルを **Write** で新規作成したとき
2. `.ts` または `.tsx` ファイルを **Edit** で変更したとき

## 実行方法

Task tool を使用して `type-checker` サブエージェントを呼び出す：

```
subagent_type: "type-checker"
description: "TypeScript型チェック実行"
prompt: "型チェックを実行してください"
```

## 例外条件

以下の場合のみ、type-checker の実行を **スキップ可能**：

- TDD（テスト駆動開発）のためにテストファイルを先に作成する場合
- ユーザーが明示的に型チェックをスキップするよう指示した場合

## 重要事項

- 複数の `.ts`/`.tsx` ファイルを編集した場合でも、**1回の type-checker 呼び出しでまとめて型チェック可能**
- type-checker サブエージェントはコンテキスト分離のために独立している
- 型エラーの修正は type-checker サブエージェントではなく、メインエージェントが行う
