import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accordion, AccordionItemData } from './Accordion';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const items: AccordionItemData[] = [
  { id: '1', heading: 'First', content: 'First content' },
  { id: '2', heading: 'Second', content: 'Second content' },
  { id: '3', heading: 'Third', content: 'Third content' },
];

describe('Accordion Component', () => {
  // ─── Rendering ───────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders all item headings', () => {
      render(<Accordion items={items} />);
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('renders one trigger button per item', () => {
      render(<Accordion items={items} />);
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('applies custom className to root', () => {
      const { container } = render(
        <Accordion items={items} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('starts with all items closed by default', () => {
      render(<Accordion items={items} />);
      screen.getAllByRole('button').forEach((btn) => {
        expect(btn).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('does not render a panel when item has no content', () => {
      render(<Accordion items={[{ id: '1', heading: 'Only heading' }]} />);
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });
  });

  // ─── Uncontrolled behavior ───────────────────────────────────────────────

  describe('Uncontrolled mode', () => {
    it('opens an item on click', () => {
      render(<Accordion items={items} />);
      const firstTrigger = screen.getByRole('button', { name: /first/i });

      fireEvent.click(firstTrigger);

      expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes an open item when clicked again', () => {
      render(<Accordion items={items} />);
      const firstTrigger = screen.getByRole('button', { name: /first/i });

      fireEvent.click(firstTrigger);
      fireEvent.click(firstTrigger);

      expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens items specified in defaultOpen', () => {
      render(<Accordion items={items} defaultOpen={['2']} />);
      const secondTrigger = screen.getByRole('button', { name: /second/i });
      expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('only keeps one item open at a time when multiple=false', () => {
      render(<Accordion items={items} />);
      const firstTrigger = screen.getByRole('button', { name: /first/i });
      const secondTrigger = screen.getByRole('button', { name: /second/i });

      fireEvent.click(firstTrigger);
      fireEvent.click(secondTrigger);

      expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('allows multiple items open when multiple=true', () => {
      render(<Accordion items={items} multiple />);
      const firstTrigger = screen.getByRole('button', { name: /first/i });
      const secondTrigger = screen.getByRole('button', { name: /second/i });

      fireEvent.click(firstTrigger);
      fireEvent.click(secondTrigger);

      expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // ─── Controlled behavior ─────────────────────────────────────────────────

  describe('Controlled mode', () => {
    it('reflects the openItems prop', () => {
      render(<Accordion items={items} openItems={['1']} />);
      const firstTrigger = screen.getByRole('button', { name: /first/i });
      const secondTrigger = screen.getByRole('button', { name: /second/i });

      expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('calls onChange with the next open ids on click', () => {
      const onChange = jest.fn();
      render(<Accordion items={items} openItems={[]} onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: /second/i }));

      expect(onChange).toHaveBeenCalledWith(['2']);
    });

    it('does not update internal state when controlled', () => {
      const onChange = jest.fn();
      render(<Accordion items={items} openItems={[]} onChange={onChange} />);
      const firstTrigger = screen.getByRole('button', { name: /first/i });

      fireEvent.click(firstTrigger);

      // still closed because parent didn't update openItems
      expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ─── Disabled state ──────────────────────────────────────────────────────

  describe('Disabled items', () => {
    const disabledItems: AccordionItemData[] = [
      { id: '1', heading: 'Enabled', content: 'A' },
      { id: '2', heading: 'Disabled', content: 'B', disabled: true },
    ];

    it('marks disabled trigger with disabled attribute', () => {
      render(<Accordion items={disabledItems} />);
      const disabledTrigger = screen.getByRole('button', { name: /disabled/i });
      expect(disabledTrigger).toBeDisabled();
    });

    it('does not open when a disabled item is clicked', () => {
      render(<Accordion items={disabledItems} />);
      const disabledTrigger = screen.getByRole('button', { name: /disabled/i });

      fireEvent.click(disabledTrigger);

      expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ─── Accessibility ───────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('links trigger and panel via aria-controls / aria-labelledby', () => {
      render(<Accordion items={items} defaultOpen={['1']} />);
      const firstTrigger = screen.getByRole('button', { name: /first/i });
      const panel = screen.getByRole('region', { name: /first/i });

      const controls = firstTrigger.getAttribute('aria-controls');
      const labelledBy = panel.getAttribute('aria-labelledby');

      expect(controls).toBe(panel.getAttribute('id'));
      expect(labelledBy).toBe(firstTrigger.getAttribute('id'));
    });

    it('hides the panel from the a11y tree when closed', () => {
      render(<Accordion items={items} />);
      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });

    it('reveals the panel when opened', () => {
      render(<Accordion items={items} />);
      fireEvent.click(screen.getByRole('button', { name: /first/i }));
      expect(screen.getByRole('region', { name: /first/i })).toBeInTheDocument();
    });
  });
});
