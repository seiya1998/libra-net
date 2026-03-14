---
paths:
  - "apps/admin/**/*.stories.tsx"
---

# Storybook 実装ルール

## 基本構造

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/Forms/TextInput',
  component: TextInput,
  parameters: { layout: 'padded' },
  argTypes: {
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  }
};

export default meta;
type Story = StoryObj<typeof meta>;
```

---

## React Hook Form 統合

```tsx
export const Default: Story = {
  render: (args) => {
    const { register } = useForm();
    return <TextInput {...args} register={register('test')} />;
  },
  args: {
    hasError: false,
  }
};
```

---

## FormProvider 使用コンポーネント

```tsx
import { FormProvider, useForm } from 'react-hook-form';

const meta: Meta<typeof SomeForm> = {
  title: 'Components/Forms/SomeForm',
  component: SomeForm,
  decorators: [
    (Story) => {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    }
  ],
};
```

---

## 必須ストーリー

### Default

```tsx
export const Default: Story = {
  render: () => {
    const { register } = useForm();
    return <TextInput register={register('default')} />;
  }
};
```

### AllStates

```tsx
export const AllStates: Story = {
  render: () => {
    const { register } = useForm();
    return (
      <div className='space-y-4'>
        <TextInput register={register('normal')} />
        <TextInput register={register('error')} hasError={true} />
        <TextInput register={register('disabled')} disabled={true} />
      </div>
    );
  }
};
```

---

## 禁止事項（NEVER）

- truthiness チェック（`if (value)` 等）
- FormProvider なしの useFormContext 使用コンポーネント
- register を渡さないフォームコンポーネント

---

## 必須要件（YOU MUST）

- `!= null` での明示的 null チェック
- useForm での register 関数生成
- FormProvider デコレータでの useFormContext 対応

---

## チェックリスト

- [ ] Meta 設定（title, component, parameters）
- [ ] ArgTypes 設定
- [ ] `StoryObj<typeof meta>` 型使用
- [ ] useForm で register 生成
- [ ] Default ストーリー
- [ ] AllStates ストーリー
