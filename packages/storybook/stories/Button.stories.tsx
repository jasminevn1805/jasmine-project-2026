import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from '../../design-system/src/components/Button';
import * as Icons from 'react-feather';

/* ─────────────────────────────────────────────────────────────────────────────
   Button's icon variants (WithLeadingIcon, AddButton, DeleteButton, etc. below)
   previously only existed as separate fixed stories - `children` accepted an
   icon + text pair, but there was no way to pick an icon from the Default
   story's Controls panel the way `size`/`type` can be picked. `leadingIcon` /
   `trailingIcon` add that: plain icon-name strings in args (never a React
   element - embedding an actual icon element in args risks freezing the Docs
   page's source serializer, the same bug that hit Row's story), resolved to a
   real icon component only inside `render`.
   ───────────────────────────────────────────────────────────────────────── */

const ICON_NAMES = [
  'None',
  'ChevronRight',
  'ChevronLeft',
  'ArrowRight',
  'ArrowLeft',
  'Download',
  'Upload',
  'Plus',
  'Minus',
  'Check',
  'X',
  'Trash2',
  'Edit',
  'Save',
  'Copy',
  'Search',
  'Settings',
  'User',
  'Home',
  'Mail',
  'Bell',
  'Heart',
  'Star',
  'ExternalLink',
  'LogIn',
  'LogOut',
  'RefreshCw',
  'Send',
  'Filter',
  'Calendar',
  'File',
] as const;

type IconName = (typeof ICON_NAMES)[number];

function renderIcon(name: IconName, size: number): React.ReactNode {
  if (name === 'None') return null;
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[name];
  return <IconComponent size={size} />;
}

// Extended props for Storybook: same shape as ButtonProps, plus icon-name
// selects for the Default story's interactive preview.
interface ButtonStoryProps extends ButtonProps {
  leadingIcon?: IconName;
  trailingIcon?: IconName;
}

const meta: Meta<ButtonStoryProps> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content (text, icons, or any JSX)',
    },
    size: {
      control: 'select',
      options: ['S', 'M', 'L'],
      description: 'Button size',
    },
    type: {
      control: 'select',
      options: [
        'Primary',
        'Secondary',
        'Tertiary',
        'Tertiary Mono',
        'Inverse',
        'Mono',
        'Outline',
        'Outline Mono',
        'Text',
        'Text Mono',
        'Negative Primary',
        'Negative Outline',
        'Negative Text',
      ],
      description: 'Button variant type',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    leadingIcon: {
      control: 'select',
      options: ICON_NAMES,
      description: 'Icon rendered before the text (Default story only)',
    },
    trailingIcon: {
      control: 'select',
      options: ICON_NAMES,
      description: 'Icon rendered after the text (Default story only)',
    },
  },
};

export default meta;
type Story = StoryObj<ButtonStoryProps>;

// Default Story — fully interactive, including icon selection
export const Default: Story = {
  render: (args) => {
    const size = args.size ?? 'M';
    const iconSize = size === 'L' ? 24 : size === 'M' ? 20 : 16;
    return (
      <Button {...args}>
        {renderIcon(args.leadingIcon ?? 'None', iconSize)}
        {args.children}
        {renderIcon(args.trailingIcon ?? 'None', iconSize)}
      </Button>
    );
  },
  args: {
    children: 'Button',
    size: 'M',
    type: 'Primary',
    leadingIcon: 'None',
    trailingIcon: 'None',
  },
};

// Size Variants
export const SizeSmall: Story = {
  args: {
    children: 'Small Button',
    size: 'S',
    type: 'Primary',
  },
};

export const SizeMedium: Story = {
  args: {
    children: 'Medium Button',
    size: 'M',
    type: 'Primary',
  },
};

export const SizeLarge: Story = {
  args: {
    children: 'Large Button',
    size: 'L',
    type: 'Primary',
  },
};

// Primary Variants
export const Primary: Story = {
  args: {
    children: 'Primary',
    type: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    type: 'Secondary',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary',
    type: 'Tertiary',
  },
};

