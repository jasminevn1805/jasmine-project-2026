import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider, DividerProps } from '../../design-system/src/components/Divider';

/* ─────────────────────────────────────────────────────────────────────────── */

const meta: Meta<DividerProps> = {
  title: 'Components/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['Default', 'Subtle'] },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<DividerProps>;

const stage: React.CSSProperties = { width: 320 };

/**
 * Fully interactive — the `type` control switches the line between the
 * Default (--color-border-primary) and Subtle (--color-border-subtle) weight.
 * (Previously this story ignored args entirely and always rendered Default;
 * the controllable version was a separate "Playground" story buried last.)
 */
export const Default: Story = {
  args: { type: 'Default' },
  render: (args) => (
    <div style={stage}>
      <Divider {...args} />
    </div>
  ),
};

/** Subtle weight on its own, for direct comparison against the Default. */
export const Subtle: Story = {
  name: '2 · Subtle',
  render: () => (
    <div style={stage}>
      <Divider type="Subtle" />
    </div>
  ),
};
