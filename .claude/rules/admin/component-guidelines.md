---
paths:
  - "apps/admin/**/*.tsx"
---

# コンポーネントガイドライン

## 基本構造

- **YOU MUST**: 関数コンポーネント + named export
- **YOU MUST**: Props は interface で定義
- **NEVER**: default export を使用しない

```tsx
interface BookCardProps {
  title: string;
  author: string;
  onSelect: (id: string) => void;
}

export const BookCard = memo(({ title, author, onSelect }: BookCardProps) => {
  return (
    <div className='rounded-lg border p-4'>
      <h3 className='text-lg font-bold'>{title}</h3>
      <p className='text-sub'>{author}</p>
    </div>
  );
});
```

---

## React 19 の活用

### ref を直接 props で受け取り（forwardRef 不要）

```tsx
interface TextInputProps {
  ref?: React.Ref<HTMLInputElement>;
  label: string;
}

export const TextInput = ({ ref, label, ...props }: TextInputProps) => {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  );
};
```

### use() hook

```tsx
import { use } from 'react';

// コンテキストの読み取り
const theme = use(ThemeContext);

// プロミスの読み取り（Suspense と組み合わせ）
const data = use(fetchData());
```

---

## メモ化

### React.memo

パフォーマンス上の必要性がある場合に使用する。全コンポーネントへの一律適用は不要。

**使うべき場合:**
- リスト内のアイテムコンポーネント
- レンダリングコストが高いコンポーネント
- 親が頻繁に再レンダリングされるが、自身の props は変わらないコンポーネント

**不要な場合:**
- ほぼ毎回 props が変わるコンポーネント
- 非常に軽量なコンポーネント（比較コスト > レンダリングコスト）

```tsx
import { memo } from 'react';

// リストアイテム → memo が有効
export const BookCard = memo(({ title, author }: BookCardProps) => {
  return (
    <div className='rounded-lg border p-4'>
      <h3>{title}</h3>
      <p>{author}</p>
    </div>
  );
});
```

### useMemo / useCallback

```tsx
// 計算コストの高い値
const filteredBooks = useMemo(
  () => books.filter((book) => book.status === '貸出可'),
  [books]
);

// memo された子コンポーネントに渡すコールバック
const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);
```

---

## ロジック分離

- **YOU MUST**: ビジネスロジックはカスタムフックに抽出
- コンポーネントは表示責務のみ

```tsx
// hooks/useBookSearch.ts
export const useBookSearch = (query: string) => {
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isLoading } = useQuery({
    queryKey: ['books', 'search', debouncedQuery],
    queryFn: () => apiClient.books.$get({ query: { q: debouncedQuery } }),
    enabled: debouncedQuery.length > 0,
  });
  return { books: data ?? [], isLoading };
};

// components
export const BookSearchPage = memo(() => {
  const [query, setQuery] = useState('');
  const { books, isLoading } = useBookSearch(query);
  // 表示のみ
});
```
