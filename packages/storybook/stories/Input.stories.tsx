import type { Meta, StoryObj } from '@storybook/react';
import { Input, InputProps } from '../../design-system/src/components/Input';

const meta: Meta<InputProps> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label rendered above the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'url', 'search', 'date', 'tel'],
      description: 'HTML input type',
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
type Story = StoryObj<InputProps>;

// ── Default ──
export const Default: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

// ── Without Label ──
export const WithoutLabel: Story = {
  args: {
    placeholder: 'Search…',
    type: 'search',
  },
};

// ── With Value ──
// `defaultValue`, not `value`: a `value` with no `onChange` makes React treat
// the field as controlled-but-frozen - it logs a read-only warning and you
// can't type into the story at all. Uncontrolled is what a demo wants here.
export const WithValue: Story = {
  args: {
    label: 'Full name',
    defaultValue: 'Jane Doe',
    type: 'text',
  },
};

// ── Number Input ──
export const NumberInput: Story = {
  args: {
    label: 'Quantity',
    placeholder: '1',
    type: 'number',
  },
};

// ── Date Input ──
export const DateInput: Story = {
  args: {
    label: 'Start date',
    type: 'date',
  },
};

// ── URL Input ──
export const URLInput: Story = {
  args: {
    label: 'Website',
    placeholder: 'https://example.com',
    type: 'url',
  },
};

// ── Password Input ──
export const PasswordInput: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
  },
};

// ── Error with Message ──
export const ErrorWithMessage: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address.',
  },
};

// ── Error Boolean (border only) ──
export const ErrorBorderOnly: Story = {
  args: {
    label: 'Website',
    placeholder: 'https://…',
    defaultValue: 'not-a-url',
    error: true,
  },
};

// ── Disabled ──
export const Disabled: Story = {
  args: {
    label: 'Username',
    value: 'janedoe',
    disabled: true,
  },
};

// ── All States ──
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)', width: '320px' }}>
      <Input label="Default" placeholder="Placeholder text" />
      <Input label="With value" defaultValue="Some content" />
      <Input label="Error (message)" placeholder="Enter value" error="This field is required." />
      <Input label="Error (border)" placeholder="Enter value" error />
      <Input label="Disabled" value="Read-only content" disabled />
      <Input label="Date" type="date" />
      <Input label="Number" type="number" placeholder="0" />
    </div>
  ),
};
