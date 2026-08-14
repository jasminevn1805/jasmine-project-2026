import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioProps } from '../../design-system/src/components/Radio';

/* ─────────────────────────────────────────────────────────────────────────── */

const meta: Meta<RadioProps> = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text', description: '`true` for red border; a string also shows an error message' },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    wrapperClassName: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<RadioProps>;

/* ─── Stage helper ───────────────────────────────────────────────────────── */

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-24)',
  flexWrap: 'wrap',
};

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-12)',
};

/* ═══════════════════════════════════════════════════════════════════════════
   INTERACTIVE
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * A stable component (not defined inline in `render`) so React preserves its
 * identity - and therefore its local `checked` state - across re-renders
 * caused by unrelated Controls changes (e.g. toggling `disabled`). Only
 * `key`-ing on `args.checked` in the story below forces a remount, which is
 * what lets the Controls panel's "checked" field reset the preview.
 */
const InteractiveRadio: React.FC<RadioProps> = ({ checked: initialChecked, ...rest }) => {
  const [checked, setChecked] = useState(initialChecked ?? false);
  return <Radio {...rest} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
};

/**
 * Fully interactive — every field maps to a Control, and the rendered radio
 * itself responds to clicks. (Previously the first story you'd land on was a
 * static grid, and both the old "Default" story and the "Playground" ignored
 * clicks: their onChange was either a no-op or the render always fell back to
 * the fixed `args.checked` value — since that value was explicitly `false`,
 * not `undefined`, it never once read from click-driven state, so the radio
 * looked permanently stuck.)
 */
export const Default: Story = {
  args: {
    label: 'Radio option',
    checked: false,
    disabled: false,
    error: undefined,
  },
  render: (args) => <InteractiveRadio key={String(args.checked)} {...args} name="default" />,
};

/* ═══════════════════════════════════════════════════════════════════════════
   ALL SIX FIGMA STATES
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * All six states from the Figma spec side-by-side:
 * Default · Focus (keyboard) · Selected · Selected+Disabled · Negative · Disabled
 */
export const AllStates: Story = {
  name: '2 · All States',
  render: () => (
    <div style={row}>
      {/* Default */}
      <Radio name="all" value="default" label="Default" readOnly />

      {/* Selected */}
      <Radio name="all2" value="selected" label="Selected" checked readOnly onChange={() => {}} />

      {/* Disabled */}
      <Radio name="all3" value="disabled" label="Disabled" disabled readOnly />

      {/* Selected + Disabled */}
      <Radio name="all4" value="sel-dis" label="Selected & Disabled" checked disabled readOnly onChange={() => {}} />

      {/* Error / Negative */}
      <Radio name="all5" value="error" label="Error" error readOnly />
    </div>
  ),
};

/** Checked / selected — blue filled circle with white dot. */
export const Selected: Story = {
  name: '3 · Selected',
  args: { label: 'Option A', checked: true },
  render: (args) => <Radio {...args} name="story-selected" onChange={() => {}} />,
};

/** Disabled unchecked — grey background, muted border, label dimmed. */
export const Disabled: Story = {
  name: '4 · Disabled',
  args: { label: 'Unavailable option', disabled: true },
  render: (args) => <Radio {...args} name="story-disabled" onChange={() => {}} />,
};

/** Checked + disabled — grey filled circle with grey dot. */
export const SelectedDisabled: Story = {
  name: '5 · Selected + Disabled',
  args: { label: 'Locked selection', checked: true, disabled: true },
  render: (args) => <Radio {...args} name="story-sel-dis" onChange={() => {}} />,
};

/** Error state — 2px red border, optional error message below. */
export const Error: Story = {
  name: '6 · Error',
  args: { label: 'Option A', error: 'This field is required' },
  render: (args) => <Radio {...args} name="story-error" onChange={() => {}} />,
};

/** Error state — indicator only, no message. */
export const ErrorIndicatorOnly: Story = {
  name: '7 · Error (indicator only)',
  args: { label: 'Option A', error: true },
  render: (args) => <Radio {...args} name="story-error-only" onChange={() => {}} />,
};

/**
 * A live radio group — the natural use case.
 * Clicking any option updates the selection.
 */
export const RadioGroup: Story = {
  name: '8 · Radio Group',
  render: () => {
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const [value, setValue] = useState('b');

    const options = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' },
      { value: 'd', label: 'Option D — disabled', disabled: true },
    ];

    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{
          fontFamily: 'var(--typography-desktop-family-main)',
          fontSize: 'var(--typography-desktop-label-s-semi-bold-size)',
          fontWeight: 'var(--typography-desktop-label-s-semi-bold-weight)' as React.CSSProperties['fontWeight'],
          lineHeight: 'var(--typography-desktop-label-s-semi-bold-line-height)',
          letterSpacing: 'var(--typography-desktop-label-s-semi-bold-letter-spacing)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-12)',
          padding: 0,
        }}>
          Choose an option
        </legend>
        <div style={col}>
          {options.map((opt) => (
            <Radio
              key={opt.value}
              name="group-story"
              value={opt.value}
              label={opt.label}
              checked={value === opt.value}
              disabled={opt.disabled}
              onChange={(e) => setValue(e.target.value)}
            />
          ))}
        </div>
      </fieldset>
    );
  },
};

/**
 * Radio group with an error — e.g. form validation asking the user to pick one.
 */
export const RadioGroupError: Story = {
  name: '9 · Radio Group · Error',
  render: () => {
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const [value, setValue] = useState('');

    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{
          fontFamily: 'var(--typography-desktop-family-main)',
          fontSize: 'var(--typography-desktop-label-s-semi-bold-size)',
          fontWeight: 'var(--typography-desktop-label-s-semi-bold-weight)' as React.CSSProperties['fontWeight'],
          lineHeight: 'var(--typography-desktop-label-s-semi-bold-line-height)',
          letterSpacing: 'var(--typography-desktop-label-s-semi-bold-letter-spacing)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-12)',
          padding: 0,
        }}>
          Preferred contact method
        </legend>
        <div style={col}>
          {['Email', 'SMS', 'Phone call'].map((opt) => (
            <Radio
              key={opt}
              name="group-error"
              value={opt}
              label={opt}
              checked={value === opt}
              error={!value}
              onChange={(e) => setValue(e.target.value)}
            />
          ))}
        </div>
        {!value && (
          <p style={{
            marginTop: 'var(--space-8)',
            marginBottom: 0,
            fontFamily: 'var(--typography-desktop-family-main)',
            fontSize: 'var(--typography-desktop-text-s-regular-size)',
            fontWeight: 'var(--typography-desktop-text-s-regular-weight)' as React.CSSProperties['fontWeight'],
            lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
            letterSpacing: 'var(--typography-desktop-text-s-regular-letter-spacing)',
            color: 'var(--color-text-negative)',
          }}>
            Please select an option.
          </p>
        )}
      </fieldset>
    );
  },
};