export const TertiaryMono: Story = {
  args: {
    children: 'Tertiary Mono',
    type: 'Tertiary Mono',
  },
};

export const Inverse: Story = {
  args: {
    children: 'Inverse',
    type: 'Inverse',
  },
};

export const Mono: Story = {
  args: {
    children: 'Mono',
    type: 'Mono',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    type: 'Outline',
  },
};

export const OutlineMono: Story = {
  args: {
    children: 'Outline Mono',
    type: 'Outline Mono',
  },
};

export const Text: Story = {
  args: {
    children: 'Text',
    type: 'Text',
  },
};

export const TextMono: Story = {
  args: {
    children: 'Text Mono',
    type: 'Text Mono',
  },
};

export const NegativePrimary: Story = {
  args: {
    children: 'Negative Primary',
    type: 'Negative Primary',
  },
};

export const NegativeOutline: Story = {
  args: {
    children: 'Negative Outline',
    type: 'Negative Outline',
  },
};

export const NegativeText: Story = {
  args: {
    children: 'Negative Text',
    type: 'Negative Text',
  },
};

// With Icons
export const WithLeadingIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <Icons.Download size={20} /> Download
    </Button>
  ),
  args: {
    type: 'Primary',
  },
};

export const WithTrailingIcon: Story = {
  render: (args) => (
    <Button {...args}>
      Continue <Icons.ChevronRight size={20} />
    </Button>
  ),
  args: {
    type: 'Primary',
  },
};

export const WithBothIcons: Story = {
  render: (args) => (
    <Button {...args}>
      <Icons.Check size={20} /> Save <Icons.ChevronRight size={20} />
    </Button>
  ),
  args: {
    type: 'Primary',
  },
};

// States
export const Loading: Story = {
  args: {
    children: 'Loading',
    type: 'Primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    type: 'Primary',
    disabled: true,
  },
};

// Action Buttons
export const AddButton: Story = {
  render: (args) => (
    <Button {...args}>
      <Icons.Plus size={20} /> Add Item
    </Button>
  ),
  args: {
    type: 'Primary',
  },
};

export const DeleteButton: Story = {
  render: (args) => (
    <Button {...args}>
      <Icons.Trash2 size={20} /> Delete
    </Button>
  ),
  args: {
    type: 'Negative Primary',
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-16)', alignItems: 'center' }}>
      <Button size="S" type="Primary">Small</Button>
      <Button size="M" type="Primary">Medium</Button>
      <Button size="L" type="Primary">Large</Button>
    </div>
  ),
};

// All Types Comparison
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', alignItems: 'flex-start' }}>
      <Button type="Primary">Primary</Button>
      <Button type="Secondary">Secondary</Button>
      <Button type="Tertiary">Tertiary</Button>
      <Button type="Tertiary Mono">Tertiary Mono</Button>
      <Button type="Inverse">Inverse</Button>
      <Button type="Mono">Mono</Button>
      <Button type="Outline">Outline</Button>
      <Button type="Outline Mono">Outline Mono</Button>
      <Button type="Text">Text</Button>
      <Button type="Text Mono">Text Mono</Button>
      <Button type="Negative Primary">Negative Primary</Button>
      <Button type="Negative Outline">Negative Outline</Button>
      <Button type="Negative Text">Negative Text</Button>
    </div>
  ),
};

// Icon Showcase
export const IconShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 'var(--space-12)', flexWrap: 'wrap' }}>
        <Button type="Primary"><Icons.Download size={20} /> Download</Button>
        <Button type="Primary">Continue <Icons.ChevronRight size={20} /></Button>
        <Button type="Secondary"><Icons.Plus size={20} /> Add Item</Button>
        <Button type="Negative Primary"><Icons.Trash2 size={20} /> Delete</Button>
        <Button type="Primary"><Icons.Check size={20} /> Save <Icons.ChevronRight size={20} /></Button>
      </div>
      <div style={{ marginTop: 'var(--space-8)', padding: 'var(--space-12)', backgroundColor: 'var(--color-background-subtle)', borderRadius: 'var(--border-radius-xs)' }}>
        <p style={{ margin: 0, fontSize: 'var(--typography-desktop-label-m-semi-bold-size)', color: 'var(--color-text-tertiary)' }}>
          <strong>Note:</strong> Icons are from react-feather library. Compose icons with text naturally as children.
        </p>
      </div>
    </div>
  ),
};

