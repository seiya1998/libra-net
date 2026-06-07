---
paths:
  - 'apps/opac/**'
---

# OPAC プロジェクト構造ルール（Next.js App Router）

## ディレクトリ構成

```
apps/opac/src/
├── app/
│   └── [locale]/          # ロケール別ルーティング（next-intl）
│       ├── layout.tsx
│       ├── page.tsx       # 検索トップ（RSC）
│       └── books/[id]/page.tsx  # 蔵書詳細（ISR）
├── features/              # 機能単位（admin と同様の feature-based）
├── components/            # 共通コンポーネント
├── i18n/                  # next-intl 設定・メッセージ
└── lib/                   # API クライアント等
```

## 配置ルール

- **YOU MUST**: App Router を使う。ルートは `app/[locale]/` 配下。
- **YOU MUST**: feature-based 構成（admin に準拠）。**NEVER** feature 間の直接 import。
- **YOU MUST**: パスエイリアス `@/` を使う（相対 `../../` 禁止）。
- コンポーネントは関数コンポーネント＋named export、Tailwind。React 19 / TS の共通規約は `.claude/rules/react-quality.md`・`.claude/rules/typescript-quality.md`（`paths` で opac にも自動適用）に従う。

## サーバー / クライアント境界

- **YOU MUST**: 既定は Server Component。状態・イベント・ブラウザ API が必要な部分だけ `'use client'` を付ける。
- **YOU MUST**: `'use client'` はツリーの**葉**に寄せる（上位に付けて配下を全部クライアント化しない）。
- 境界の詳細・セキュリティ含意は `rendering-data.md` / `security.md` を参照。

## マルチテナント / テナント解決

- **YOU MUST**: テナントは**サブドメイン**（`{univ}.libra.net`）で識別。Next.js middleware で解決し、テナント文脈を下流（RSC）へ渡す。
- **YOU MUST**: テナント設定（テーマ等）はテナント解決後に**サーバー側で取得**し、`[locale]` レイアウトで CSS 変数として適用（`theming.md`）。
- **YOU MUST**: データ取得は **opac API（テナントscope）経由**。クライアントから `tenant_id` を送らない（サーバーがサブドメイン/セッションから決定）。
