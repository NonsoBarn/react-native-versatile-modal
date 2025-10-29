import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import ModalWrapper from '../ModalWrapper';

// Suppress act() warnings for animations in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: An update to') || args[0].includes('not wrapped in act'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
});

describe('ModalWrapper', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when visible is true', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose}>
          <Text>Modal Content</Text>
        </ModalWrapper>
      );

      expect(getByText('Modal Content')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = render(
        <ModalWrapper visible={false} onClose={mockOnClose}>
          <Text>Modal Content</Text>
        </ModalWrapper>
      );

      expect(queryByText('Modal Content')).toBeNull();
    });

    it('should render with custom testID', () => {
      const { getByTestId } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} testID="custom-modal">
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByTestId('custom-modal')).toBeTruthy();
    });
  });

  describe('Modal Types', () => {
    it('should render bottom-sheet type', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} type="bottom-sheet">
          <Text>Bottom Sheet</Text>
        </ModalWrapper>
      );

      expect(getByText('Bottom Sheet')).toBeTruthy();
    });

    it('should render center type', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} type="center">
          <Text>Center Modal</Text>
        </ModalWrapper>
      );

      expect(getByText('Center Modal')).toBeTruthy();
    });

    it('should render drawer type', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} type="drawer">
          <Text>Drawer</Text>
        </ModalWrapper>
      );

      expect(getByText('Drawer')).toBeTruthy();
    });

    it('should render full-screen type', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} type="full-screen">
          <Text>Full Screen</Text>
        </ModalWrapper>
      );

      expect(getByText('Full Screen')).toBeTruthy();
    });
  });

  describe('Backdrop Interaction', () => {
    it('should render with enableBackdropDismiss prop', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} enableBackdropDismiss={true}>
          <Text>Content with dismiss enabled</Text>
        </ModalWrapper>
      );

      expect(getByText('Content with dismiss enabled')).toBeTruthy();
    });

    it('should render with enableBackdropDismiss disabled', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} enableBackdropDismiss={false}>
          <Text>Content with dismiss disabled</Text>
        </ModalWrapper>
      );

      expect(getByText('Content with dismiss disabled')).toBeTruthy();
    });

    it('should have onRequestClose handler attached to Modal', () => {
      const { getByTestId } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} testID="modal">
          <Text>Content</Text>
        </ModalWrapper>
      );

      const modal = getByTestId('modal');

      // Verify that onRequestClose is properly set
      expect(modal.props.onRequestClose).toBeDefined();
      expect(typeof modal.props.onRequestClose).toBe('function');
    });
  });

  describe('Callbacks', () => {
    it('should call onOpen when modal becomes visible', async () => {
      const onOpen = jest.fn();
      const { rerender } = render(
        <ModalWrapper visible={false} onClose={mockOnClose} onOpen={onOpen}>
          <Text>Content</Text>
        </ModalWrapper>
      );

      rerender(
        <ModalWrapper visible={true} onClose={mockOnClose} onOpen={onOpen}>
          <Text>Content</Text>
        </ModalWrapper>
      );

      await waitFor(() => {
        expect(onOpen).toHaveBeenCalled();
      });
    });

    it('should call onAnimationEnd after animation completes', async () => {
      const onAnimationEnd = jest.fn();

      render(
        <ModalWrapper
          visible={true}
          onClose={mockOnClose}
          onAnimationEnd={onAnimationEnd}
          animationDuration={100}
        >
          <Text>Content</Text>
        </ModalWrapper>
      );

      await waitFor(
        () => {
          expect(onAnimationEnd).toHaveBeenCalled();
        },
        { timeout: 500 }
      );
    });
  });

  describe('Theme Configuration', () => {
    it('should apply custom theme colors', () => {
      const theme = {
        backgroundColor: '#FF0000',
        backdropColor: '#00FF00',
        handleColor: '#0000FF',
      };

      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} theme={theme}>
          <Text>Themed Content</Text>
        </ModalWrapper>
      );

      expect(getByText('Themed Content')).toBeTruthy();
      // Note: Testing actual style application would require more complex setup
    });
  });

  describe('Responsive Configuration', () => {
    it('should use custom normalize functions', () => {
      const normalize = jest.fn((val: number) => val * 2);

      render(
        <ModalWrapper
          visible={true}
          onClose={mockOnClose}
          type="bottom-sheet"
          responsive={{ normalize }}
        >
          <Text>Content</Text>
        </ModalWrapper>
      );

      // Normalize function should be called for handle dimensions
      expect(normalize).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility label', () => {
      const { getByLabelText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} accessibilityLabel="Custom Modal">
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByLabelText('Custom Modal')).toBeTruthy();
    });

    it('should use default accessibility label based on type', () => {
      const { getByLabelText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} type="drawer">
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByLabelText('drawer modal')).toBeTruthy();
    });
  });

  describe('Custom Dimensions', () => {
    it('should accept custom bottom sheet height as percentage', () => {
      const { getByText } = render(
        <ModalWrapper
          visible={true}
          onClose={mockOnClose}
          type="bottom-sheet"
          bottomSheetHeight="70%"
        >
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByText('Content')).toBeTruthy();
    });

    it('should accept custom bottom sheet height as number', () => {
      const { getByText } = render(
        <ModalWrapper
          visible={true}
          onClose={mockOnClose}
          type="bottom-sheet"
          bottomSheetHeight={400}
        >
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByText('Content')).toBeTruthy();
    });

    it('should accept custom drawer width', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} type="drawer" drawerWidth={300}>
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('Swipe Gesture Configuration', () => {
    it('should accept custom swipe threshold', () => {
      const { getByText } = render(
        <ModalWrapper visible={true} onClose={mockOnClose} type="bottom-sheet" swipeThreshold={150}>
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByText('Content')).toBeTruthy();
    });

    it('should accept custom swipe velocity threshold', () => {
      const { getByText } = render(
        <ModalWrapper
          visible={true}
          onClose={mockOnClose}
          type="bottom-sheet"
          swipeVelocityThreshold={0.8}
        >
          <Text>Content</Text>
        </ModalWrapper>
      );

      expect(getByText('Content')).toBeTruthy();
    });
  });
});
