# AI Agent Recipe: Building a New UI Kit Component

Follow this checklist whenever designing or updating a component in `ui-kit/`:

---

## Step 1: Create `types.ts`
Define explicit props, optional callbacks, and styling overrides:

```typescript
// types.ts
import { ViewStyle } from 'react-native';

export type MyComponentVariant = 'primary' | 'secondary' | 'accent';

export type MyComponentProps = {
  title: string;
  variant?: MyComponentVariant;
  onAction?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};
```

---

## Step 2: Create `styles.ts`
Consume design tokens from `@/constants/theme/tokens`:

```typescript
// styles.ts
import { StyleSheet } from 'react-native';
import {
  palette,
  radius,
  chunky,
  shadows,
  spacing,
  typography,
} from '@/constants/theme/tokens';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderBottomWidth: chunky.edge.md,
    ...shadows.cardSoft,
  },
  title: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: typography.fontSize.sm,
  },
});
```

---

## Step 3: Create `helper.ts`
Write pure functions for domain logic:

```typescript
// helper.ts
import { palette } from '@/constants/theme/tokens';
import { MyComponentVariant } from './types';

export function getVariantColor(variant: MyComponentVariant = 'primary'): string {
  switch (variant) {
    case 'secondary':
      return palette.orange[500];
    case 'accent':
      return palette.teal[500];
    case 'primary':
    default:
      return palette.purple[500];
  }
}
```

---

## Step 4: Create `index.tsx`
Assemble the component and re-export types:

```typescript
// index.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MyComponentProps } from './types';
import { styles } from './styles';
import { getVariantColor } from './helper';

export default function MyComponent({
  title,
  variant = 'primary',
  onAction,
  disabled = false,
  style,
}: MyComponentProps) {
  const color = getVariantColor(variant);

  return (
    <Pressable
      style={[styles.container, { backgroundColor: color }, style]}
      onPress={!disabled ? onAction : undefined}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

export * from './types';
```

---

## Step 5: Export from `ui-kit/index.ts`
Add the barrel export in `ui-kit/index.ts`:

```typescript
export { default as MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent';
```

