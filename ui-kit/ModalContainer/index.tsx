import React, { useCallback, useState } from 'react';
import {
  LayoutChangeEvent,
  Modal,
  ModalProps,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { spacing, surface } from '../theme';

export type ModalContainerProps = {
  /** Controls native presentation. Keep the container mounted and toggle this flag. */
  visible: boolean;
  children: React.ReactNode;
  /** Android hardware back / iOS accessibility escape. */
  onRequestClose?: () => void;
  /** Tap on the dimmed backdrop. Omit to make the backdrop inert. */
  onBackdropPress?: () => void;
  /** Overrides for the full-screen dimmed overlay (background colour, padding, alignment). */
  overlayStyle?: StyleProp<ViewStyle>;
  animationType?: ModalProps['animationType'];
  statusBarTranslucent?: boolean;
  onShow?: ModalProps['onShow'];
  onDismiss?: ModalProps['onDismiss'];
};

/**
 * Shared transparent modal shell.
 *
 * Why the layout gate exists:
 * On the iOS New Architecture, RN's <Modal> root starts with a 0×0 size
 * (`platform/cxx/ModalHostViewUtils.cpp`) and only receives the real screen size
 * after UIKit lays out the presented view controller (`boundsDidChange` → state update).
 * Android computes the size synchronously. Rendering children before the overlay has a
 * real size makes centred cards (and entering animations) start in the top-left/upper
 * area on iOS. Children are therefore rendered only once the overlay reports a non-zero
 * layout — on Android that is the very first layout, so nothing is delayed there.
 *
 * Card sizing stays with the caller, so modals of different sizes keep their design.
 */
export default function ModalContainer({
  visible,
  children,
  onRequestClose,
  onBackdropPress,
  overlayStyle,
  animationType = 'fade',
  statusBarTranslucent,
  onShow,
  onDismiss,
}: ModalContainerProps) {
  const [hasSize, setHasSize] = useState(false);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const measured = width > 0 && height > 0;
    setHasSize((prev) => (prev === measured ? prev : measured));
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType}
      statusBarTranslucent={statusBarTranslucent}
      onRequestClose={onRequestClose}
      onShow={onShow}
      onDismiss={onDismiss}
    >
      <View style={[styles.overlay, overlayStyle]} onLayout={handleLayout}>
        {onBackdropPress ? (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={onBackdropPress}
            accessibilityRole="button"
          />
        ) : null}
        {hasSize ? children : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
});
