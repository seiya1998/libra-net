# システムアーキテクチャ

論理構成 / レイヤー / コンポーネント関係。

- **admin**（React 19 SPA）: feature-based 構成。`.claude/rules/admin/project-structure.md` を参照。
- **server**（Fastify + Drizzle）: オニオン + ROP + リポジトリ。`.claude/rules/server/architecture.md` および `docs/decisions.md` の ADR-001 を参照。
- **opac**（Next.js App Router, 予定）: 利用者向け検索。RSC 中心（蔵書詳細=ISR / 検索=SSR）、i18n=next-intl、Tailwind。規約は `.claude/rules/opac/`。

## マルチテナント SaaS 全体像

- **テナント**: 契約大学ごとに**サブドメイン**（`{univ}.libra.net`）。分離は **共有DB（MySQL）＋ 行レベル `tenant_id`**。MySQL は RLS が無いため、リポジトリ層の `tenant_id` 強制＋型＋分離テストで担保（ADR-002）。
- **2 アプリ 1 DB**: admin API（司書・PC）と opac API（利用者・モバイル）が同一 DB を参照。presentation は2面、共有 domain/application/infrastructure（ADR-008）。
- **非同期入口**: HTTP と別に、ワーカー or Lambda/バッチ（**未決**, ADR-006）が同じユースケースを実行。
- **外部連携・検索**: NDL / Google Calendar / AI / 検索（MySQL FULLTEXT）は infrastructure のアダプタ（ADR-003, ADR-005）。
- **テーマ**: 大学ごとカラーは実行時 CSS 変数（ADR-004）。
- **複数キャンパス**: 在庫・可用性は (蔵書, キャンパス) 単位、拠点間配送あり（EP-005）。

規約の詳細は `.claude/rules/server/`・`.claude/rules/opac/`・`.claude/rules/theming.md`。
