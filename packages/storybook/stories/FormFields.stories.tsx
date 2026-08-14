import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../design-system/src/components/Input';
import { Select } from '../../design-system/src/components/Select';
import { Textarea } from '../../design-system/src/components/Textarea';

/* ─────────────────────────────────────────────────────────────────────────────
   This story composes three separate components (Input, Select, Textarea) -
   each already has its own single-component story with working controls (see
   Input.stories.tsx etc.). This file's job is to show them working together
   in a real form layout, so there's no single real component to point
   `meta.component` at - `state` is a flat, story-only field that drives all
   three at once. Previously every story here was a static `render: () => (...)`
   that never read args at all; the Controls panel (inherited from
   `component: Input`, left over from before this was a multi-component story)
   looked functional but changed nothing no matter what you set.
   ───────────────────────────────────────────────────────────────────────── */

type FieldState = 'Default' | 'Error' | 'Disabled';

interface FormFieldsStoryProps {
  state: FieldState;
}

function errorFor(state: FieldState, message: string): string | undefined {
  return state === 'Error' ? message : undefined;
}

const meta: Meta<FormFieldsStoryProps> = {
  title: 'Components/Form Fields',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['Default', 'Error', 'Disabled'],
      description: 'Applies this state to every field below at once',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '360px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<FormFieldsStoryProps>;

/* ═══════════════════════════════════════════════════════════════════════════
   INTERACTIVE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Fully interactive — the `state` control applies Default/Error/Disabled to
 * every field in this form at once, so you can see Input, Select, and
 * Textarea stay visually consistent together, not just in isolation.
 */
export const Default: Story = {
  args: { state: 'Default' },
  render: (args) => {
    const disabled = args.state === 'Disabled';
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
        <Input
          label="Full name"
          placeholder="Jane Doe"
          disabled={disabled}
          error={errorFor(args.state, 'Full name is required.')}
        />
        <Input
          label="Email"
          placeholder="jane@example.com"
          type="email"
          disabled={disabled}
          error={errorFor(args.state, 'Enter a valid email address.')}
        />
        <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
          <div style={{ flex: 1 }}>
            <Select label="Country" disabled={disabled} error={errorFor(args.state, 'Please select a country.')}>
              <option value="">Select…</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="uk">United Kingdom</option>
            </Select>
          </div>
          <div style={{ flex: 1 }}>
            <Input
              label="Zip code"
              placeholder="90210"
              disabled={disabled}
              error={errorFor(args.state, 'Required.')}
            />
          </div>
        </div>
        <Textarea
          label="Bio"
          placeholder="Tell us about yourself…"
          disabled={disabled}
          error={errorFor(args.state, 'Bio is required.')}
        />
      </div>
    );
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC REFERENCE SHEET
   ═══════════════════════════════════════════════════════════════════════════ */

/** Input and Select share the same 40px field height when placed side by side. */
export const UnifiedHeight: Story = {
  name: '2 · Unified Height',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-12)', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <Input label="Name" placeholder="Jane Doe" />
        </div>
        <div style={{ flex: 1 }}>
          <Select label="Country">
            <option value="">Select…</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
          </Select>
        </div>
      </div>
      <p
        style={{
          fontSize: 'var(--typography-desktop-text-s-regular-size)',
          color: 'var(--color-text-tertiary)',
          margin: 0,
        }}
      >
        ↑ Input and Select share the same 40px field height
      </p>
    </div>
  ),
};
