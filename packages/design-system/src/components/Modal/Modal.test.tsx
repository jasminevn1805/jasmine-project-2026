import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal } from './Modal';

describe('Modal Component', () => {
  describe('Rendering', () => {
    it('renders nothing when open is false', () => {
      render(<Modal open={false} onClose={() => {}} title="Hidden" />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders when open', () => {
      render(<Modal open onClose={() => {}} title="Visible" />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Visible')).toBeInTheDocument();
    });

    it('renders children as body content', () => {
      render(
        <Modal open onClose={() => {}} title="T">
          <p>Hello body</p>
        </Modal>,
      );
      expect(screen.getByText('Hello body')).toBeInTheDocument();
    });

    it('renders the close button by default', () => {
      render(<Modal open onClose={() => {}} title="T" />);
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('hides the close button when hideCloseButton is true', () => {
      render(<Modal open onClose={() => {}} title="T" hideCloseButton />);
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });

  describe('Close behavior', () => {
    it('calls onClose when the close button is clicked', () => {
      const onClose = jest.fn();
      render(<Modal open onClose={onClose} title="T" />);
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose on Escape key', () => {
      const onClose = jest.fn();
      render(<Modal open onClose={onClose} title="T" />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the backdrop is clicked', () => {
      const onClose = jest.fn();
      render(<Modal open onClose={onClose} title="T" />);
      fireEvent.click(screen.getByRole('dialog'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when the panel is clicked', () => {
      const onClose = jest.fn();
      render(
        <Modal open onClose={onClose} title="T">
          <p>Body</p>
        </Modal>,
      );
      fireEvent.click(screen.getByText('Body'));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('renders primary & secondary actions in default variant', () => {
      const onPrimary = jest.fn();
      const onSecondary = jest.fn();
      render(
        <Modal
          open
          onClose={() => {}}
          title="T"
          primaryAction={{ label: 'Confirm', onClick: onPrimary }}
          secondaryAction={{ label: 'Cancel', onClick: onSecondary }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onPrimary).toHaveBeenCalledTimes(1);
      expect(onSecondary).toHaveBeenCalledTimes(1);
    });

    it('renders text action when provided', () => {
      const onText = jest.fn();
      render(
        <Modal
          open
          onClose={() => {}}
          title="T"
          textAction={{ label: 'Learn more', onClick: onText }}
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Learn more' }));
      expect(onText).toHaveBeenCalledTimes(1);
    });

    it('respects disabled on actions', () => {
      const onPrimary = jest.fn();
      render(
        <Modal
          open
          onClose={() => {}}
          title="T"
          primaryAction={{ label: 'Save', onClick: onPrimary, disabled: true }}
        />,
      );
      const btn = screen.getByRole('button', { name: 'Save' });
      expect(btn).toBeDisabled();
      fireEvent.click(btn);
      expect(onPrimary).not.toHaveBeenCalled();
    });

    it('renders footer slot only in form variant', () => {
      const { rerender } = render(
        <Modal
          open
          onClose={() => {}}
          title="T"
          variant="form"
          footer={<button>FOOTER</button>}
        />,
      );
      expect(screen.getByRole('button', { name: 'FOOTER' })).toBeInTheDocument();

      rerender(
        <Modal
          open
          onClose={() => {}}
          title="T"
          variant="default"
          footer={<button>FOOTER</button>}
        />,
      );
      expect(screen.queryByRole('button', { name: 'FOOTER' })).not.toBeInTheDocument();
    });

    it('renders subtitle only in form variant', () => {
      const { rerender } = render(
        <Modal open onClose={() => {}} title="T" variant="form" subtitle="Sub!" />,
      );
      expect(screen.getByText('Sub!')).toBeInTheDocument();

      rerender(
        <Modal open onClose={() => {}} title="T" variant="default" subtitle="Sub!" />,
      );
      expect(screen.queryByText('Sub!')).not.toBeInTheDocument();
    });
  });

  describe('Compound API', () => {
    it('Modal.Actions invokes callbacks', () => {
      const onPrimary = jest.fn();
      const onSecondary = jest.fn();
      render(
        <Modal
          open
          onClose={() => {}}
          title="T"
          variant="form"
          footer={
            <Modal.Actions
              primary="OK"
              secondary="NO"
              onPrimary={onPrimary}
              onSecondary={onSecondary}
            />
          }
        />,
      );
      fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      fireEvent.click(screen.getByRole('button', { name: 'NO' }));
      expect(onPrimary).toHaveBeenCalledTimes(1);
      expect(onSecondary).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has role=dialog and aria-modal=true', () => {
      render(<Modal open onClose={() => {}} title="My Modal" />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'My Modal');
    });
  });
});

describe('Modal — Device variants & Slot', () => {
  it('renders default Slot placeholder when no slot/children provided', () => {
    render(<Modal open onClose={() => {}} title="T" />);
    expect(screen.getByText('Slot')).toBeInTheDocument();
  });

  it('uses `slot` prop content when provided', () => {
    render(<Modal open onClose={() => {}} title="T" slot={<p>Custom slot</p>} />);
    expect(screen.getByText('Custom slot')).toBeInTheDocument();
    expect(screen.queryByText('Slot')).not.toBeInTheDocument();
  });

  it('falls back to children when slot is undefined', () => {
    render(
      <Modal open onClose={() => {}} title="T">
        <p>From children</p>
      </Modal>,
    );
    expect(screen.getByText('From children')).toBeInTheDocument();
  });

  it('exposes data-device on the panel for both Desktop & Mobile', () => {
    const { rerender } = render(<Modal open onClose={() => {}} title="T" device="Desktop" />);
    expect(document.querySelector('[data-device="Desktop"]')).toBeInTheDocument();

    rerender(<Modal open onClose={() => {}} title="T" device="Mobile" />);
    expect(document.querySelector('[data-device="Mobile"]')).toBeInTheDocument();
  });

  it('hides the entire actions row when hideActions=true', () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="T"
        hideActions
        primaryAction={{ label: 'Should not render' }}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Should not render' })).not.toBeInTheDocument();
  });
});
