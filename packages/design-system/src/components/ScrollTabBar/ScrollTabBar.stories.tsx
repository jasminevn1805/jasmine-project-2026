import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ScrollTabBar, ScrollTabBarProps } from './ScrollTabBar';

// ── Storybook meta ────────────────────────────────────────

const meta: Meta<ScrollTabBarProps> = {
  title: 'Components/ScrollTabBar',
  component: ScrollTabBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['brand', 'inverse', 'neutral'],
      description: 'Active tab colour variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Tab size preset',
    },
    gap: {
      control: 'text',
      description: 'Gap between tabs (CSS value)',
    },
    highlightId: {
      control: 'text',
      description: 'Tab id to show a dot indicator beneath',
    },
  },
};

export default meta;
type Story = StoryObj<ScrollTabBarProps>;

// ── Helpers ────────────────────────────────────────────────

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
].map((label, i) => ({ id: String(i), label }));

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
  (label, i) => ({ id: String(i), label }),
);

const CATEGORIES = [
  'All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Drinks',
].map((label) => ({ id: label.toLowerCase(), label }));

// ── Stories ────────────────────────────────────────────────

/** Month selector — brand variant (default) */
export const MonthSelector: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState<string>('3'); // April
    return (
      <ScrollTabBar
        {...args}
        items={MONTHS}
        activeId={activeId}
        onSelect={setActiveId}
        highlightId={String(new Date().getMonth())}
      />
    );
  },
  args: {
    variant: 'brand',
    size: 'sm',
  },
};

/** Day-of-week selector — inverse variant */
export const DaySelector: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState<string>('0');
    return (
      <ScrollTabBar
        {...args}
        items={DAYS}
        activeId={activeId}
        onSelect={setActiveId}
      />
    );
  },
  args: {
    variant: 'inverse',
    size: 'md',
  },
};

/** Category filter — neutral variant */
export const CategoryFilter: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState<string>('all');
    return (
      <ScrollTabBar
        {...args}
        items={CATEGORIES}
        activeId={activeId}
        onSelect={setActiveId}
      />
    );
  },
  args: {
    variant: 'neutral',
    size: 'md',
    gap: '6px',
  },
};

/** All variants side-by-side */
export const AllVariants: Story = {
  render: () => {
    const [brandActive, setBrandActive] = useState('3');
    const [inverseActive, setInverseActive] = useState('0');
    const [neutralActive, setNeutralActive] = useState('all');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div>
          <p style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>
            Brand variant (month selector)
          </p>
          <ScrollTabBar
            items={MONTHS}
            activeId={brandActive}
            onSelect={setBrandActive}
            highlightId={String(new Date().getMonth())}
            variant="brand"
            size="sm"
          />
        </div>
        <div>
          <p style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>
            Inverse variant (day selector)
          </p>
          <ScrollTabBar
            items={DAYS}
            activeId={inverseActive}
            onSelect={setInverseActive}
            variant="inverse"
            size="md"
          />
        </div>
        <div>
          <p style={{ marginBottom: 8, fontWeight: 600, fontSize: 13 }}>
            Neutral variant (category filter)
          </p>
          <ScrollTabBar
            items={CATEGORIES}
            activeId={neutralActive}
            onSelect={setNeutralActive}
            variant="neutral"
            size="md"
            gap="6px"
          />
        </div>
      </div>
    );
  },
};
