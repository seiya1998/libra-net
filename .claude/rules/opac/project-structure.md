---
paths:
  - 'apps/opac/**'
---

# OPAC プロジェクト構造ルール（Next.js App Router）

**admin と同じ feature-based 構成**。それに Next.js 固有（App Router `app/[locale]`・`i18n`・RSC 境界）を加える。

## ディレクトリ構成

```
apps/opac/src/
├── app/                    # ★Next.js App Router（[locale] ルーティング）— opac 固有
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx                  # 検索トップ（RSC）
│       ├── loading.tsx / error.tsx / not-found.tsx
│       └── books/[id]/page.tsx       # 蔵書詳細（ISR）
├── features/               # 機能単位（admin と同構成）
│   └── search/
│       ├── components/     # 機能固有コンポーネント
│       ├── hooks/          # 機能固有フック
│       ├── lib/            # その feature でしか使わない関数
│       └── types/          # 機能固有型定義
├── components/             # 共通コンポーネント
│   ├── bases/              # 基本UI（Button, TextInput 等）
│   └── modules/            # 再利用モジュール（Pagination 等）
├── hooks/                  # 共通フック
├── utils/                  # 共通ユーティリティ（複数 feature 横断のみ）
├── values/                 # 定数・静的データ
├── i18n/                   # ★next-intl 設定・メッセージ — opac 固有
└── lib/                    # API クライアント等
```

## 配置ルール

- **YOU MUST**: feature-based。新機能は `features/<機能名>/` 配下（`components` / `hooks` / `types` / `lib`）。
- **YOU MUST**: **その機能でしか使わない関数は `features/<機能名>/lib/`（または使う場所に co-locate）**。`src/utils/` は**複数 feature 横断の共通だけ**。
- **NEVER**: feature 間の直接 import（共通化は `components/` / `hooks/` / `utils/` に昇格）。
- **YOU MUST**: パスエイリアス `@/`（相対 `../../` 禁止）。
- コンポーネントは関数コンポーネント＋named export、Tailwind。React 19 / TS の共通規約は `react-quality.md` / `typescript-quality.md`。
- **App Router（opac 固有）**: ルートは `app/[locale]/`。`loading.tsx` / `error.tsx` / `not-found.tsx` を用意（`rendering-data.md`）。

## サーバー / クライアント境界

- **YOU MUST**: 既定は Server Component。状態・イベント・ブラウザ API が必要な部分だけ `'use client'` を付ける。
- **YOU MUST**: `'use client'` はツリーの**葉**に寄せる（上位に付けて配下を全部クライアント化しない）。
- 境界の詳細・セキュリティ含意は `rendering-data.md` / `security.md` を参照。

## マルチテナント / テナント解決

- **YOU MUST**: テナントは**サブドメイン**（`{univ}.libra.net`）で識別。Next.js middleware で解決し、テナント文脈を下流（RSC）へ渡す。
- **YOU MUST**: テナント設定（テーマ等）はテナント解決後に**サーバー側で取得**し、`[locale]` レイアウトで CSS 変数として適用（`theming.md`）。
- **YOU MUST**: データ取得は **opac API（テナントscope）経由**。クライアントから `tenant_id` を送らない（サーバーがサブドメイン/セッションから決定）。
