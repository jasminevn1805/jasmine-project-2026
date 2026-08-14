import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  /* ── Rendering ──────────────────────────────────────────────────────────── */
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Checkbox name="test" onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders a label when provided', () => {
      render(<Checkbox name="test" label="Accept terms" onChange={() => {}} />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('renders no label text when label prop is omitted', () => {
      render(<Checkbox name="test" onChange={() => {}} />);
      expect(screen.queryByText(/accept/i)).not.toBeInTheDocument();
    });

    it('associates label with input via htmlFor / id', () => {
      render(<Checkbox name="test" label="My option" id="cb-1" onChange={() => {}} />);
      const input = screen.getByRole('checkbox');
      expect(input).toHaveAttribute('id', 'cb-1');
      const label = screen.getByText('My option').closest('label');
      expect(label).toHaveAttribute('for', 'cb-1');
    });

    it('auto-generates an id when none is provided', () => {
      render(<Checkbox name="test" label="Auto id" onChange={() => {}} />);
      const input = screen.getByRole('checkbox');
      expect(input.getAttribute('id')).toBeTruthy();
    });
  });

  /* ── Checked state ──────────────────────────────────────────────────────── */
  describe('Checked state', () => {
    it('is unchecked by default', () => {
      render(<Checkbox name="test" onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('is checked when checked=true', () => {
      render(<Checkbox name="test" checked onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('renders the checkmark SVG when checked and not indeterminate', () => {
      const { container } = render(
        <Checkbox name="test" checked onChange={() => {}} />,
      );
      // The check SVG has a <path> with d="M1 4L..."
      expect(container.querySelector('svg')).toBeInTheDocument();
      const path = container.querySelector('path');
      expect(path?.getAttribute('d')).toMatch(/M1 4/);
    });

    it('does not render any icon when unchecked', () => {
      const { container } = render(<Checkbox name="test" onChange={() => {}} />);
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  /* ── Indeterminate state ────────────────────────────────────────────────── */
  describe('Indeterminate state', () => {
    it('sets indeterminate property on the native input', () => {
      const { getByRole } = render(
        <Checkbox name="test" checked indeterminate onChange={() => {}} />,
      );
      expect((getByRole('checkbox') as HTMLInputElement).indeterminate).toBe(true);
    });

    it('renders the minus/dash SVG when indeterminate', () => {
      const { container } = render(
        <Checkbox name="test" checked indeterminate onChange={() => {}} />,
      );
      const path = container.querySelector('path');
      // Dash path: "M1 1H9"
      expect(path?.getAttribute('d')).toMatch(/M1 1H9/);
    });

    it('renders dash instead of checkmark even when checked=true', () => {
      const { container } = render(
        <Checkbox name="test" checked indeterminate onChange={() => {}} />,
      );
      const path = container.querySelector('path');
      // Should not contain the checkmark path
      expect(path?.getAttribute('d')).not.toMatch(/M1 4/);
    });
  });

  /* ── Disabled state ─────────────────────────────────────────────────────── */
  describe('Disabled state', () => {
    it('sets the native input as disabled', () => {
      render(<Checkbox name="test" label="Disabled" disabled onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('does not fire onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<Checkbox name="test" disabled onChange={handleChange} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  /* ── Error state ────────────────────────────────────────────────────────── */
  describe('Error state', () => {
    it('sets aria-invalid when error=true', () => {
      render(<Checkbox name="test" error onChange={() => {}} />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error message string below the input', () => {
      render(
        <Checkbox name="test" label="Option" error="You must accept the terms." onChange={() => {}} />,
      );
      expect(screen.getByText('You must accept the terms.')).toBeInTheDocument();
    });

    it('has role="alert" on the error message', () => {
      render(<Checkbox name="test" error="Please select at least one." onChange={() => {}} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not render alert element when error is boolean true', () => {
      const { container } = render(<Checkbox name="test" error={true} onChange={() => {}} />);
      expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument();
    });
  });

  /* ── Interaction ────────────────────────────────────────────────────────── */
  describe('Interaction', () => {
    it('calls onChange when clicked', () => {
      const handleChange = jest.fn();
      render(<Checkbox name="test" label="Option A" onChange={handleChange} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('passes name and value to the native input', () => {
      render(<Checkbox name="my-group" value="opt-a" onChange={() => {}} />);
      const input = screen.getByRole('checkbox');
      expect(input).toHaveAttribute('name', 'my-group');
      expect(input).toHaveAttribute('value', 'opt-a');
    });
  });

  /* ── Ref forwarding ─────────────────────────────────────────────────────── */
  describe('Ref forwarding', () => {
    it('forwards ref to the native input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox ref={ref} name="test" onChange={() => {}} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('checkbox');
    });
  });

  /* ── Select-all / group pattern ─────────────────────────────────────────── */
  describe('Select-all group pattern', () => {
    it('renders correctly in a group with mixed selection', () => {
      render(
        <>
          <Checkbox name="g" value="a" label="A" checked={true}  onChange={() => {}} />
          <Checkbox name="g" value="b" label="B" checked={false} onChange={() => {}} />
          <Checkbox name="g" value="c" label="C" checked={false} onChange={() => {}} />
        </>,
      );
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });
  });
});
