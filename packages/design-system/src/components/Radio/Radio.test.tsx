import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Radio } from './Radio';

describe('Radio Component', () => {
  /* ── Rendering ──────────────────────────────────────────────────────────── */
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Radio name="test" onChange={() => {}} />);
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('renders a label when provided', () => {
      render(<Radio name="test" label="Option A" onChange={() => {}} />);
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });

    it('renders no label text when label prop is omitted', () => {
      render(<Radio name="test" onChange={() => {}} />);
      expect(screen.queryByText(/option/i)).not.toBeInTheDocument();
    });

    it('associates label with input via htmlFor / id', () => {
      render(<Radio name="test" label="My option" id="radio-1" onChange={() => {}} />);
      const input = screen.getByRole('radio');
      expect(input).toHaveAttribute('id', 'radio-1');
      const label = screen.getByText('My option').closest('label');
      expect(label).toHaveAttribute('for', 'radio-1');
    });

    it('auto-generates an id when none is provided', () => {
      render(<Radio name="test" label="Auto id" onChange={() => {}} />);
      const input = screen.getByRole('radio');
      expect(input).toHaveAttribute('id');
      expect(input.getAttribute('id')).not.toBe('');
    });
  });

  /* ── Checked / unchecked state ──────────────────────────────────────────── */
  describe('Checked state', () => {
    it('is unchecked by default', () => {
      render(<Radio name="test" onChange={() => {}} />);
      expect(screen.getByRole('radio')).not.toBeChecked();
    });

    it('renders as checked when checked=true', () => {
      render(<Radio name="test" checked onChange={() => {}} />);
      expect(screen.getByRole('radio')).toBeChecked();
    });

    it('renders the dot indicator when checked', () => {
      const { container } = render(
        <Radio name="test" checked onChange={() => {}} />,
      );
      // The dot is a <span> inside the indicator span
      const dots = container.querySelectorAll('span span');
      expect(dots.length).toBeGreaterThan(0);
    });

    it('does not render the dot indicator when unchecked', () => {
      const { container } = render(<Radio name="test" onChange={() => {}} />);
      const indicator = container.querySelector('span');
      // Indicator has no children when unchecked
      expect(indicator?.childElementCount).toBe(0);
    });
  });

  /* ── Disabled state ─────────────────────────────────────────────────────── */
  describe('Disabled state', () => {
    it('sets the native input as disabled', () => {
      render(<Radio name="test" label="Disabled" disabled onChange={() => {}} />);
      expect(screen.getByRole('radio')).toBeDisabled();
    });

    it('does not fire onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<Radio name="test" label="Disabled" disabled onChange={handleChange} />);
      fireEvent.click(screen.getByRole('radio'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  /* ── Error state ────────────────────────────────────────────────────────── */
  describe('Error state', () => {
    it('sets aria-invalid when error=true', () => {
      render(<Radio name="test" error onChange={() => {}} />);
      expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
    });

    it('shows error message string below the input', () => {
      render(
        <Radio name="test" label="Option" error="This field is required" onChange={() => {}} />,
      );
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('has role="alert" on the error message', () => {
      render(
        <Radio name="test" error="Please select an option" onChange={() => {}} />,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('does not render error message when error=true (boolean)', () => {
      const { container } = render(<Radio name="test" error={true} onChange={() => {}} />);
      expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument();
    });
  });

  /* ── Interaction ────────────────────────────────────────────────────────── */
  describe('Interaction', () => {
    it('calls onChange when clicked', () => {
      const handleChange = jest.fn();
      render(<Radio name="test" label="Option A" onChange={handleChange} />);
      fireEvent.click(screen.getByRole('radio'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('passes name and value to the native input', () => {
      render(<Radio name="my-group" value="opt-a" onChange={() => {}} />);
      const input = screen.getByRole('radio');
      expect(input).toHaveAttribute('name', 'my-group');
      expect(input).toHaveAttribute('value', 'opt-a');
    });
  });

  /* ── Ref forwarding ─────────────────────────────────────────────────────── */
  describe('Ref forwarding', () => {
    it('forwards ref to the native input element', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Radio ref={ref} name="test" onChange={() => {}} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe('radio');
    });
  });

  /* ── Radio group behaviour ──────────────────────────────────────────────── */
  describe('Radio group', () => {
    it('only one radio is checked at a time in a group', () => {
      const { getByLabelText } = render(
        <>
          <Radio name="group" value="a" label="A" checked={false} onChange={() => {}} />
          <Radio name="group" value="b" label="B" checked={true} onChange={() => {}} />
          <Radio name="group" value="c" label="C" checked={false} onChange={() => {}} />
        </>,
      );
      expect(getByLabelText('A')).not.toBeChecked();
      expect(getByLabelText('B')).toBeChecked();
      expect(getByLabelText('C')).not.toBeChecked();
    });
  });
});
