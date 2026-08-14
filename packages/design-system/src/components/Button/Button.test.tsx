import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';
import { Download, ChevronRight } from 'react-feather';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button label="Click me" />);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      render(<Button label="Custom Label" />);
      expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Button label="Test" className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      render(<Button label="Small" size="S" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--s');
    });

    it('renders medium size correctly', () => {
      render(<Button label="Medium" size="M" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--m');
    });

    it('renders large size correctly', () => {
      render(<Button label="Large" size="L" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--l');
    });
  });

  describe('Type Variants', () => {
    it('renders primary type correctly', () => {
      render(<Button label="Primary" type="Primary" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--primary');
    });

    it('renders secondary type correctly', () => {
      render(<Button label="Secondary" type="Secondary" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--secondary');
    });

    it('renders outline type correctly', () => {
      render(<Button label="Outline" type="Outline" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--outline');
    });

    it('renders negative primary type correctly', () => {
      render(<Button label="Delete" type="Negative Primary" />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--negative-primary');
    });
  });

  describe('Icons', () => {
    it('renders with leading icon', () => {
      render(
        <Button
          label="Download"
          showLeadingIcon={true}
          leadingIcon={<Download data-testid="leading-icon" />}
        />
      );
      expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
    });

    it('renders with trailing icon', () => {
      render(
        <Button
          label="Continue"
          showTrailingIcon={true}
          trailingIcon={<ChevronRight data-testid="trailing-icon" />}
        />
      );
      expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
    });

    it('renders with both icons', () => {
      render(
        <Button
          label="Action"
          showLeadingIcon={true}
          showTrailingIcon={true}
          leadingIcon={<Download data-testid="leading-icon" />}
          trailingIcon={<ChevronRight data-testid="trailing-icon" />}
        />
      );
      expect(screen.getByTestId('leading-icon')).toBeInTheDocument();
      expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
    });

    it('does not render icons when flags are false', () => {
      render(
        <Button
          label="No Icons"
          showLeadingIcon={false}
          showTrailingIcon={false}
        />
      );
      expect(screen.queryByTestId('leading-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trailing-icon')).not.toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('renders loading state correctly', () => {
      render(<Button label="Loading" loading={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button--loading');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('renders disabled state correctly', () => {
      render(<Button label="Disabled" disabled={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--disabled');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('hides icons when loading', () => {
      render(
        <Button
          label="Loading"
          loading={true}
          showLeadingIcon={true}
          leadingIcon={<Download data-testid="leading-icon" />}
        />
      );
      expect(screen.queryByTestId('leading-icon')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button label="Click me" onClick={handleClick} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button label="Disabled" onClick={handleClick} disabled={true} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button label="Loading" onClick={handleClick} loading={true} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('HTML Attributes', () => {
    it('renders with default button type', () => {
      render(<Button label="Button" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders with submit type', () => {
      render(<Button label="Submit" htmlType="submit" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders with reset type', () => {
      render(<Button label="Reset" htmlType="reset" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label', () => {
      render(<Button label="Accessible Button" />);
      const button = screen.getByRole('button', { name: /accessible button/i });
      expect(button).toHaveAttribute('aria-label', 'Accessible Button');
    });

    it('uses custom aria-label when provided', () => {
      render(<Button label="Button" ariaLabel="Custom Aria Label" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom Aria Label');
    });

    it('sets aria-busy when loading', () => {
      render(<Button label="Loading" loading={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('sets aria-disabled when disabled', () => {
      render(<Button label="Disabled" disabled={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('hides icons from screen readers', () => {
      const { container } = render(
        <Button
          label="Icon Button"
          showLeadingIcon={true}
          leadingIcon={<Download />}
        />
      );
      const iconSpan = container.querySelector('.button__icon');
      expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
