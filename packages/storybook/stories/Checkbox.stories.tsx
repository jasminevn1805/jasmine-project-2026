import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, CheckboxProps } from '../../design-system/src/components/Checkbox';

/* ─────────────────────────────────────────────────────────────────────────── */

const meta: Meta<CheckboxProps> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: {
      control: 'text',
      description: '`true` for red border only; a string also shows an error message',
    },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    indeterminate: {
      control: 'boolean',
      description: 'Shows a dash (–). Used for "select all" when only some children are checked.',
    },
    wrapperClassName: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<CheckboxProps>;

/* ─── Layout helpers ─────────────────────────────────────────────────────── */
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
const InteractiveCheckbox: React.FC<CheckboxProps> = ({ checked: initialChecked, ...rest }) => {
  const [checked, setChecked] = useState(initialChecked ?? false);
  return <Checkbox {...rest} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
};

/**
 * Fully interactive — every field maps to a Control, and the rendered
 * checkbox itself responds to clicks. (Previously the first story you'd land
 * on was a static grid, and even the old "Default" story ignored clicks: its
 * render always fell back to the fixed `args.checked` value - since that
 * value was explicitly `false`, not `undefined`, it never once read from
 * click-driven state, so the checkbox looked permanently stuck.)
 */
export const Default: Story = {
  args: {
    label: 'Checkbox option',
    checked: false,
    indeterminate: false,
    disabled: false,
    error: undefined,
  },
  render: (args) => <InteractiveCheckbox key={String(args.checked)} {...args} name="default" />,
};

/* ═══════════════════════════════════════════════════════════════════════════
   ALL SEVEN FIGMA STATES
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * All seven states from the Figma spec displayed side-by-side:
 * Default · Focus (keyboard) · Selected · Indeterminate ·
 * Selected+Disabled · Error · Disabled
 */
export const AllStates: Story = {
  name: '2 · All States',
  render: () => (
    <div style={row}>
      <Checkbox name="s1" label="Default"             onChange={() => {}} />
      <Checkbox name="s2" label="Selected"            checked onChange={() => {}} />
      <Checkbox name="s3" label="Indeterminate"       checked indeterminate onChange={() => {}} />
      <Checkbox name="s4" label="Disabled"            disabled onChange={() => {}} />
      <Checkbox name="s5" label="Selected + Disabled" checked disabled onChange={() => {}} />
      <Checkbox name="s6" label="Error"               error onChange={() => {}} />
    </div>
  ),
};

/** Checked / selected — blue filled box with white checkmark. */
export const Selected: Story = {
  name: '3 · Selected',
  args: { label: 'Option A', checked: true },
  render: (args) => <Checkbox {...args} name="story-selected" onChange={() => {}} />,
};

/**
 * Indeterminate — blue filled box with white dash.
 * Typically used on a "Select all" parent when only some children are checked.
 */
export const Indeterminate: Story = {
  name: '4 · Indeterminate',
  args: { label: 'Select all', checked: true, indeterminate: true },
  render: (args) => <Checkbox {...args} name="story-indet" onChange={() => {}} />,
};

/** Disabled unchecked — grey bg, muted border, label dimmed. */
export const Disabled: Story = {
  name: '5 · Disabled',
  args: { label: 'Unavailable option', disabled: true },
  render: (args) => <Checkbox {...args} name="story-disabled" onChange={() => {}} />,
};

/** Checked + disabled — grey filled box with grey checkmark. */
export const SelectedDisabled: Story = {
  name: '6 · Selected + Disabled',
  args: { label: 'Locked selection', checked: true, disabled: true },
  render: (args) => <Checkbox {...args} name="story-sel-dis" onChange={() => {}} />,
};

/** Error state — 2px red border + optional error message. */
export const Error: Story = {
  name: '7 · Error',
  args: { label: 'I accept the terms', error: 'You must accept the terms to continue.' },
  render: (args) => <Checkbox {...args} name="story-error" onChange={() => {}} />,
};

/** Error — indicator only, no message string. */
export const ErrorIndicatorOnly: Story = {
  name: '8 · Error (indicator only)',
  args: { label: 'Option A', error: true },
  render: (args) => <Checkbox {...args} name="story-error-only" onChange={() => {}} />,
};

/**
 * Live checkbox group with a "Select all" that uses the indeterminate state.
 * - None checked → "Select all" is unchecked
 * - Some checked → "Select all" is indeterminate
 * - All checked  → "Select all" is checked
 */
export const CheckboxGroup: Story = {
  name: '9 · Checkbox Group',
  render: () => {
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const items = ['React', 'TypeScript', 'CSS Modules', 'Storybook'];
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const [checked, setChecked] = useState<string[]>(['React', 'TypeScript']);

    const allChecked = checked.length === items.length;
    const someChecked = checked.length > 0 && !allChecked;

    const toggleAll = () =>
      setChecked(allChecked ? [] : [...items]);

    const toggle = (item: string) =>
      setChecked((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
      );

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
          Favourite tools
        </legend>
        <div style={col}>
          {/* Select all */}
          <Checkbox
            name="select-all"
            label="Select all"
            checked={allChecked || someChecked}
            indeterminate={someChecked}
            onChange={toggleAll}
          />
          {/* Divider */}
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', margin: 0 }} />
          {/* Individual items */}
          {items.map((item) => (
            <Checkbox
              key={item}
              name={`item-${item}`}
              label={item}
              checked={checked.includes(item)}
              onChange={() => toggle(item)}
            />
          ))}
        </div>
      </fieldset>
    );
  },
};

/**
 * Checkbox group with form validation — shows error state until at least one item is selected.
 */
export const CheckboxGroupError: Story = {
  name: '10 · Checkbox Group · Error',
  render: () => {
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    const [checked, setChecked] = useState<string[]>([]);
    const options = ['Email', 'SMS', 'Push notifications'];

    const toggle = (item: string) =>
      setChecked((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
      );

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
          Notification preferences
        </legend>
        <div style={col}>
          {options.map((opt) => (
            <Checkbox
              key={opt}
              name={`notif-${opt}`}
              label={opt}
              checked={checked.includes(opt)}
              error={checked.length === 0}
              onChange={() => toggle(opt)}
            />
          ))}
        </div>
        {checked.length === 0 && (
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
            Please select at least one option.
          </p>
        )}
      </fieldset>
    );
  },
};
