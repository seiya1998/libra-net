---
paths:
  - "apps/admin/**/*.tsx"
---

# フォーム処理ルール

## 基本パターン: React Hook Form + Zod

**YOU MUST**: すべてのフォームは React Hook Form + Zod バリデーションで実装する。

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  isbn: z.string().regex(/^\d{13}$/, 'ISBN は13桁の数字です'),
  authorIds: z.array(z.string()).min(1, '著者を1人以上選択してください'),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
});

type BookFormValues = z.infer<typeof bookSchema>;

export const BookForm = memo(({ onSubmit }: BookFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput label='タイトル' {...register('title')} />
      {errors.title !== undefined && <ErrorMessage>{errors.title.message}</ErrorMessage>}
    </form>
  );
});
```

---

## useForm vs useFormContext

### useForm: フォームのルートコンポーネントで使用

```tsx
const methods = useForm<BookFormValues>({
  resolver: zodResolver(bookSchema),
  defaultValues: { title: '', isbn: '' },
});
```

### useFormContext: ネストされた子コンポーネントで使用

```tsx
// 親: FormProvider でラップ
<FormProvider {...methods}>
  <BookBasicInfo />
  <BookCategorySelect />
</FormProvider>

// 子: useFormContext でアクセス
const BookBasicInfo = memo(() => {
  const { register } = useFormContext<BookFormValues>();
  return <TextInput label='タイトル' {...register('title')} />;
});
```

---

## バリデーションスキーマ定義

- **YOU MUST**: スキーマは `features/<機能>/types/` または同一ファイル内で定義
- **YOU MUST**: エラーメッセージは日本語
- 型は `z.infer<typeof schema>` で導出（手動の interface 定義は禁止）

```tsx
// features/books/types/bookSchema.ts
export const bookSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  // ...
});

export type BookFormValues = z.infer<typeof bookSchema>;
```

---

## 禁止事項

- **NEVER**: Zod なしのフォームバリデーション
- **NEVER**: FormProvider なしでの useFormContext 使用
- **NEVER**: register を渡さないフォーム入力コンポーネント
