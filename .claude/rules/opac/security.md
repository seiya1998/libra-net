---
paths:
  - 'apps/opac/**'
---

# セキュリティ運用ルール（Next.js / RSC）

RSC には過去に重大な RCE（例: **CVE-2025-66478**、上流 React **CVE-2025-55182** 起因）や middleware 認可バイパス（**CVE-2025-29927**）があった。これらはアーキテクチャの欠陥ではなく**運用で防ぐ**。詳細・該当バージョンは公式の GitHub Security Advisory / Next.js セキュリティリリースで確認すること。

## MUST

- **YOU MUST**: Next.js を常にパッチ追従する（Renovate / Dependabot 等で最新の修正版を使う）。上記 CVE の修正版以降を維持。
- **YOU MUST**: RSC リクエスト / Server Actions への入力は**外部入力として検証**する（信用しない）。
- **YOU MUST**: 秘密情報（API キー・DB 認証・内部 URL）は **Server 専用に閉じ込め**、Client Component へ props で渡さない（client へ渡る値はネットワークに乗り公開される）。
- **YOU MUST**: 認可は middleware だけに依存しない。データ層 / RSC / Route Handler でも検証する（多層防御。CVE-2025-29927 対策）。

## NEVER

- **NEVER**: 未検証のクライアント入力をサーバーで評価・実行しない。
- **NEVER**: 秘密情報を Client Component やクライアントバンドルに載せない。
