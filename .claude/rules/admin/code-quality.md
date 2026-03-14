---
paths:
  - "apps/admin/**/*.ts"
  - "apps/admin/**/*.tsx"
---

# コード品質ルール

## 環境構築

- **YOU MUST**: コマンドは filter 指定で実行（例: `pnpm --filter @libra-net/admin <command>`）
- **YOU MUST**: `package.json` の `scripts` セクションを確認してから実行

## コード品質コマンド

```bash
pnpm --filter @libra-net/admin lint
pnpm --filter @libra-net/admin test
```

---

## 状態管理ベストプラクティス

- 複数の関連する useState を使用する場合は、useReducer でまとめて管理
- 単一の状態値の場合は useState を使用
- 状態の更新ロジックが複雑な場合は useReducer を優先
- サーバー状態は TanStack Query で管理（useState に入れない）

---

## TypeScript 厳密型チェック

**このルールはプロジェクト全体で最も重要な規約の一つです。例外は認められません。**

### 必須ルール

- **YOU MUST**: `!== undefined` での明示的チェック（truthiness チェック禁止）
- **YOU MUST**: exactOptionalPropertyTypes 対応
- **YOU MUST**: nullable 型の明示的判定
- **NEVER**: `any` 型を使用しない

---

## 絶対的禁止事項（NEVER）

- **NEVER**: TypeScript で `any` 型を使用しない
- **NEVER**: nullable な値に対して暗黙的な真偽値チェックを使用しない
- **NEVER**: 不要な新規ファイルを作成しない（既存ファイルの編集を優先）
- **NEVER**: 明示的に要求されていない限り、ドキュメントファイルを作成しない
- **NEVER**: 配列インデックスの存在確認なしでアクセスしない

---

## 必須要件（YOU MUST）

- **YOU MUST**: すべてのコンポーネントに対して Storybook のストーリーを作成
- **YOU MUST**: 包括的なエラーハンドリングとローディング状態を実装
- **YOU MUST**: アクセシビリティを考慮
- **YOU MUST**: タスク完了時にすべての一時ファイルをクリーンアップ

---

## メモ化

パフォーマンス上の必要性がある場合にメモ化する。不要なメモ化は比較コストを増やすだけ。

### React.memo を使うべき場合
- リスト内のアイテムコンポーネント
- レンダリングコストが高いコンポーネント
- 親が頻繁に再レンダリングされるが、自身の props は変わらないコンポーネント

### React.memo が不要な場合
- ほぼ毎回 props が変わるコンポーネント
- 非常に軽量なコンポーネント（比較コスト > レンダリングコスト）
- ルートに近い少数のコンポーネント

### useMemo / useCallback
- **YOU MUST**: 計算コストの高い値は `useMemo` でキャッシュ
- **YOU MUST**: `memo` でラップした子コンポーネントに渡すコールバックは `useCallback` で安定化

---

## useEffect 制限

**useEffect は副作用にのみ使用する。「とりあえず useEffect」は禁止。**

### 使用して良い場合（副作用）
- DOM 操作（フォーカス、スクロール）
- サブスクリプション（WebSocket、イベントリスナー）
- 外部システムとの同期

### 使用してはいけない場合
- **NEVER**: データの変換（useMemo を使用）
- **NEVER**: イベントへの応答（イベントハンドラで処理）
- **NEVER**: state の派生計算（レンダリング中に計算）
- **NEVER**: props 変更への反応（コンポーネントのロジックで処理）

---

## カスタムフック

- **YOU MUST**: ビジネスロジックはカスタムフックに抽出（コンポーネントは表示責務のみ）
- **YOU MUST**: API 呼び出し、フォームロジック、複雑な状態管理はフックに分離
- フック名は `use` プレフィックス + 責務を表す名前（例: `useBookSearch`, `useLoanForm`）

---

## 重要な考慮事項（IMPORTANT）

- **IMPORTANT**: 既存のコードパターンと規約に従う
- **IMPORTANT**: 思慮深いインタラクションやマイクロアニメーションを追加
- **IMPORTANT**: エッジケースやエラーシナリオのテストを行う
- **IMPORTANT**: パフォーマンスとユーザー体験の最適化
