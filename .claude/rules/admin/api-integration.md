---
paths:
  - "apps/admin/**/*.ts"
  - "apps/admin/**/*.tsx"
---

# API 連携ルール

## Aspida クライアント

- **NEVER**: `apis/` 配下のファイルを手動編集しない（`pnpm api:build` で自動生成）
- **YOU MUST**: API 変更後は `pnpm api:build` を実行してクライアントを再生成

```tsx
import { apiClient } from '@/apis';
```

---

## データ取得: useQuery

```tsx
import { useQuery } from '@tanstack/react-query';

// 一覧取得
const { data: books, isLoading, error } = useQuery({
  queryKey: ['books'],
  queryFn: () => apiClient.books.$get(),
});

// 詳細取得
const { data: book } = useQuery({
  queryKey: ['books', id],
  queryFn: () => apiClient.books._id(id).$get(),
  enabled: id !== undefined,
});
```

### queryKey 設計

- **YOU MUST**: queryKey は階層的に設計（invalidation しやすくするため）
- パターン: `[リソース名]` → `[リソース名, id]` → `[リソース名, 'search', params]`

```tsx
['books']                    // 蔵書一覧
['books', id]                // 蔵書詳細
['books', 'search', query]   // 蔵書検索
['loans']                    // 貸出一覧
['loans', id]                // 貸出詳細
```

---

## データ更新: useMutation

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const createBook = useMutation({
  mutationFn: (data: BookInput) => apiClient.books.$post({ body: data }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['books'] });
  },
  onError: (error) => {
    // エラーハンドリング
  },
});
```

---

## 禁止事項

- **NEVER**: fetch や axios を直接使用しない（Aspida クライアントを使用）
- **NEVER**: useEffect 内でデータ取得しない（useQuery を使用）
- **NEVER**: queryKey をハードコードで分散させない（定数化を推奨）
