import type { ProjectData } from './types';

export const designSystem: ProjectData = {
  slug: 'design-system',
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
    'A production-grade design system built as a reusable product foundation, not a one-off UI kit. One Figma variable model drives typed tokens, styles, and React components through an automated pipeline, eliminating design-code drift. The shared core now powers multiple products through theme overrides, so brand differences scale without forking the system.',

  sections: [
    {
      type: 'text',
      
      heading: 'The purpose',
      content: [
        'Every new project started from scratch. New color decisions, new spacing rules, new component files — built in isolation, inconsistent with everything before it. The more projects that existed, the harder it became to keep anything aligned.',
        "That's a manageable problem for one project. It becomes an unscalable one fast. Maintaining visual consistency manually across a growing portfolio isn't a discipline problem — it's a systems problem.",
        "The purpose of this design system was to solve it permanently: one shared foundation that all projects inherit from, so consistency is the default and not something that needs to be re-established every time something new is built.",
      ],
    },
    { type: 'image', image: '' },
    {
      type: 'text-image',
      heading: 'Process at a glance',
      content: [
        '1 — Design Thinking: what should this system be, and what does good look like?',
        '2 — Repository architecture: how should the codebase be structured so it scales across projects without duplicating work?',
        '3 — Tech stack: what are the right modern tools to write typed, token-driven components that stay maintainable?',
        '4 — Execution: how do I transfer Figma design components into fully realized, production-ready React?',
        'Each phase is independent — but skipping any one of them shows up in the output.',
      ],
      image: '',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'Research & findings',
      content: [
        'The goal: build a scalable product foundation that keeps UX consistent, speeds up development, and stays maintainable as the project grows — one that reduces design/development chaos and supports fast iteration without UI degradation.',
        'To find the right approach, I audited 5 of the most widely-used design systems. Shopify Polaris and Google Material 3 landed closest to what I was looking for. Both treat the design system as a product with real consumers — developers, designers, product teams — and both are exceptionally well-organized libraries.',
        'On structure: components are grouped predictably, each living alongside its styles and documentation. Naming is consistent enough that you know where to look before you look. The system is built for the people using it, not just the person who built it.',
        'On components: every component covers only what it needs to — the necessary states (default, hover, focus, disabled), clear variant logic, and prop names that describe intent rather than implementation. Nothing more, nothing less.',
      ],
      image: '',
      layout: 'left',
    },
    {
      type: 'text',
      heading: 'Define: what I committed to',
      content: [
        'One source of truth. Whether the design system is viewed in Figma or consumed in code, both versions trace back to the same origin.',
        'Two token layers: primitives and semantics. Primitives hold raw values, Semantics name intent, and map to primitives per Theme. Keeping them separate is what makes theming possible: swapping a theme means reassigning semantic roles, not rewriting components.',
        'Atomic Design as the composition rule. Atoms are the smallest units. Molecules combine atoms into patterns. Organisms compose molecules into full UI sections. The rule makes it clear where a new component belongs and how it should be built — from existing pieces, not from scratch.',
        'These three commitments are each a direct answer to a failure mode: token drift, hard-coded values, and ad-hoc component sprawl.',
      ],
    },
    {
      type: 'text-image',
      heading: 'Repository architecture',
      content: [
        'A monorepo was the right structure for this scale. When the design system and the apps that consume it live in the same repository, they evolve together. A change to a token is immediately live in every project on the next dev server reload.',
        'packages/design-system is the single source: tokens, styles, and components published as one workspace package.',
        "projects/* are the real consumers. Each a full Next.js app that pulls from the design system without knowing how it's built.",
        "packages/storybook is the living documentation: an isolated environment where every component is rendered, tested across variants and states, and visible to anyone on the team without running an app.",
        "The three-part split keeps concerns clean: the system owns what it exports, the apps own what they build, and Storybook owns the contract between them.",
      ],
      image: '/case-study/design-system/ds-repo-tree.png',
      layout: 'right',
    },
    {
      type: 'text',
      heading: 'Tech stack: chosen to match the problem',
      content: [
        "The stack is deliberately standard. For a design system that's meant to be consumed, maintained, and extended over time, \"modern and proven\" is the right criteria.",
        'React + TypeScript: the most widely-used component model in the industry, with TypeScript making the component API self-documenting. Consumers know exactly what props a component accepts without reading source code.',
        'Vite: fast builds, library mode output, minimal config. The right tool for packaging a component library that gets imported by other projects.',
        'CSS Modules + CSS custom properties: styles scoped to components by default, all values referencing semantic tokens as CSS variables. Consistent, maintainable, no runtime overhead.',
        'Storybook: the industry standard for component development and documentation in isolation. Jest + Testing Library: the standard for React component testing, focused on behavior over implementation.',
        'Choosing a standard, well-understood stack matters for a design system specifically — other developers need to be able to contribute to and consume it without a learning curve.',
      ],
    },
    {
      type: 'text-image',
      heading: 'Token system: global foundation + per-project themes',
      content: [
        'The token system has two layers in the global foundation: Primitives and Semantics.',
        'Primitives hold raw values — every color, spacing step, type size, and radius in the system. They carry no meaning on their own.',
        'Global Semantics give meaning. They name intent — text, background, icon, border, surface, overlay — and reference primitives. This is the layer every component consumes. A component never reaches for a primitive directly.',
        'On top of the global foundation sits a theme layer. Each project gets its own theme — Theme A for Cookstash, Theme B for the portfolio site — stored centrally in src/themes/ inside the design system package. A theme selectively overrides semantic tokens for that brand. The global layer sets safe defaults so everything works without a theme; the theme then reassigns exactly what needs to differ.',
        'Projects consume both: the global foundation always, their specific theme on top. The flow is: Primitives → Global Semantics → Theme overrides → Components. Projects on the same brand share consistency at the foundation level; each gets its own identity at the theme level. One change to a theme file propagates to every component in that project instantly.',
        "This two-layer model also changed how design decisions were made in Figma. With semantic names, every color choice starts with a role — what does this mean in context? — not a value. That shift is small in syntax but significant in practice: it means design and code are speaking the same language before a component is built.",
      ],
      image: '/case-study/design-system/ds-token-flow.png',
      layout: 'left',
    },
    {
      type: 'text-image',
      heading: 'Component architecture: atoms compose into organisms',
      content: [
        'Components are designed on one rule: own one thing, completely. Compose upward from there.',
        'Atoms (Button, Input, Checkbox, Icon) are intentionally minimal — only the states that cover real use, only the variants that earn their existence. No decoration. Molecules combine atoms without modifying them. Organisms arrange molecules without owning their behavior.',
        'That strict layering is what makes the system flexible and scalable. You can change an atom and trust the effect is contained. You can build a new pattern by composing what already exists. Nothing requires a rewrite below it.',
        "The same discipline applied in Figma: every state was designed explicitly as a variant before the component was built in code. And before any new component was proposed, the first question was always — can this be composed from what already exists? That rule keeps the system lean. A design system that quietly grows new components for every edge case becomes the same inconsistency it was built to prevent.",
      ],
      image: '/case-study/design-system/ds-components-checkbox.png',
      layout: 'right',
    },
    {
      type: 'text',
      heading: 'Execution: how a component gets built',
      content: [
        'Every component follows the same four-step loop — no shortcuts, no skipped steps.',
        'Step 1 — Token sync: a script reads the Figma Variables export (JSON) and generates the primitive and semantic token files. This is the only automated step. It means design decisions made in Figma become typed CSS custom properties in code without manual transcription.',
        "Step 2 — Component authoring: the React component is written by hand. Styles are applied by mapping directly to semantic tokens and CSS variables — never hardcoded values. This step is intentionally manual because behavior, accessibility, and API design can't be inferred from a design frame.",
        "Step 3 — Storybook story: every component gets a story that renders its variants and states in isolation. This is the living documentation — anyone can see what the component does and how it behaves without running an app.",
        "Step 4 — Tests: behavior and accessibility are verified with Jest and Testing Library. A component isn't done until it passes. The tests are the contract between what the component promises and what it delivers.",
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
    {
      type: 'text-image',
      heading: 'The system, in production',
      content: [
        "The best proof a design system works isn't the system itself — it's what gets built with it. This portfolio site is the first real consumer.",
        'The site imports @jasmine/design-system as a workspace package. Global tokens load once. The portfolio theme — its own file in src/themes/ — overrides only what differs from the defaults. Every component on this page: Button, typography, spacing, color — pulled from the system, not written inline.',
        "The folder structure is flat and predictable. Adding a new page doesn't require touching the design system. Updating the portfolio's brand means editing one theme file. Nothing else changes.",
        "That's the point. The setup was upfront work — the payoff is a codebase that's easy to navigate, consistent without effort, and ready to extend.",
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
        'A component file importing from @jasmine/design-system — one line, typed, no local copy.',
        'theme-portfolio.css — a short file of semantic overrides. Change the brand by editing one value here.',
        'A component CSS module referencing only var(--color-*) and var(--space-*). Zero hardcoded values.',
        'The portfolio folder tree — no /styles chaos, no duplicated components. The system handles the baseline.',
      ],
    },
    {
      type: 'stats',
      heading: 'Outcomes',
      stats: [
        { value: '9', label: 'Components', note: 'Button, Input, Select, Checkbox, Radio, Textarea, Modal, Accordion, ScrollTabBar' },
        { value: '720', label: 'CSS custom properties', note: 'Generated from 9 Figma variable collections — not hand-written' },
        { value: '~20–30', label: 'Lines per theme file', note: 'Only semantic overrides that differ from defaults. One file, full brand control.' },
        { value: '2', label: 'Live projects consuming it', note: 'Cookstash app + this portfolio site' },
        { value: '1/3–1/2', label: 'Less build time per project', note: 'Prototyping with real interactive components replaces static mocks from day one' },
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
