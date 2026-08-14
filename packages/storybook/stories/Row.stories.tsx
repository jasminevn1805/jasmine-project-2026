import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell, ChevronRight, Globe } from 'react-feather';
import { Row, RowLeadingAccessory, RowTrailingAccessory } from '../../design-system/src/components/Row';

/* ─────────────────────────────────────────────────────────────────────────────
   Row's `leading` / `trailing` props are typed object unions (by design — they
   rule out invalid states like an avatar + an icon at once). Storybook can't
   auto-generate Controls for object unions, so this story defines a flat,
   controllable arg shape and maps it onto the real props in `render`, the same
   way Button's story maps its flat `size`/`type` args directly onto props.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Inline placeholder thumbnail. Deliberately a data URI rather than a remote
 * image - the docs page renders every story at once, and remote thumbnails
 * turn that into a burst of network requests that stall the page.
 */
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
      '<rect width="96" height="96" fill="#d0d8ff"/>' +
      '<circle cx="33" cy="31" r="11" fill="#5a76ff"/>' +
      '<path d="M0 96 L34 50 L62 96 Z" fill="#3355ff"/>' +
      '<path d="M52 96 L75 58 L96 96 Z" fill="#5a76ff"/>' +
      '</svg>',
  );

type LeadingKind = 'None' | 'Checkmark' | 'Checkbox' | 'Radio' | 'Icon' | 'Avatar' | 'Image';
type TrailingKind = 'None' | 'Toggle' | 'Button' | 'Icon' | 'Checkmark';

interface RowStoryProps {
  text: string;
  secondaryText: string;
  divider: boolean;
  leadingKind: LeadingKind;
  avatarInitials: string;
  trailingKind: TrailingKind;
  trailingButtonLabel: string;
}

function buildLeading(kind: LeadingKind, avatarInitials: string): RowLeadingAccessory | undefined {
  switch (kind) {
    case 'Checkmark':
      return { kind: 'checkmark' };
    case 'Checkbox':
      return { kind: 'checkbox' };
    case 'Radio':
      return { kind: 'radio' };
    case 'Icon':
      return { kind: 'icon', icon: <Globe size={24} /> };
    case 'Avatar':
      return { kind: 'avatar', initials: avatarInitials };
    case 'Image':
      return { kind: 'image', src: PLACEHOLDER_IMAGE, alt: '' };
    case 'None':
    default:
      return undefined;
  }
}

function buildTrailing(kind: TrailingKind, buttonLabel: string): RowTrailingAccessory | undefined {
  switch (kind) {
    case 'Toggle':
      return { kind: 'toggle' };
    case 'Button':
      return { kind: 'button', label: buttonLabel, onClick: () => alert('clicked') };
    case 'Icon':
      return { kind: 'icon', icon: <ChevronRight size={24} /> };
    case 'Checkmark':
      return { kind: 'checkmark' };
    case 'None':
    default:
      return undefined;
  }
}

