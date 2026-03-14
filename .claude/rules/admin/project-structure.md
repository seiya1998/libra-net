---
paths:
  - "apps/admin/**"
---

# プロジェクト構造ルール

## ディレクトリ構成（Feature-based）

```
src/
├── routes/              # TanStack Router ページ
│   ├── __root.tsx       # ルートレイアウト
│   ├── _auth.tsx        # 認証済みレイアウト
│   └── _public.tsx      # 公開レイアウト
├── features/            # 機能単位（Feature-based）
│   └── books/           # 蔵書管理
│       ├── components/  # 機能固有コンポーネント
│       ├── hooks/       # 機能固有フック
│       └── types/       # 機能固有型定義
├── components/          # 共通コンポーネント
│   ├── apps/            # 機能横断コンポーネント
│   ├── bases/           # 基本UI（Button, TextInput 等）
│   └── modules/         # 再利用モジュール（Pagination, Modal 等）
├── apis/                # APIクライアント（自動生成・編集禁止）
├── hooks/               # 共通カスタムフック
├── utils/               # 共通ユーティリティ
└── values/              # 定数・静的データ
```

---

## 配置ルール

### features/
- **YOU MUST**: 新機能は `features/<機能名>/` 配下に作成
- 各 feature は `components/`, `hooks/`, `types/` を持つ
- feature 間の直接 import は禁止（共通化が必要なら `components/` や `hooks/` に移動）

### components/
- `apps/` - 複数 feature で使われるが汎用的でないコンポーネント
- `bases/` - プロジェクト全体で使う基本 UI コンポーネント（Button, TextInput, Select 等）
- `modules/` - 複数画面で再利用するモジュール（Pagination, Modal, DataTable 等）

### apis/
- **NEVER**: `apis/` 配下のファイルを手動編集しない（`pnpm api:build` で自動生成）

### routes/
- TanStack Router のファイルベースルーティング
- `_auth` レイアウト配下 = 認証必須ページ
- `_public` レイアウト配下 = 認証不要ページ

---

## import ルール

- **YOU MUST**: パスエイリアス `@/` を使用（相対パスの `../../` は禁止）
- 例: `import { Button } from '@/components/bases/Button'`
