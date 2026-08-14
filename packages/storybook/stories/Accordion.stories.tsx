import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItemData } from '../../design-system/src/components/Accordion';

/* ─────────────────────────────────────────────────────────────────────────────
   Accordion's `items` / `defaultOpen` / `openItems` props are arrays of objects,
   so Storybook can only offer a raw JSON textarea for them ("Set object") - not
   a click-to-see-variant experience like Button's `size`/`type` selects. This
   story exposes a flat, selectable arg shape instead (same approach used for
   Row's story) so the Default story's Controls panel gives real dropdowns, and
   `render` builds the actual `items`/`defaultOpen` underneath.
   ───────────────────────────────────────────────────────────────────────── */

type OpenState = 'All Closed' | 'First Item Open' | 'All Open';
type DisabledItem = 'None' | 'Second Item';

interface AccordionStoryProps {
  multiple: boolean;
  openState: OpenState;
  disabledItem: DisabledItem;
}

const baseItems: AccordionItemData[] = [
  {
    id: '1',
    heading: 'Heading',
    content:
      'Text that appears when the accordion item is expanded. This uses the Text/L/Regular typography token.',
  },
  { id: '2', heading: 'Heading', content: 'Another expandable section with some text content.' },
  { id: '3', heading: 'Heading', content: 'A third item to demonstrate the stacked divider layout.' },
];

function buildItems(disabledItem: DisabledItem): AccordionItemData[] {
  return baseItems.map((item) => ({
    ...item,
    disabled: disabledItem === 'Second Item' && item.id === '2',
  }));
}

function buildDefaultOpen(openState: OpenState): string[] {
  switch (openState) {
    case 'First Item Open':
      return ['1'];
    case 'All Open':
      // `defaultOpen` seeds Accordion's internal useState directly - it isn't
      // filtered by `multiple` (that flag only constrains what happens when a
      // user clicks a header afterward). So "All Open" always opens all three
      // here regardless of `multiple`; capping it based on `multiple` was the
      // bug - it made this control silently collapse to 1 item and look inert.
      return ['1', '2', '3'];
    case 'All Closed':
    default:
      return [];
  }
}

const meta: Meta<AccordionStoryProps> = {
  title: 'Components/Accordion',
  component: Accordion as unknown as React.FC<AccordionStoryProps>,
  parameters: {
    layout: 'centered',
    controls: { exclude: ['items', 'defaultOpen', 'openItems', 'onChange', 'className'] },
  },
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean', description: 'Allow multiple items open simultaneously' },
    openState: {
      control: 'select',
      options: ['All Closed', 'First Item Open', 'All Open'],
      description: 'Which item(s) start open',
    },
    disabledItem: {
      control: 'select',
      options: ['None', 'Second Item'],
      description: 'Disable one item to see the disabled state',
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
type Story = StoryObj<AccordionStoryProps>;

/* ═══════════════════════════════════════════════════════════════════════════
   INTERACTIVE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Fully interactive — every field below maps to a Control. Change `openState`
 * or `disabledItem` to see the accordion update immediately. `multiple`
 * changes what happens on the *next* click rather than the current layout
 * (with two-plus items already open, click another header - with `multiple`
 * off it closes the others; with it on, all stay open).
 */
export const Default: Story = {
  args: {
    multiple: false,
    openState: 'First Item Open',
    disabledItem: 'None',
  },
  render: (args) => (
    <Accordion
      // `defaultOpen` only applies once, on mount (it seeds Accordion's internal
      // useState). Keying on the controls forces a fresh mount whenever they
      // change, so the preview actually reacts instead of staying frozen at
      // whatever state it first opened in.
      key={`${args.multiple}-${args.openState}-${args.disabledItem}`}
      items={buildItems(args.disabledItem)}
      multiple={args.multiple}
      defaultOpen={buildDefaultOpen(args.openState)}
    />
  ),
};

/* ═══════════════════════════════════════════════════════════════════════════
   NAMED STATES — same interactive mechanism as Default, just a different
   starting point. Switching `multiple` / `openState` / `disabledItem` on any
   of these pages updates the preview live, exactly like on Default.

   (These used to be `render: () => (...)` with no `args` param at all - they
   displayed the same Controls panel as Default, since argTypes are defined
   once at the meta level and Storybook shows them on every story regardless
   of whether that story's render function reads `args`, but changing any
   control did nothing. Reported directly: "Control fields from the rest of
   variant pages don't work properly when switched options.")
   ═══════════════════════════════════════════════════════════════════════════ */

const namedStateRender: Story['render'] = (args) => (
  <Accordion
    key={`${args.multiple}-${args.openState}-${args.disabledItem}`}
    items={buildItems(args.disabledItem)}
    multiple={args.multiple}
    defaultOpen={buildDefaultOpen(args.openState)}
  />
);

/** Closed state — matches Figma variant `Open=False`. */
export const Closed: Story = {
  args: { multiple: false, openState: 'All Closed', disabledItem: 'None' },
  render: namedStateRender,
};

/** Open state — matches Figma variant `Open=True`. */
export const Open: Story = {
  args: { multiple: false, openState: 'First Item Open', disabledItem: 'None' },
  render: namedStateRender,
};

/** Multiple open — allow more than one item expanded at a time. */
export const MultipleOpen: Story = {
  args: { multiple: true, openState: 'All Open', disabledItem: 'None' },
  render: namedStateRender,
};

/** With a disabled item. */
export const WithDisabled: Story = {
  args: { multiple: false, openState: 'All Closed', disabledItem: 'Second Item' },
  render: namedStateRender,
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC REFERENCE SHEET
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * FAQ-style usage with rich content. Controls are deliberately disabled on
 * this one story (`parameters.controls.disable`): its content is real Q&A
 * copy, not the shared 3-item placeholder set the `multiple`/`openState`/
 * `disabledItem` controls operate on, so showing them here would just
 * reintroduce the same "control does nothing" problem for a different reason.
 */
export const FAQ: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Accordion
      items={[
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
      ]}
    />
  ),
};
