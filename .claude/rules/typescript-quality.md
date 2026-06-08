---
paths:
  - 'apps/**/*.ts'
  - 'apps/**/*.tsx'
---

# TypeScript 厳密化（admin・server・opac 共通）

全アプリ共通の型安全規約。**このルールはプロジェクトで最も重要な規約の一つで、例外は認められない。** 型チェックの実行タイミングは `typescript.md` を参照。

## 必須・禁止

- **NEVER**: `any` 型を使わない。`unknown` を使う場合は型ガードで絞り込む。
- **YOU MUST**: `!== undefined` / `!= null` で明示チェック（truthiness チェック禁止）。
- **YOU MUST**: `exactOptionalPropertyTypes` に対応する。
- **YOU MUST**: 配列インデックスアクセス・`find()`・`pop()` 等の `undefined` をチェックする。
- **YOU MUST**: nullable な引数はガードを実装し、Optional Chaining（`?.`）を活用する。
- **NEVER**: 型アサーション（`as`）を多用しない（型ガードによる絞り込みを優先）。
- **YOU MUST**: 関数の引数・戻り値の型を明示する。型エラー修正時も既存インターフェースを勝手に変えない。