// Icon Gallery - All Available Icons
export const IconGallery: Story = {
  render: () => (
    <div style={{ padding: 'var(--space-20)' }}>
      <h3 style={{ marginBottom: 'var(--space-20)' }}>Available Feather Icons</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-12)' }}>
        <Button type="Secondary" size="S">ChevronRight <Icons.ChevronRight size={16} /></Button>
        <Button type="Secondary" size="S"><Icons.ChevronLeft size={16} /> ChevronLeft</Button>
        <Button type="Primary" size="S"><Icons.Download size={16} /> Download</Button>
        <Button type="Primary" size="S"><Icons.Upload size={16} /> Upload</Button>
        <Button type="Primary" size="S"><Icons.Plus size={16} /> Plus</Button>
        <Button type="Secondary" size="S"><Icons.Minus size={16} /> Minus</Button>
        <Button type="Primary" size="S"><Icons.Check size={16} /> Check</Button>
        <Button type="Secondary" size="S"><Icons.X size={16} /> X</Button>
        <Button type="Negative Primary" size="S"><Icons.Trash2 size={16} /> Trash</Button>
        <Button type="Secondary" size="S"><Icons.Edit size={16} /> Edit</Button>
        <Button type="Primary" size="S"><Icons.Save size={16} /> Save</Button>
        <Button type="Secondary" size="S"><Icons.Copy size={16} /> Copy</Button>
        <Button type="Secondary" size="S"><Icons.Search size={16} /> Search</Button>
        <Button type="Secondary" size="S"><Icons.Settings size={16} /> Settings</Button>
        <Button type="Secondary" size="S"><Icons.User size={16} /> User</Button>
        <Button type="Secondary" size="S"><Icons.Home size={16} /> Home</Button>
        <Button type="Secondary" size="S"><Icons.Mail size={16} /> Mail</Button>
        <Button type="Secondary" size="S"><Icons.Bell size={16} /> Bell</Button>
        <Button type="Secondary" size="S"><Icons.Heart size={16} /> Heart</Button>
        <Button type="Secondary" size="S"><Icons.Star size={16} /> Star</Button>
        <Button type="Secondary" size="S">Arrow Right <Icons.ArrowRight size={16} /></Button>
        <Button type="Secondary" size="S"><Icons.ArrowLeft size={16} /> Arrow Left</Button>
        <Button type="Secondary" size="S">External Link <Icons.ExternalLink size={16} /></Button>
        <Button type="Primary" size="S"><Icons.LogIn size={16} /> Log In</Button>
        <Button type="Secondary" size="S"><Icons.LogOut size={16} /> Log Out</Button>
        <Button type="Secondary" size="S"><Icons.RefreshCw size={16} /> Refresh</Button>
        <Button type="Primary" size="S">Send <Icons.Send size={16} /></Button>
        <Button type="Secondary" size="S"><Icons.Filter size={16} /> Filter</Button>
        <Button type="Secondary" size="S"><Icons.Calendar size={16} /> Calendar</Button>
        <Button type="Secondary" size="S"><Icons.File size={16} /> File</Button>
      </div>
      <div style={{ marginTop: 'var(--space-20)', padding: 'var(--space-16)', backgroundColor: 'var(--color-background-brand-subtle)', borderRadius: 'var(--border-radius-xs)' }}>
        <p style={{ margin: 0, fontSize: 'var(--typography-desktop-label-m-semi-bold-size)', color: 'var(--color-text-brand)' }}>
          <strong>📦 More Icons Available:</strong> This is just a sample! The react-feather library includes 280+ icons. 
          Visit <a href="https://feathericons.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-brand)', fontWeight: 'var(--typography-desktop-label-m-semi-bold-weight)' as React.CSSProperties['fontWeight'] }}>feathericons.com</a> to explore all icons.
        </p>
      </div>
    </div>
  ),
};
