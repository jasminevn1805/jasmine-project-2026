import type { Meta, StoryObj } from '@storybook/react';
import { Textarea, TextareaProps } from '../../design-system/src/components/Textarea';

const meta: Meta<TextareaProps> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label rendered above the textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    rows: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Number of visible text rows',
    },
    error: {
      control: 'text',
      description: 'Error state — pass `true` for red border only, or a string for border + message',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<TextareaProps>;

// ── Default ──
export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a brief description…',
  },
};

// ── Without Label ──
export const WithoutLabel: Story = {
  args: {
    placeholder: 'Write something…',
  },
};

// ── With Value ──
// `defaultValue`, not `value`: a `value` with no `onChange` makes React treat
// the field as controlled-but-frozen - it logs a read-only warning and you
// can't type into the story at all. Uncontrolled is what a demo wants here.
export const WithValue: Story = {
  args: {
    label: 'Bio',
    defaultValue: 'A short paragraph of text that demonstrates how the textarea looks when it contains real content. It should wrap naturally within the available width.',
  },
};

// ── Custom Rows ──
export const CustomRows: Story = {
  args: {
    label: 'Comments',
    placeholder: 'Share your thoughts…',
    rows: 6,
  },
};

// ── Error with Message ──
export const ErrorWithMessage: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description…',
    error: 'This field is required.',
  },
};

// ── Error Boolean (border only) ──
export const ErrorBorderOnly: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter a description…',
    error: true,
  },
};

// ── Disabled ──
export const Disabled: Story = {
  args: {
    label: 'Description',
    value: 'This content is read-only and cannot be edited.',
    disabled: true,
  },
};

// ── All States ──
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)', width: '320px' }}>
      <Textarea label="Default" placeholder="Placeholder text" />
      <Textarea label="With value" defaultValue="Some content that shows how the textarea looks with text inside it." />
      <Textarea label="Error (message)" placeholder="Enter value" error="This field is required." />
      <Textarea label="Error (border)" placeholder="Enter value" error />
      <Textarea label="Disabled" value="Read-only content" disabled />
      <Textarea label="More rows" placeholder="Taller textarea" rows={6} />
    </div>
  ),
};
