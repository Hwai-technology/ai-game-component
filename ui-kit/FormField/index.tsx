import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import {
  fontFamily,
  palette,
  radius,
  spacing,
  surface,
  text,
  typography,
} from '../theme';

import { useLanguage } from '@/hooks';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type FormFieldProps = Omit<TextInputProps, 'style'> & {
  icon?: IoniconName;
  label?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
};

/**
 * Rounded text input with a leading icon in a tinted circle.
 * States: default / focused (thicker purple border) / error / disabled.
 */
export default function FormField({
  icon = 'person',
  label,
  error,
  disabled = false,
  containerStyle,
  onFocus,
  onBlur,
  ...inputProps
}: FormFieldProps) {
  const { isRTL } = useLanguage();
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={containerStyle}>
      {label != null && <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>}
      <View
        style={[
          styles.field,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
          focused && styles.fieldFocused,
          hasError && styles.fieldError,
          disabled && styles.fieldDisabled,
        ]}
      >
        <View style={[styles.iconCircle, hasError && styles.iconCircleError]}>
          <Ionicons
            name={icon}
            size={16}
            color={hasError ? palette.red[500] : palette.purple[300]}
          />
        </View>
        <TextInput
          editable={!disabled}
          placeholderTextColor={text.muted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            {
              fontFamily: isRTL ? fontFamily.arabicMedium : fontFamily.medium,
              textAlign: isRTL ? 'right' : 'left',
            },
            disabled && styles.inputDisabled,
          ]}
          {...inputProps}
        />
      </View>
      {hasError && <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: text.primary,
    marginBottom: spacing.xs + 2,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surface.white,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: palette.purple[100],
    paddingHorizontal: spacing.md,
    minHeight: 54,
    gap: spacing.sm,
  },
  fieldFocused: {
    borderColor: palette.purple[500],
  },
  fieldError: {
    borderColor: palette.red[500],
  },
  fieldDisabled: {
    backgroundColor: surface.lavender,
    borderColor: 'transparent',
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleError: {
    backgroundColor: palette.red[100],
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: text.primary,
    paddingVertical: 0,
    marginVertical: 0,
    alignSelf: 'stretch',
  },
  inputDisabled: {
    color: text.muted,
  },
  errorText: {
    ...typography.caption,
    color: palette.red[500],
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});
