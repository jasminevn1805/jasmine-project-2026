import type { ProjectData } from './types';

export const designSystemDraft: ProjectData = {
  slug: 'design-system-draft',
  title: 'Design System as Product: from Figma variables to production React.',
  services: [
    'Design System Strategy',
    'Token Architecture & Automation',
    'React 19 + TypeScript',
    'Component API Design',
    'Storybook Documentation',
  ],
  platforms: ['Web App', 'Storybook', 'Figma'],
  industry: 'Design Systems Tooling',
  description:
    'A production-grade design system built as a reusable product foundation, not a one-off UI kit. One Figma variable model drives typed tokens, styles, and React components through an automated pipeline, eliminating design-code drift. The shared core now supports two products at different adoption depths — full theme-and-component consumption, and primitive-layer-only reuse — without forking the system.',

  sections: [
    {
      type: 'text',
      layout: 'split',
      heading: 'The purpose',
      content: [
        'Every new project started from scratch. New color decisions, new spacing rules, new component files — built in isolation, inconsistent with everything before it. The more projects that existed, the harder it became to keep anything aligned.',
        "That's a manageable problem for one project. It becomes an unscalable one fast. Maintaining visual consistency manually across a growing portfolio isn't a discipline problem — it's a systems problem.",
        "The purpose of this design system was to solve it permanently: one shared foundation that all projects inherit from, so consistency is the default and not something that needs to be re-established every time something new is built.",
      ],
    },
    {
      type: 'text',
      layout: 'split',
      heading: 'Process at a glance',
      content: [
        '1 — Design Thinking: audit prior art, decide what good looks like, commit to rules that each answer a specific failure mode.',
        '2 — Repository architecture: structure the codebase so the system and its consumers evolve together, not in silos.',
        '3 — Tech stack: choose tools proven enough that others can contribute and consume without a learning curve.',
        '4 — System design: build the token layers and component rules that make consistency the default, not a discipline.',
        '5 — Execution: turn Figma into typed tokens and hand-authored, tested React components — repeatably.',
        'Each phase is independent — but skipping any one of them shows up in the output.',
      ],
    },

    { type: 'section-group', heading: 'Design Thinking' },
    {
      type: 'list-image',
      heading: 'Research & findings',
      items: [
        {
          summary: 'The goal: a system that scales, not just looks consistent.',
          body: 'Keep UX consistent, speed up development, and stay maintainable as the project grows — reduce design/development chaos and support fast iteration without UI degradation.',
        },
        {
          summary: 'Audited 5 widely-used design systems.',
          body: 'Shopify Polaris and Google Material 3 landed closest to what I was looking for — both treat the design system as a product with real consumers (developers, designers, product teams), and both are exceptionally well-organized libraries.',
        },
        {
          summary: 'On structure: predictable, not clever.',
          body: 'Components are grouped predictably, each living alongside its styles and documentation. Naming is consistent enough that you know where to look before you look. The system is built for the people using it, not just the person who built it.',
        },
        {
          summary: 'On components: cover only what earns its place.',
          body: 'Every component covers only what it needs to — the necessary states (default, hover, focus, disabled), clear variant logic, and prop names that describe intent rather than implementation. Nothing more, nothing less.',
        },
      ],
      image: '',
      layout: 'right',
    },
    {
      type: 'list',
      heading: 'Define: what I committed to',
      items: [
        {
          summary: 'One source of truth.',
          body: 'Whether the design system is viewed in Figma or consumed in code, both versions trace back to the same origin.',
        },
        {
          summary: 'Two token layers: primitives and semantics.',
          body: 'Primitives hold raw values. Semantics name intent and map to primitives per theme. Keeping them separate is what makes theming possible — swapping a theme means reassigning semantic roles, not rewriting components.',
        },
        {
          summary: 'Atomic Design as the composition rule.',
          body: 'Atoms are the smallest units. Molecules combine atoms into patterns. Organisms compose molecules into full UI sections. The rule makes it clear where a new component belongs and how it should be built — from existing pieces, not from scratch.',
        },
        {
          summary: 'Each commitment answers a specific failure mode.',
          body: 'One source of truth prevents token drift. Two token layers prevent hard-coded values. Atomic Design prevents ad-hoc component sprawl. None of the three is decorative — each exists because of a failure the previous approach kept producing.',
        },
      ],
    },

    { type: 'section-group', heading: 'Repository Architecture' },
    {
      type: 'list-image',
      heading: 'Decision: one monorepo, three roles',
      items: [
        {
          summary: 'Why a monorepo.',
          body: 'The design system and the apps that consume it live in the same repository, so they evolve together — a change to a token is immediately live in every project on the next dev server reload.',
        },
        {
          summary: 'packages/design-system — the single source.',
          body: 'Tokens, styles, and components, published as one workspace package.',
        },
        {
          summary: 'projects/* — the real consumers.',
          body: "Each a full Next.js app that pulls from the design system without knowing how it's built.",
        },
        {
          summary: 'packages/storybook — the living documentation.',
          body: 'An isolated environment where every component is rendered, tested across variants and states, and visible to anyone on the team without running an app.',
        },
        {
          summary: 'The three-part split keeps concerns clean.',
          body: 'The system owns what it exports, the apps own what they build, and Storybook owns the contract between them.',
        },
      ],
      image: '/case-study/design-system/ds-repo-tree.png',
      layout: 'right',
    },

    { type: 'section-group', heading: 'Tech Stack' },
    {
      type: 'list',
      heading: 'Decision: deliberately standard, not novel',
      items: [
        {
          summary: 'React + TypeScript.',
          body: 'The most widely-used component model in the industry, with TypeScript making the component API self-documenting — consumers know exactly what props a component accepts without reading source code.',
        },
        {
          summary: 'Vite.',
          body: 'Fast builds, library mode output, minimal config — the right tool for packaging a component library that gets imported by other projects.',
        },
        {
          summary: 'CSS Modules + CSS custom properties.',
          body: 'Styles scoped to components by default, every value referencing a semantic token as a CSS variable. Consistent, maintainable, no runtime overhead.',
        },
        {
          summary: 'Storybook, Jest + Testing Library.',
          body: 'Storybook is the industry standard for component development and documentation in isolation. Jest + Testing Library is the standard for React component testing, focused on behavior over implementation.',
        },
        {
          summary: 'Why standard, not novel.',
          body: "For a design system that's meant to be consumed, maintained, and extended over time, \"modern and proven\" is the right criteria — other developers need to be able to contribute to and consume it without a learning curve.",
        },
      ],
    },

    { type: 'section-group', heading: 'System Design' },
    {
      type: 'list-image',
      heading: 'Decision: two token layers, one override point',
      items: [
        {
          summary: 'Primitives — raw values, no meaning.',
          body: 'Every color, spacing step, type size, and radius in the system, carrying no meaning on their own.',
        },
        {
          summary: 'Semantics — meaning, and the default theme.',
          body: 'Name intent (text, background, icon, border, surface, overlay) and reference primitives. This is the only layer a component ever consumes — and it doubles as the default theme, shipped as CSS variables, so any project works with zero configuration.',
        },
        {
          summary: 'Override via the CSS cascade, not new components.',
          body: "A project wanting its own brand overrides those same variable names, scoped with a data-theme attribute — cookstash's theme.css reassigns ~30 variables to its own primitives. Components never know which theme set the value.",
        },
        {
          summary: 'Adoption depth is a choice, by design.',
          body: 'A project can take the full stack (theme + components) or just the primitive layer and build its own component/semantic layer on top. Both are legitimate — it depends on how much control a consumer needs.',
        },
      ],
      image: '/case-study/design-system/ds-token-flow.png',
      layout: 'left',
    },
    {
      type: 'stats',
      heading: 'The token system, at a glance',
      stats: [
        { value: '720', label: 'CSS custom properties', note: 'Generated from primitives + semantics — never hand-written' },
        { value: '2', label: 'Token layers', note: 'Primitives (raw values) and Semantics (meaning) — components only ever touch the second' },
        { value: '1', label: 'Override point', note: 'A project theme reassigns semantic variable names via the CSS cascade — nothing downstream changes' },
      ],
    },
    {
      type: 'list-image',
      heading: 'Decision: compose upward, never patch downward',
      items: [
        {
          summary: 'One rule: own one thing, completely.',
          body: 'Compose upward from there — atoms into molecules, molecules into organisms — never reach into a layer below to patch something.',
        },
        {
          summary: 'The gate: can this be composed from what already exists?',
          body: 'Asked before every new component. Keeps the system lean — a system that grows a new component for every edge case becomes the same inconsistency it was built to prevent.',
        },
        {
          summary: 'Same discipline in Figma.',
          body: 'Every state was designed explicitly as a variant before the component was built in code — never a gap between what a component could show and what it was asked to render.',
        },
      ],
      image: '/case-study/design-system/ds-components-checkbox.png',
      layout: 'right',
    },

    { type: 'section-group', heading: 'Execution' },
    {
      type: 'list',
      heading: 'How a component gets built — the same four-step loop, every time',
      items: [
        {
          summary: 'Step 1 — Token sync.',
          body: 'A script reads the Figma Variables export (JSON) and generates the primitive and semantic token files. This is the only automated step. It means design decisions made in Figma become typed CSS custom properties in code without manual transcription.',
        },
        {
          summary: 'Step 2 — Component authoring.',
          body: "The React component is written by hand. Styles are applied by mapping directly to semantic tokens and CSS variables — never hardcoded values. This step is intentionally manual because behavior, accessibility, and API design can't be inferred from a design frame.",
        },
        {
          summary: 'Step 3 — Storybook story.',
          body: 'Every component gets a story that renders its variants and states in isolation. This is the living documentation — anyone can see what the component does and how it behaves without running an app.',
        },
        {
          summary: 'Step 4 — Tests.',
          body: "Behavior and accessibility are verified with Jest and Testing Library. A component isn't done until it passes. The tests are the contract between what the component promises and what it delivers.",
        },
      ],
    },
    {
      type: 'image-grid',
      images: [
        '/case-study/design-system/ds-code-tokens-css.png',
        '/case-study/design-system/ds-code-component.png',
        '/case-study/design-system/ds-components-accordion.png',
        '/case-study/design-system/ds-code-test.png',
      ],
      captions: [
        'Step 1 — Figma Variables exported as JSON, parsed into typed primitive and semantic token files.',
        'Step 2 — React component styled entirely via CSS custom properties mapped to semantic tokens. No hardcoded values.',
        'Step 3 — Storybook story rendering all variants and states in isolation, ready for design review.',
        'Step 4 — Jest + Testing Library verifying behavior and accessibility. Green = done.',
      ],
    },

    { type: 'section-group', heading: 'In Production' },
    {
      type: 'list-image',
      heading: 'In production: two ways to adopt it',
      items: [
        {
          summary: "The best proof isn't the system — it's what gets built with it.",
          body: "And not every consumer needs the same amount of it. The system supports two adoption models, and which one a project reaches for depends on how much control it wants over its own presentation layer — not how 'serious' the adoption is.",
        },
        {
          summary: 'Full-stack adoption — theme and components, together.',
          body: 'The default theme loads first. A project can override it with its own theme file, reassigning brand variables via the CSS cascade (scoped with a data-theme attribute). React components are imported directly from the package — no local copies, no reimplementation.',
        },
        {
          summary: 'Theme adoption — tokens only, components stay local.',
          body: "A project imports only the primitive and semantic token layer as CSS variables, then builds its own components on top, in its own framework. It inherits visual consistency without inheriting the component API.",
        },
        {
          summary: 'The real test: does it hold up when consumers need different things?',
          body: "A system that only works at 100% adoption isn't a foundation, it's a requirement. This one supports both models without forking.",
        },
      ],
      image: '/case-study/design-system/ds-adoption-portfolio.png',
      layout: 'right',
    },
    {
      type: 'image-grid',
      images: [
        '/case-study/design-system/ds-adoption-mealprep.png',
        '/case-study/design-system/ds-code-tokens-semantic.png',
        '/case-study/design-system/ds-code-component-css.png',
        '/case-study/design-system/ds-components-icons.png',
      ],
      captions: [
        'cookstash: Button imported directly from @jasmine/design-system — full component adoption, no local copy.',
        "theme.css — cookstash's override of the default theme, scoped to [data-theme=\"cookstash\"], referencing only the DS's own primitive variables.",
        "This portfolio's own Tailwind theme layer — built on primitive values re-exported from the DS, with its own semantic naming on top.",
        'The portfolio folder tree — a separate component layer by choice, still tracing its raw values back to one source.',
      ],
    },

    { type: 'section-group', heading: 'Outcomes' },
    {
      type: 'stats',
      heading: 'By the numbers',
      stats: [
        { value: '9', label: 'Components', note: 'Button, Input, Select, Checkbox, Radio, Textarea, Modal, Accordion, ScrollTabBar' },
        { value: '720', label: 'CSS custom properties', note: 'Generated from 9 Figma variable collections — not hand-written' },
        { value: '~30', label: 'Variables per theme override', note: 'Only what differs from the default theme. One file, full brand control.' },
        { value: '2', label: 'Products consuming it', note: 'Full adoption (Cookstash) + primitive-layer adoption (this portfolio site)' },
        { value: '1/3–1/2', label: 'Less build time on the full-adoption product', note: 'Prototyping with real interactive components replaces static mocks from day one' },
        { value: '0', label: 'Token drift', note: "What's in Figma is what ships. Always." },
      ],
    },
    {
      type: 'quote',
      content:
        "A design system is not a component library. It's a decision — about how a product grows, who owns consistency, and what \"done\" actually means. This one answered those questions before the first component was built.",
    },
  ],

  images: [
    '/case-study/design-system/ds-code-tokens-primitives.png',
    '/case-study/design-system/ds-storybook-overview.png',
  ],
  imageLabels: ['Tokens, typed at the source', 'Storybook — the living component library'],
  github: 'https://github.com/jasminehoang/design-system',
};
