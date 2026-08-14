import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Modal, ModalProps } from '../../design-system/src/components/Modal';
import { Input } from '../../design-system/src/components/Input';
import { Select } from '../../design-system/src/components/Select';
import { Textarea } from '../../design-system/src/components/Textarea';

/* ─── Story-level extra controls ─────────────────────────────────────────── */
type ContentKind = 'placeholder' | 'text' | 'list' | 'form';
type ExtraArgs = { content?: ContentKind };
type StoryArgs = ModalProps & ExtraArgs;

/**
 * Inline-stage CSS
 * Renders the Modal inside its story container instead of as a fixed overlay,
 * so (a) the docs page can scroll, (b) the stage hugs the modal's height,
 * (c) the stage can use a project-token background color.
 *
 * Class names are targeted with `[class*="…"]` because CSS Modules hash them.
 */
const STAGE_CLASS = 'modal-story-stage';
const stageStyles = `
.${STAGE_CLASS} {
  position: relative;
  background: var(--color-background-subtle);
  border-radius: var(--border-radius-l);
  padding: var(--space-32);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.${STAGE_CLASS} [class*="backdrop"] {
  position: static !important;
  inset: auto !important;
  z-index: auto !important;
  background: transparent !important;
  padding: 0 !important;
  animation: none !important;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.${STAGE_CLASS} [class*="panel"] {
  max-height: none !important;
  animation: none !important;
}
`;

const meta: Meta<StoryArgs> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <style>{stageStyles}</style>
        <Story />
      </>
    ),
  ],
  argTypes: {
    open: { control: 'boolean' },
    device: {
      control: 'inline-radio',
      options: ['Desktop', 'Mobile'],
      description: 'Device variant — controls width, padding, heading scale & action layout',
    },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    hideCloseButton: { control: 'boolean' },
    hideActions: { control: 'boolean' },
    content: {
      name: 'content',
      control: 'inline-radio',
      options: ['placeholder', 'text', 'list', 'form'],
      description: 'Story-only: what to render inside the modal slot',
      table: { category: 'Story' },
    },
    // Hidden — not useful in Storybook controls
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
    slot: { table: { disable: true } },
    children: { table: { disable: true } },
    primaryAction: { table: { disable: true } },
    secondaryAction: { table: { disable: true } },
    textAction: { table: { disable: true } },
    footer: { table: { disable: true } },
    headerLeft: { table: { disable: true } },
    headerExtra: { table: { disable: true } },
    onClose: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

/* ─── Slot content registry ──────────────────────────────────────────────── */

const stack = (gap = 'var(--space-12)'): React.CSSProperties => ({
  display: 'flex', flexDirection: 'column', gap,
});

function renderContent(kind: ContentKind): React.ReactNode {
  switch (kind) {
    case 'placeholder':
      return undefined; // → Modal renders its dashed `.Slot` placeholder
    case 'text':
      return (
        <p style={{
          margin: 0,
          fontSize: 'var(--typography-desktop-text-l-regular-size)',
          lineHeight: 'var(--typography-desktop-text-l-regular-line-height)',
          color: 'var(--color-text-secondary)',
        }}>
          You're about to publish these changes to production.
          This action can be reverted from the version history.
        </p>
      );
    case 'list':
      return (
        <ul style={{ ...stack('var(--space-8)'), listStyle: 'none', padding: 0, margin: 0 }}>
          {['Personal', 'Acme Corp', 'Side Project', 'Client Work'].map((w) => (
            <li key={w} style={{
              padding: 'var(--space-12) var(--space-16)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--border-radius-m)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--typography-desktop-text-m-regular-size)',
            }}>{w}</li>
          ))}
        </ul>
      );
    case 'form':
      return (
        <form style={stack('var(--space-12)')} onSubmit={(e) => e.preventDefault()}>
          <Input label="Display name" placeholder="Jasmine Hoang" />
          <Select label="Role" defaultValue="">
            <option value="" disabled>Select…</option>
            <option value="designer">Designer</option>
            <option value="engineer">Engineer</option>
            <option value="pm">Product Manager</option>
          </Select>
          <Textarea rows={3} placeholder="Short bio…" />
        </form>
      );
  }
}

/* ─── Shared render — modal rendered inline inside a tokenized stage ─────── */

const renderModal: Story['render'] = (args) => {
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  const [, updateArgs] = useArgs<StoryArgs>();
  const close = () => updateArgs({ open: false });
  const { content = 'placeholder', ...modalArgs } = args;

  return (
    <div className={STAGE_CLASS}>
      <Modal
        {...modalArgs}
        onClose={close}
        slot={renderContent(content)}
        primaryAction={
          modalArgs.primaryAction ?? { label: 'Button', onClick: close }
        }
        secondaryAction={
          modalArgs.secondaryAction ?? { label: 'Button', onClick: close }
        }
        textAction={
          modalArgs.textAction ?? { label: 'Button', onClick: close }
        }
      />
    </div>
  );
};

const baseArgs: Partial<StoryArgs> = {
  open: true,
  title: 'Heading',
  device: 'Desktop',
  variant: 'default',
  hideCloseButton: false,
  hideActions: false,
};

/* ═══════════════════════════════════════════════════════════════════
   STORIES — each renders the modal inline, stage hugs its height
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Fully interactive — every field maps to a Control. `device` switches
 * Desktop/Mobile, `content` swaps what's rendered in the slot, and
 * `open`/`title`/`subtitle`/`hideCloseButton`/`hideActions` all drive the
 * modal live. (A separate trailing "Playground" story used to duplicate this
 * exact setup; it's been folded in here so there's one interactive entry.)
 */
export const Default: Story = {
  args: { ...baseArgs, subtitle: '', content: 'placeholder' },
  render: renderModal,
};

/** `device="Mobile"` — width 370, Heading/S, actions stacked (Primary on top). */
export const Mobile: Story = {
  name: '2 · Mobile',
  args: { ...baseArgs, device: 'Mobile', content: 'placeholder' },
  render: renderModal,
};

/** Prose inside the slot. */
export const SlotText: Story = {
  name: '3 · Slot · Text',
  args: { ...baseArgs, title: 'Confirm your changes', content: 'text' },
  render: renderModal,
};

/** A list inside the slot. */
export const SlotList: Story = {
  name: '4 · Slot · List',
  args: { ...baseArgs, title: 'Choose a workspace', content: 'list' },
  render: renderModal,
};

/** Form fields (Input / Select / Textarea) inside the slot. */
export const SlotForm: Story = {
  name: '5 · Slot · Form',
  args: { ...baseArgs, title: 'Edit profile', content: 'form' },
  render: renderModal,
};

/** Only `primaryAction` — `secondaryAction` and `textAction` omitted. */
export const SingleAction: Story = {
  name: '6 · Single Action',
  args: {
    ...baseArgs,
    title: 'All done',
    content: 'text',
  },
  render: (args) => {
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const [, updateArgs] = useArgs<StoryArgs>();
    const close = () => updateArgs({ open: false });
    const { content = 'text', ...modalArgs } = args;
    return (
      <div className={STAGE_CLASS}>
        <Modal
          {...modalArgs}
          onClose={close}
          slot={renderContent(content)}
          primaryAction={{ label: 'Got it', onClick: close }}
          secondaryAction={undefined}
          textAction={undefined}
        />
      </div>
    );
  },
};
