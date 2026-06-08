# 用語集

ドメイン用語を「1 日本語 = 1 英語」で統一する。非自明な用語のみ追加（一般語は載せない）。

| 日本語 | English | 説明 |
|---|---|---|
| 蔵書 | Book | 図書館が所蔵する書籍。ISBN・配架場所・在庫数（copies）を持つ |
| 利用者 | User | 図書館の利用者（学生 / 教員） |
| 貸出 | Loan | 利用者が蔵書を借りること。返却期限（dueDate）を持つ |
| 返却 | Return | 貸出された蔵書が返却されること |
| お知らせ | Notice | 利用者向けの告知（お知らせ / 重要 / 新着） |
| 延滞 | Overdue | 返却期限を過ぎた貸出状態 |
| 除籍 | Withdrawn | 蔵書を蔵書管理対象から外す状態 |
| テナント | Tenant | 契約大学。1テナント=1大学。データは `tenant_id` で分離 |
| サブドメイン | Subdomain | テナント識別に使う（例 `{univ}.libra.net`） |
| キャンパス（拠点） | Campus | 大学内の拠点。在庫・可用性は (蔵書, キャンパス) 単位 |
| 拠点間配送 | Inter-campus Delivery | 別キャンパスへ本を配送し受け取る仕組み |
| 予約待ち | Reservation Queue | 予約の待ち行列・待ち人数 |
| OPAC | OPAC | Online Public Access Catalog。利用者向け蔵書検索 |
| ISBN | ISBN | 書籍の国際標準番号。書誌自動取得のキー |
| 国立国会図書館API | NDL API | ISBN から書誌を取得する外部 API |
| 図書カード | Library Card | 一般利用者に配布するバーコード付きカード（一意番号で管理） |
| 全文検索インデックス | FULLTEXT Index | MySQL の全文検索。蔵書検索に使用 |
