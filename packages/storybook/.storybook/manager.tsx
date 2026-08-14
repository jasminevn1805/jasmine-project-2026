// Must be a real runtime import, NOT `import type`: Storybook builds the
// manager bundle with the *classic* JSX transform, so `React` has to be in
// scope for the JSX below. A type-only import compiles fine but throws
// "React is not defined" in the browser, and the toolbar button silently
// never renders. (Bit us once already - see git history if this file gets
// touched again.)
import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { IconButton as RawIconButton, Icons } from '@storybook/components';

/**
 * Pins the addon panel to the bottom of the page (Controls/Actions/
 * Interactions below the canvas) as this project's default, rather than
 * leaving it to whatever a given browser's persisted `storybook-layout`
 * happens to hold - the "Change addon orientation [D]" toggle can still
 * flip it to the side per-session, but every fresh session starts bottom.
 */
addons.setConfig({
  panelPosition: 'bottom',
});

/**
 * Storybook 7.6's `IconButton` is typed against a React 17-era prop set, so
 * under this repo's @types/react 18 it demands `placeholder` /
 * `onPointerEnterCapture` / `onPointerLeaveCapture`. Narrowing to the props
 * actually used here keeps the call site honest without fighting that mismatch.
 */
const IconButton = RawIconButton as unknown as React.FC<{
  title?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}>;

/**
 * One-click fix for a real, reproduced issue: Storybook persists the addon
 * panel's size/position in `localStorage` (key `storybook-layout`) so your
 * layout survives page reloads - by design, not a bug. But it means a panel
 * that gets resized down to near-zero (a stray drag, a keyboard mis-click)
 * *stays* collapsed forever, even across a hard refresh, because a reload
 * never touches localStorage. Confirmed nothing in this project's own code
 * (manager.tsx / preview.tsx / docs-mode.css / any story file) reads or
 * writes that key - this is purely Storybook's own persisted UI state
 * getting stuck, not an application bug.
 *
 * This button removes only `storybook-layout` (the resizer position data),
 * not all of localStorage - so it doesn't also reset unrelated things like
 * the sidebar's last-viewed story. Confirmed removing this key and reloading
 * restores the panel to its default size.
 */
const RESET_ID = 'jasmine-ds/reset-layout';

function ResetLayoutButton() {
  return (
    <IconButton
      key={RESET_ID}
      title="Reset panel layout (fixes a collapsed/stuck addon panel)"
      onClick={() => {
        window.localStorage.removeItem('storybook-layout');
        window.location.reload();
      }}
    >
      <Icons icon="refresh" />
    </IconButton>
  );
}

addons.register(RESET_ID, () => {
  addons.add(RESET_ID, {
    title: 'Reset panel layout',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <ResetLayoutButton />,
  });
});
