# 大学図書館SaaS管理画面

## 技術スタック
- ビルドツール: Vite
- フレームワーク: React 19
- ルーティング: TanStack Router（ファイルベース）
- スタイリング: Tailwind CSS
- フォーム: React Hook Form + Zod バリデーション
- サーバー状態管理: TanStack Query
- APIクライアント: OpenAPI から Aspida で自動生成
- コンポーネント開発: Storybook

## コマンド
- `pnpm dev` - 開発サーバー起動
- `pnpm build` - 型チェック + ビルド
- `pnpm lint` - リント
- `pnpm preview` - ビルド結果プレビュー

## 開発ルール

### 1. TypeScript 厳格モード
- `any` 型禁止
- null/undefined の明示的チェック
- 適切な型推論の活用

### 2. コンポーネント規約
- 関数コンポーネント + named export
- Props は interface で定義
- スタイルは Tailwind CSS のユーティリティクラスを使用

### 3. フォーム処理
- React Hook Form + Zod バリデーションを常に使用

### 4. API 連携
- Aspida で自動生成したクライアントを使用
- TanStack Query でデータ取得