const meta: Meta<RowStoryProps> = {
  title: 'Components/Row',
  component: Row as unknown as React.FC<RowStoryProps>,
  parameters: {
    layout: 'padded',
    // Row's real `leading`/`trailing` props are object unions. Storybook infers
    // useless "Set object" controls for them that this story's `render` ignores
    // entirely - clicking them appears to do nothing. The interactive equivalents
    // are the `leadingKind`/`trailingKind` selects below.
    controls: { exclude: ['leading', 'trailing', 'className'] },
    docs: {
      // MUST stay 'code'. Row's accessory props are objects that contain React
      // elements ({ kind: 'icon', icon: <Globe/> }). The default 'auto' source
      // block serialises rendered args dynamically, and walking a React element
      // drags in its internal fiber/owner references - that walk never finishes
      // and hard-locks the browser's main thread on the Docs page. 'code' emits
      // the story's static source text instead and sidesteps it entirely.
      source: { type: 'code' },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text', description: 'Primary row text' },
    secondaryText: { control: 'text', description: 'Secondary text below the primary text' },
    divider: { control: 'boolean', description: 'Renders a subtle divider along the bottom edge' },
    leadingKind: {
      control: 'select',
      options: ['None', 'Checkmark', 'Checkbox', 'Radio', 'Icon', 'Avatar', 'Image'],
      description: 'Leading accessory',
    },
    avatarInitials: {
      control: 'text',
      description: 'Initials shown when leadingKind = "Avatar"',
      if: { arg: 'leadingKind', eq: 'Avatar' },
    },
    trailingKind: {
      control: 'select',
      options: ['None', 'Toggle', 'Button', 'Icon', 'Checkmark'],
      description: 'Trailing accessory',
    },
    trailingButtonLabel: {
      control: 'text',
      description: 'Label shown when trailingKind = "Button"',
      if: { arg: 'trailingKind', eq: 'Button' },
    },
  },
};

export default meta;
type Story = StoryObj<RowStoryProps>;

const stage: React.CSSProperties = { width: 400 };

/* ═══════════════════════════════════════════════════════════════════════════
   INTERACTIVE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Fully interactive — every field below maps to a Control. Change
 * `leadingKind` / `trailingKind` to swap accessories live.
 */
export const Default: Story = {
  args: {
    text: 'Text',
    secondaryText: 'Secondary text',
    divider: true,
    leadingKind: 'Icon',
    avatarInitials: 'JD',
    trailingKind: 'Toggle',
    trailingButtonLabel: 'Action',
  },
  render: (args) => (
    <div style={stage}>
      <Row
        text={args.text}
        secondaryText={args.secondaryText || undefined}
        divider={args.divider}
        leading={buildLeading(args.leadingKind, args.avatarInitials)}
        trailing={buildTrailing(args.trailingKind, args.trailingButtonLabel)}
      />
    </div>
  ),
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC REFERENCE SHEETS
   ═══════════════════════════════════════════════════════════════════════════ */

export const LeadingAccessories: Story = {
  name: '2 · Leading Accessories',
  render: () => (
    <div style={stage}>
      <Row text="Checkmark" leading={{ kind: 'checkmark' }} />
      <Row text="Checkbox" leading={{ kind: 'checkbox' }} />
      <Row text="Radio" leading={{ kind: 'radio' }} />
      <Row text="Icon" leading={{ kind: 'icon', icon: <Globe size={24} /> }} />
      <Row text="Avatar" secondaryText="Jane Doe" leading={{ kind: 'avatar', initials: 'JD' }} />
      <Row
        text="Image"
        secondaryText="Album cover"
        leading={{ kind: 'image', src: PLACEHOLDER_IMAGE, alt: 'Album cover' }}
        divider={false}
      />
    </div>
  ),
};

export const TrailingAccessories: Story = {
  name: '3 · Trailing Accessories',
  render: () => (
    <div style={stage}>
      <Row text="Toggle" secondaryText="Push notifications" trailing={{ kind: 'toggle' }} />
      <Row text="Button" trailing={{ kind: 'button', label: 'Action', onClick: () => alert('clicked') }} />
      <Row text="Icon" trailing={{ kind: 'icon', icon: <ChevronRight size={24} /> }} />
      <Row text="Checkmark" trailing={{ kind: 'checkmark' }} divider={false} />
    </div>
  ),
};

/**
 * A settings-style list assembled from multiple `Row`s — the natural use case.
 */
export const SettingsList: Story = {
  name: '4 · Settings List',
  render: () => (
    <div style={stage}>
      <Row
        text="Jane Doe"
        secondaryText="jane@example.com"
        leading={{ kind: 'avatar', initials: 'JD' }}
        trailing={{ kind: 'icon', icon: <ChevronRight size={24} /> }}
      />
      <Row
        text="Push notifications"
        secondaryText="Get notified about new activity"
        leading={{ kind: 'icon', icon: <Bell size={24} /> }}
        trailing={{ kind: 'toggle' }}
      />
      <Row
        text="Language"
        secondaryText="English (US)"
        leading={{ kind: 'icon', icon: <Globe size={24} /> }}
        trailing={{ kind: 'icon', icon: <ChevronRight size={24} /> }}
        divider={false}
      />
    </div>
  ),
};
