---
paths:
  - "apps/admin/**/*.tsx"
---

# エラーハンドリング・ローディングルール

## React 19 Suspense

**YOU MUST**: データ取得時はローディング境界を設定する。

```tsx
import { Suspense } from 'react';

export const BooksPage = memo(() => {
  return (
    <Suspense fallback={<Loading />}>
      <BookList />
    </Suspense>
  );
});
```

---

## ErrorBoundary

**YOU MUST**: エラー境界でクラッシュを防止する。

```tsx
<ErrorBoundary fallback={<ErrorScreen />}>
  <Suspense fallback={<Loading />}>
    <BookList />
  </Suspense>
</ErrorBoundary>
```

---

## ローディング・エラーガード

### useQuery のガード

```tsx
const { data: books, isLoading, error } = useQuery({
  queryKey: ['books'],
  queryFn: () => apiClient.books.$get(),
});

if (isLoading) return <Loading />;
if (error !== undefined) return <ErrorScreen error={error} />;
```

### useMutation のパターン

```tsx
const createBook = useMutation({
  mutationFn: (data: BookInput) => apiClient.books.$post({ body: data }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['books'] });
    // 成功トースト表示など
  },
  onError: (error) => {
    // エラートースト表示など
  },
});

// ボタンの状態反映
<Button disabled={createBook.isPending}>
  {createBook.isPending ? '登録中...' : '登録'}
</Button>
```

---

## React 19 新機能

### useTransition: 非同期状態遷移

UI をブロックせずに状態更新を遅延実行する。

```tsx
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();

const handleSearch = (query: string) => {
  startTransition(() => {
    setSearchQuery(query);
  });
};

// isPending で UI にフィードバック
{isPending && <Spinner />}
```

### useActionState: フォームアクション状態管理

フォーム送信の状態（pending, error, result）を一元管理する。

```tsx
import { useActionState } from 'react';

const [state, submitAction, isPending] = useActionState(
  async (previousState, formData: FormData) => {
    const result = await apiClient.books.$post({
      body: Object.fromEntries(formData),
    });
    return { success: true, data: result };
  },
  { success: false, data: null }
);

<form action={submitAction}>
  <Button disabled={isPending}>
    {isPending ? '送信中...' : '送信'}
  </Button>
</form>
```

### useOptimistic: 楽観的更新

サーバー応答を待たずに UI を先行更新する。

```tsx
import { useOptimistic } from 'react';

const [optimisticBooks, addOptimisticBook] = useOptimistic(
  books,
  (currentBooks, newBook: Book) => [...currentBooks, newBook]
);

const handleCreate = async (data: BookInput) => {
  addOptimisticBook({ ...data, id: 'temp', status: '貸出可' });
  await createBook.mutateAsync(data);
};
```

---

## 禁止事項

- **NEVER**: ローディング状態なしでデータ取得結果を表示しない
- **NEVER**: エラーを握りつぶさない（必ずユーザーにフィードバック）
- **NEVER**: `error` の truthiness チェック（`error !== undefined` を使用）
