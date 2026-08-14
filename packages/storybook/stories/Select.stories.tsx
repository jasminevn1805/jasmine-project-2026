import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectProps } from '../../design-system/src/components/Select';

const meta: Meta<SelectProps> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label rendered above the select',
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
type Story = StoryObj<SelectProps>;

// ── Default ──
export const Default: Story = {
  args: {
    label: 'Country',
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="uk">United Kingdom</option>
      <option value="au">Australia</option>
    </Select>
  ),
};

// ── Without Label ──
export const WithoutLabel: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="">Select an option…</option>
      <option value="a">Option A</option>
      <option value="b">Option B</option>
      <option value="c">Option C</option>
    </Select>
  ),
};

// ── With Selected Value ──
export const WithSelectedValue: Story = {
  args: {
    label: 'Country',
    defaultValue: 'ca',
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="uk">United Kingdom</option>
      <option value="au">Australia</option>
    </Select>
  ),
};

// ── Many Options ──
export const ManyOptions: Story = {
  args: {
    label: 'Time zone',
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a time zone</option>
      <option value="pst">Pacific (UTC−8)</option>
      <option value="mst">Mountain (UTC−7)</option>
      <option value="cst">Central (UTC−6)</option>
      <option value="est">Eastern (UTC−5)</option>
      <option value="gmt">GMT (UTC+0)</option>
      <option value="cet">Central European (UTC+1)</option>
      <option value="jst">Japan (UTC+9)</option>
      <option value="aest">Australian Eastern (UTC+10)</option>
    </Select>
  ),
};

// ── Error with Message ──
export const ErrorWithMessage: Story = {
  args: {
    label: 'Country',
    error: 'Please select a country.',
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="uk">United Kingdom</option>
    </Select>
  ),
};

// ── Error Boolean (border only) ──
export const ErrorBorderOnly: Story = {
  args: {
    label: 'Country',
    error: true,
  },
  render: (args) => (
    <Select {...args}>
      <option value="">Select a country</option>
      <option value="us">United States</option>
    </Select>
  ),
};

// ── Disabled ──
export const Disabled: Story = {
  args: {
    label: 'Country',
    disabled: true,
    defaultValue: 'uk',
  },
  render: (args) => (
    <Select {...args}>
      <option value="us">United States</option>
      <option value="ca">Canada</option>
      <option value="uk">United Kingdom</option>
    </Select>
  ),
};

// ── All States ──
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)', width: '320px' }}>
      <Select label="Default">
        <option value="">Choose…</option>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>

      <Select label="Selected" defaultValue="b">
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>

      <Select label="Error (message)" error="Selection is required.">
        <option value="">Choose…</option>
        <option value="a">Option A</option>
      </Select>

      <Select label="Error (border)" error>
        <option value="">Choose…</option>
        <option value="a">Option A</option>
      </Select>

      <Select label="Disabled" disabled defaultValue="a">
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>
    </div>
  ),
};
