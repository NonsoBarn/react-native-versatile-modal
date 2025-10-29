import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  ViewStyle,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export type ModalType = 'bottom-sheet' | 'full-screen' | 'drawer' | 'center';

export interface ResponsiveConfig {
  normalize?: (value: number) => number;
  normalizeWidth?: (value: number) => number;
  normalizeHeight?: (value: number) => number;
}

export interface ThemeConfig {
  backgroundColor?: string;
  backdropColor?: string;
  handleColor?: string;
}

export interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  type?: ModalType;
  children: React.ReactNode;

  // Animation props
  animationDuration?: number;
  backdropOpacity?: number;

  // Type-specific props
  drawerPosition?: 'left' | 'right';
  drawerWidth?: number | string;
  bottomSheetHeight?: number | string;
  centerModalWidth?: number | string;
  centerModalMaxHeight?: number | string;

  // Interaction props
  enableSwipeDown?: boolean;
  enableBackdropDismiss?: boolean;
  swipeThreshold?: number;
  swipeVelocityThreshold?: number;

  // Styling props
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  theme?: ThemeConfig;
  responsive?: ResponsiveConfig;

  // Callbacks
  onOpen?: () => void;
  onAnimationEnd?: () => void;

  // Accessibility
  accessibilityLabel?: string;
  testID?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  onClose,
  type = 'bottom-sheet',
  children,
  animationDuration = 300,
  backdropOpacity = 0.5,
  drawerPosition = 'left',
  drawerWidth = '80%',
  bottomSheetHeight = '50%',
  centerModalWidth = '90%',
  centerModalMaxHeight = '80%',
  enableSwipeDown = true,
  enableBackdropDismiss = true,
  swipeThreshold = 100,
  swipeVelocityThreshold = 0.5,
  containerStyle = {},
  contentStyle = {},
  theme = {},
  responsive = {},
  onOpen,
  onAnimationEnd,
  accessibilityLabel,
  testID,
}) => {
  // Theme defaults
  const backgroundColor = theme.backgroundColor || '#FFFFFF';
  const backdropColor = theme.backdropColor || '#000000';
  const handleColor = theme.handleColor || '#CCCCCC';

  // Responsive helpers with defaults
  const normalizeHeight =
    responsive.normalizeHeight || responsive.normalize || ((val: number) => val);
  const normalizeWidth =
    responsive.normalizeWidth || responsive.normalize || ((val: number) => val);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const isAnimatingRef = useRef(false);

  // Calculate initial position based on modal type
  const getInitialPosition = () => {
    switch (type) {
      case 'bottom-sheet':
        return SCREEN_HEIGHT;
      case 'drawer': {
        const width =
          typeof drawerWidth === 'string'
            ? (parseFloat(drawerWidth) / 100) * SCREEN_WIDTH
            : drawerWidth;
        return drawerPosition === 'left' ? -width : width;
      }
      case 'full-screen':
        return SCREEN_HEIGHT;
      case 'center':
        return 0;
      default:
        return SCREEN_HEIGHT;
    }
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () =>
        enableSwipeDown && type === 'bottom-sheet' && !isAnimatingRef.current,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        enableSwipeDown &&
        type === 'bottom-sheet' &&
        gestureState.dy > 5 &&
        !isAnimatingRef.current,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > swipeThreshold || gestureState.vy > swipeVelocityThreshold) {
          handleClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      isAnimatingRef.current = true;
      slideAnim.setValue(getInitialPosition());
      scaleAnim.setValue(0);
      panY.setValue(0);

      onOpen?.();

      const animations: Animated.CompositeAnimation[] = [
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ];

      if (type === 'center') {
        animations.push(
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          })
        );
      } else {
        animations.push(
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start(() => {
        isAnimatingRef.current = false;
        onAnimationEnd?.();
      });
    }
  }, [
    visible,
    type,
    animationDuration,
    onOpen,
    onAnimationEnd,
    slideAnim,
    scaleAnim,
    backdropAnim,
  ]);

  const handleClose = () => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ];

    if (type === 'center') {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        })
      );
    } else {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: getInitialPosition(),
          duration: animationDuration,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start(() => {
      panY.setValue(0);
      scaleAnim.setValue(0);
      isAnimatingRef.current = false;
      onClose();
    });
  };

  const getModalStyle = (): Animated.WithAnimatedObject<ViewStyle> => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      backgroundColor,
    };

    switch (type) {
      case 'bottom-sheet': {
        const heightValue =
          typeof bottomSheetHeight === 'string'
            ? (parseFloat(bottomSheetHeight) / 100) * SCREEN_HEIGHT
            : bottomSheetHeight;

        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: heightValue,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: [
            {
              translateY: Animated.add(slideAnim, panY),
            },
          ],
        } as Animated.WithAnimatedObject<ViewStyle>;
      }

      case 'drawer': {
        const widthValue =
          typeof drawerWidth === 'string'
            ? (parseFloat(drawerWidth) / 100) * SCREEN_WIDTH
            : drawerWidth;

        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          width: widthValue,
          [drawerPosition]: 0,
          transform: [
            {
              translateX: drawerPosition === 'left' ? slideAnim : Animated.multiply(slideAnim, -1),
            },
          ],
        } as Animated.WithAnimatedObject<ViewStyle>;
      }

      case 'full-screen':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY: slideAnim }],
        } as Animated.WithAnimatedObject<ViewStyle>;

      case 'center': {
        const widthValue =
          typeof centerModalWidth === 'string'
            ? (parseFloat(centerModalWidth) / 100) * SCREEN_WIDTH
            : centerModalWidth;

        const maxHeightValue =
          typeof centerModalMaxHeight === 'string'
            ? (parseFloat(centerModalMaxHeight) / 100) * SCREEN_HEIGHT
            : centerModalMaxHeight;

        return {
          backgroundColor,
          width: widthValue,
          maxHeight: maxHeightValue,
          borderRadius: 24,
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        } as Animated.WithAnimatedObject<ViewStyle>;
      }

      default:
        return baseStyle as Animated.WithAnimatedObject<ViewStyle>;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
      accessible={true}
      accessibilityLabel={accessibilityLabel || `${type} modal`}
      testID={testID}
    >
      <View style={type === 'center' ? styles.modalOverlayCenter : styles.modalOverlay}>
        {/* Backdrop */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={enableBackdropDismiss ? handleClose : undefined}
          accessible={false}
          testID={testID ? `${testID}-backdrop` : 'modal-backdrop'}
        >
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, backdropOpacity],
                }),
                backgroundColor: backdropColor,
              },
            ]}
          />
        </TouchableOpacity>

        {/* Modal Content */}
        <Animated.View
          style={[getModalStyle(), containerStyle]}
          {...(type === 'bottom-sheet' && enableSwipeDown ? panResponder.panHandlers : {})}
        >
          {type === 'bottom-sheet' && enableSwipeDown && (
            <View style={styles.handleContainer}>
              <View
                style={[
                  styles.handle,
                  {
                    backgroundColor: handleColor,
                    width: normalizeWidth(40),
                    height: normalizeHeight(4),
                    borderRadius: normalizeHeight(2),
                  },
                ]}
              />
            </View>
          )}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalOverlayCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    // Dynamic styles applied inline
  },
  content: {
    flex: 1,
  },
});

export default ModalWrapper;
