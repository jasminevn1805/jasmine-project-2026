import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Row } from './Row';

describe('Row Component', () => {
  /* ── Rendering ──────────────────────────────────────────────────────────── */
  describe('Rendering', () => {
    it('renders the primary text', () => {
      render(<Row text="Notifications" />);
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });

    it('renders secondary text when provided', () => {
      render(<Row text="Jane Doe" secondaryText="jane@example.com" />);
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('renders no secondary text when omitted', () => {
      render(<Row text="Jane Doe" />);
      expect(screen.queryByText(/@/)).not.toBeInTheDocument();
    });

    it('renders a divider by default', () => {
      const { container } = render(<Row text="Row" />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('omits the divider when divider={false}', () => {
      const { container } = render(<Row text="Row" divider={false} />);
      expect(container.querySelector('hr')).not.toBeInTheDocument();
    });
  });

  /* ── Leading accessories ───────────────────────────────────────────────── */
  describe('Leading accessory', () => {
    it('renders nothing extra when leading is omitted', () => {
      const { container } = render(<Row text="Row" />);
      expect(container.querySelectorAll('.content > *')).toHaveLength(1);
    });

    it('renders custom icon content for kind="icon"', () => {
      render(<Row text="Row" leading={{ kind: 'icon', icon: <svg data-testid="my-icon" /> }} />);
      expect(screen.getByTestId('my-icon')).toBeInTheDocument();
    });

    it('renders initials for kind="avatar"', () => {
      render(<Row text="Row" leading={{ kind: 'avatar', initials: 'JD' }} />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders an image for kind="image"', () => {
      render(<Row text="Row" leading={{ kind: 'image', src: '/photo.png', alt: 'Profile photo' }} />);
      expect(screen.getByAltText('Profile photo')).toHaveAttribute('src', '/photo.png');
    });
  });

  /* ── Trailing accessories ──────────────────────────────────────────────── */
  describe('Trailing accessory', () => {
    it('renders a Button for kind="button" and forwards onClick', () => {
      const onClick = jest.fn();
      render(<Row text="Row" trailing={{ kind: 'button', label: 'Action', onClick }} />);
      const button = screen.getByRole('button', { name: 'Action' });
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders custom icon content for kind="icon"', () => {
      render(<Row text="Row" trailing={{ kind: 'icon', icon: <svg data-testid="trailing-icon" /> }} />);
      expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
    });
  });

  /* ── Misc ───────────────────────────────────────────────────────────────── */
  it('applies an additional className on the outer wrapper', () => {
    const { container } = render(<Row text="Row" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
