import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Image } from './Image';

describe('Image Component', () => {
  it('renders an img element when src is provided', () => {
    render(<Image src="/photo.png" alt="A photo" />);
    const img = screen.getByAltText('A photo');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/photo.png');
  });

  it('renders the placeholder state when src is omitted', () => {
    render(<Image alt="Coming soon" />);
    expect(screen.queryByRole('img', { name: 'Coming soon' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Coming soon' })?.tagName).not.toBe('IMG');
  });

  it('applies the matching aspect-ratio class per variant', () => {
    const { container, rerender } = render(<Image src="/a.png" alt="a" aspectRatio="1:1" />);
    expect(container.firstElementChild?.className).toMatch(/ratio1to1/);

    rerender(<Image src="/a.png" alt="a" aspectRatio="16:9" />);
    expect(container.firstElementChild?.className).toMatch(/ratio16to9/);

    rerender(<Image src="/a.png" alt="a" aspectRatio="Fill" />);
    expect(container.firstElementChild?.className).toMatch(/fill/);
  });

  it('applies the object-fit class matching the objectFit prop', () => {
    render(<Image src="/a.png" alt="a" objectFit="contain" />);
    expect(screen.getByAltText('a').className).toMatch(/contain/);
  });

  it('resolves named objectPosition presets to their percentage pair', () => {
    const cases: Record<string, string> = {
      center: '50% 50%',
      top: '50% 0%',
      bottom: '50% 100%',
      left: '0% 50%',
      right: '100% 50%',
      'top-left': '0% 0%',
      'top-right': '100% 0%',
      'bottom-left': '0% 100%',
      'bottom-right': '100% 100%',
    };
    const { rerender } = render(<Image src="/a.png" alt="a" objectPosition="center" />);
    for (const [preset, expected] of Object.entries(cases)) {
      rerender(<Image src="/a.png" alt="a" objectPosition={preset} />);
      expect(screen.getByAltText('a')).toHaveStyle({ objectPosition: expected });
    }
  });

  it('passes an arbitrary objectPosition string through unchanged', () => {
    render(<Image src="/a.png" alt="a" objectPosition="73% 42%" />);
    expect(screen.getByAltText('a')).toHaveStyle({ objectPosition: '73% 42%' });
  });

  it('has no object-position inline style when objectPosition is omitted', () => {
    render(<Image src="/a.png" alt="a" />);
    expect(screen.getByAltText('a').style.objectPosition).toBe('');
  });

  it('calls onClick when the frame is clicked', () => {
    const onClick = jest.fn();
    const { container } = render(<Image src="/a.png" alt="a" onClick={onClick} />);
    fireEvent.click(container.firstElementChild as Element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard-accessible when onClick is provided', () => {
    const onClick = jest.fn();
    const { container } = render(<Image src="/a.png" alt="a" onClick={onClick} />);
    const frame = container.firstElementChild as HTMLElement;
    expect(frame).toHaveAttribute('role', 'button');
    expect(frame).toHaveAttribute('tabIndex', '0');

    fireEvent.keyDown(frame, { key: 'Enter' });
    fireEvent.keyDown(frame, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('has no button role when onClick is not provided', () => {
    const { container } = render(<Image src="/a.png" alt="a" />);
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('applies an additional className when provided', () => {
    const { container } = render(<Image src="/a.png" alt="a" className="custom-class" />);
    expect(container.firstElementChild).toHaveClass('custom-class');
  });
});
