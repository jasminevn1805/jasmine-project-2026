import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Divider } from './Divider';

describe('Divider Component', () => {
  it('renders an hr element', () => {
    const { container } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('applies the subtle class when type="Subtle"', () => {
    const { container } = render(<Divider type="Subtle" />);
    expect(container.querySelector('hr')?.className).toMatch(/subtle/i);
  });

  it('applies an additional className when provided', () => {
    const { container } = render(<Divider className="custom-class" />);
    expect(container.querySelector('hr')).toHaveClass('custom-class');
  });
});
