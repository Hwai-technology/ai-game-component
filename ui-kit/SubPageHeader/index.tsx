import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { shadows, spacing, text, typography } from '../theme';
import { useLanguage } from '@/hooks/useLanguage';
import IconButton, { IconButtonProps } from '../IconButton';

export type SubPageHeaderAction = Pick<IconButtonProps, 'icon' | 'onPress' | 'badge'>;

export type SubPageHeaderProps = {
  title: string;
  /** Defaults to router.back() */
  onBack?: () => void;
  /** Right-side icon buttons (clock, info...) */
  actions?: SubPageHeaderAction[];
  /** White title + text shadow for use over illustrated backgrounds */
  onIllustration?: boolean;
  style?: ViewStyle;
};

/**
 * Unified inner-page header: round back button, bold rounded title
 * (normal case — never letter-spaced uppercase), optional right actions.
 */
export default function SubPageHeader({
  title,
  onBack,
  actions = [],
  onIllustration = false,
  style,
}: SubPageHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';

  return (
    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row', paddingTop: insets.top + spacing.sm }, style]}>
      <IconButton icon={isRTL ? "arrow-forward" : "arrow-back"} onPress={onBack ?? (() => router.back())} />
      <Text
        numberOfLines={1}
        style={[styles.title, onIllustration && styles.titleOnIllustration]}
      >
        {title}
      </Text>
      <View style={[styles.actions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {actions.length === 0 ? (
          <View style={styles.actionSpacer} />
        ) : (
          actions.map((action, i) => <IconButton key={`${action.icon}-${i}`} {...action} />)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.heading,
    fontFamily: typography.title.fontFamily,
    color: text.primary,
  },
  titleOnIllustration: {
    color: text.onDark,
    ...shadows.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionSpacer: {
    width: 44,
  },
});
