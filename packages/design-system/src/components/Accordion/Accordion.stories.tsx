import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionProps } from './Accordion';

const meta: Meta<AccordionProps> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of accordion items { id, heading, content?, disabled? }',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple items open simultaneously',
    },
    defaultOpen: {
      control: 'object',
      description: 'IDs of items open by default (uncontrolled mode)',
    },
    openItems: {
      control: 'object',
      description: 'Controlled open state — IDs of currently open items',
    },
    onChange: {
      action: 'changed',
      description: 'Called when open state changes',
    },
    className: {
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<AccordionProps>;

// ─── Sample data ─────────────────────────────────────────────────────────────

const sampleItems = [
  {
    id: '1',
    heading: 'Heading',
    content:
      'Text that appears when the accordion item is expanded. This uses the Text/L/Regular typography token.',
  },
  {
    id: '2',
    heading: 'Heading',
    content: 'Another expandable section with some text content.',
  },
  {
    id: '3',
    heading: 'Heading',
    content: 'A third item to demonstrate the stacked divider layout.',
  },
];

// ─── Stories ─────────────────────────────────────────────────────────────────

/**
 * Default Accordion — single-open mode, all items closed.
 */
export const Default: Story = {
  args: {
    items: sampleItems,
    multiple: false,
  },
};

/**
 * Closed state — matches Figma variant `Open=False`.
 */
export const Closed: Story = {
  args: {
    items: [{ id: '1', heading: 'Heading', content: 'Hidden until expanded.' }],
  },
};

/**
 * Open state — matches Figma variant `Open=True`.
 */
export const Open: Story = {
  args: {
    items: [{ id: '1', heading: 'Heading', content: 'Text' }],
    defaultOpen: ['1'],
  },
};

/**
 * Multiple open — allow more than one item expanded at a time.
 */
export const MultipleOpen: Story = {
  args: {
    items: sampleItems,
    multiple: true,
    defaultOpen: ['1', '2'],
  },
};

/**
 * With a disabled item.
 */
export const WithDisabled: Story = {
  args: {
    items: [
      { id: '1', heading: 'Enabled item', content: 'This one works.' },
      { id: '2', heading: 'Disabled item', content: 'Cannot open.', disabled: true },
      { id: '3', heading: 'Another enabled', content: 'This one works too.' },
    ],
  },
};

/**
 * FAQ-style usage with rich content.
 */
export const FAQ: Story = {
  args: {
    items: [
      {
        id: 'q1',
        heading: 'What is this design system?',
        content:
          'A Figma-driven React design system with semantic tokens for colors, spacing, typography, borders, and more.',
      },
      {
        id: 'q2',
        heading: 'How are tokens organized?',
        content:
          'Primitive tokens define raw values. Semantic tokens map them to roles like Text/Primary, Border/Subtle, Space/M.',
      },
      {
        id: 'q3',
        heading: 'Can I theme per project?',
        content:
          'Yes — each project overrides the CSS variables with its own palette while keeping the same semantic structure.',
      },
    ],
  },
};
