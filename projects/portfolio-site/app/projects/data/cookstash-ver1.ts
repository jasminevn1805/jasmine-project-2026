import type { ProjectData } from './types';

export const cookstashVer1: ProjectData = {
  slug: 'cookstash-ver1',
  title: 'Crafting a web app that closes the loop from recipe inspiration to meal prep',
  overviewHeadline: 'Cookstash',
  services: [
    'Product Strategy',
    'Interaction Design',
    'Next.js 16 + React 19',
    'State & Domain Architecture',
    'API & Sharing Design',
  ],
  platforms: ['Web App', 'Mobile Responsive', 'Social Recipe Import'],
  industry: 'Consumer Food & Meal Planning',
  description:
    'This MVP is scoped to one measurable outcome: convert recipe inspiration into an executable plan. Users create day, week, month, or occasion-based meal plans from a personal recipe library sourced from social links and web articles, then generate deduplicated grocery lists and share them instantly through a single URL.',

  sections: [
    {
      type: 'text',
      heading: 'The spark: a format I loved had nowhere to live',
      content: [
        "Short-form video quietly became how the world shares know-how. A 30-second clip — when it's good — can carry more than a page of text. Cooking is where that hits hardest: a great recipe video is complete in the time it takes to boil a kettle.",
        "But the value evaporates the second you scroll past. There's no single home where the recipes you love become a collection you actually cook from.",
        "That gap is the whole idea — turn a format people already love into something genuinely useful: saved clips become a library, a library becomes a plan, and dinner gets a little easier.",
      ],
    },
    {
      type: 'text-image',
      heading: 'Market research: is this worth building?',
      content: [
        'Before designing anything, I pressure-tested the idea against the market — not to copy, but to find out whether the gap I felt was real and unclaimed.',
        "I read every product the same way: what job does it own, where does it drop the user, and what does it quietly assume? Deliberately broad, not a deep teardown — going too deep on a near-identical app early just inherits its assumptions.",
        'The pattern was consistent, and it pointed to a clear opening. The concept was worth building — so I moved forward.',
      ],
      image: '/case-study/cookstash/mp-market-landscape.svg',
      layout: 'right',
    },
    {
      type: 'stats',
      heading: 'What the landscape revealed',
      stats: [
        {
          value: 'Pure Savers',
          label: 'Instagram · TikTok · Pinterest',
          note: 'Strong: discovery and collecting. Gap: drops the user immediately after the save — no path to planning or action.',
        },
        {
          value: 'Pure Planners',
          label: 'Mealime · Paprika · Yummly',
          note: "Strong: scheduling and grocery lists. Gap: assumes a hand-typed recipe library — social video is a format they can't start from.",
        },
        {
          value: 'The Whitespace',
          label: 'Nobody closes the loop',
          note: "The gap isn't accidental — it's structural. Each product is locked out of the next stage by its own model. That's the opportunity.",
        },
      ],
    },
    {
      type: 'text-image',
      heading: "Synthesis persona: who I'm designing for",
      content: [
        'With the opening confirmed, I needed a real person to design for — so I built Maya, a synthesis persona grounded in observed behavior, not a demographic checkbox.',
        "Maya, 28, works in tech. Full days, short evenings. She loves food, but by 7 PM she's tired and the fridge is bare. She discovers recipes on TikTok and Instagram, saves the ones she loves, and improvises a weekly plan in her Notes app.",
        "She has already built her own workaround — the strongest sign the need is real and unmet. What she wants is simple to say and hard to find: one home for her recipes, a fast way to plan them, and a grocery list that just appears.",
      ],
      image: '/case-study/cookstash/mp-persona-maya.svg',
      layout: 'left',
    },
    {
      type: 'stats',
      heading: 'Maya, at a glance',
      stats: [
        { value: 'Daily life', label: 'Busy, time-poor', note: 'Tech job, full days, short evenings. Cooks on weeknights and preps on weekends.' },
        { value: 'Habits', label: 'Social-first cook', note: 'Discovers on TikTok & Instagram, saves favourites, plans the week in Notes.' },
        { value: 'Goals', label: 'Cook more, stress less', note: "Wants to actually make what she saves — without the 7 PM decision spiral." },
        { value: 'Needs', label: 'One trusted place', note: 'A personal recipe home, a fast planner, and a grocery list that builds itself.' },
        { value: 'Frustrations', label: 'Scattered & manual', note: 'Saves lost across apps; every plan re-typed from scratch with no memory.' },
        { value: 'Value', label: 'Less friction', note: 'The win is a shorter path from inspiration to dinner — not more features.' },
      ],
    },
    {
      type: 'text-image',
      heading: 'Validation: testing Maya against real people',
      content: [
        'A synthesis persona is a hypothesis. To close the gap to reality, I interviewed several people who cook and plan the way Maya does, and listened for whether the story held.',
        'It landed as recognition, not curiosity — "I literally do this in my Notes app." The core loop was solving a felt problem, not a clever one.',
        "The interviews also sharpened the edges: saving has to be effortless, people want to stay in control of their data, and the most-wanted feature was sharing with a partner. Those signals became the constraints I designed around — and gave me a persona I could trust.",
      ],
      image: '/case-study/cookstash/mp-validation-signals.svg',
      layout: 'right',
    },
    {
      type: 'stats',
      heading: 'What the interviews changed',
      stats: [
        { value: 'Resonated', label: 'The core loop is real', note: '"I literally do this in my Notes app" — recognition, not curiosity. Useful and practical.' },
        { value: 'Effort kills it', label: 'Saving must be instant', note: 'Any friction on save and the habit breaks. One paste, zero forms.' },
        { value: 'Stay in control', label: 'Trust over automation', note: 'Worry about messy auto-imported data — users want to curate, not be overridden.' },
        { value: 'Sharing matters', label: 'Most-wanted feature', note: 'Cooking is social. Send a plan or list to a partner — core, not a nice-to-have.' },
      ],
    },
    {
      type: 'text-image',
      heading: 'Problem statement: one loop, three broken stages',
      content: [
        'Market research, persona, and validation converge on one precise problem: the loop from inspiration to dinner breaks in three places.',
        'Saves scatter across platforms with no shared home. Planning happens by hand, disconnected from those saves. The grocery list is rebuilt from memory every week. Each broken stage compounds the next — inspiration expires, effort repeats, the habit never forms.',
      ],
      image: '/case-study/cookstash/mp-broken-loop.svg',
      layout: 'right',
    },
    {
      type: 'quote',
      content:
        "Busy home cooks who discover recipes on social media have no single, connected way to collect, plan, and shop from what they save — so saved content is forgotten, planning stays manual, and cooking never quite closes the loop.",
    },
    {
      type: 'text',
      heading: 'The product at a high level: four tasks, one loop',
      content: [
        "The fix isn't more features — it's closing the loop end to end. At a high level, the app gives users four connected capabilities, one per broken stage.",
        'Each task hands off cleanly to the next: a save becomes a library item, a library item becomes a planned meal, a plan becomes a grocery list, and a list can be shared in one link. Own the whole loop, and the friction disappears.',
      ],
    },
    {
      type: 'stats',
      heading: 'What the app lets you do',
      stats: [
        { value: 'Save', label: 'Recipe library', note: 'Paste any social link → a personal library you organize, name, and tag your own way.' },
        { value: 'Plan', label: 'Meal planners', note: 'Turn saved recipes into day, week, month, or occasion plans — no blank page.' },
        { value: 'Shop', label: 'Grocery lists', note: 'Every plan generates a deduplicated, aisle-grouped list automatically.' },
        { value: 'Share', label: 'One-link sharing', note: 'Send a plan or list to a partner — no account, no install.' },
      ],
    },
    {
      type: 'text',
      heading: 'Building it, end to end',
      content: [
        "With the what defined, the rest is execution discipline: structure the product, choose a stack that lets me prototype fast, design each feature from the user's journey, then build it on my own design system.",
      ],
    },
    {
      type: 'text',
      heading: 'Defining scope: four pillars, what ships in V1',
      content: [
        'This phase was about decisions, not idea generation. I listed potential features across four pillars — Library, Planner, Grocery, and Sharing — then narrowed to the smallest set that could still complete the full loop from save to cook.',
        'Library decisions: one-link save, OG metadata auto-fill, search, filters, and category management. I kept this focused on retrieval speed, because the core pain was losing recipes after saving them.',
        'Planner decisions: two modes by intent. Calendar mode supports routine week planning; freeform mode supports event-based planning. Copy-week made the weekly habit repeatable without forcing people to start over.',
        'Grocery decisions: generate from plans, group by category, dedupe repeated ingredients, and allow manual quick-add. This reduced both planning effort and in-store cognitive load.',
        'Sharing decisions: one-link, read-only list sharing without account friction. The goal was practical coordination with a partner, not social features.',
        'Everything else stayed out of V1. The rule was simple: if it did not directly reduce friction in the core loop, it could wait.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/cookstash/mp-v1-scope.png',
    },
    {
      type: 'text-image',
      heading: 'Tech stack & setup: built to prototype fast',
      content: [
        "Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · @jasmine/design-system — all in one monorepo. Pulling the design system as a workspace dependency meant I prototyped with real, interactive components from day one, not static mocks. That's what made a six-week build realistic.",
        "State lives in five focused Zustand stores, each localStorage-persisted: recipes, planner, grocery, categories, auth. Splitting by domain keeps every store small and stops a change in grocery logic from rippling into the planner.",
        'The domain types mirror a future database schema — ISO dates, UUID keys, nullable where a column would be. V2 can swap localStorage for a real backend without rewriting the UI.',
      ],
      image: '/case-study/cookstash/mp-architecture-stores.svg',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: "Feature design starts with the journey",
      content: [
        "Before building any feature, I mapped Maya's two real behaviors end to end: the spontaneous \"save it to cook later,\" and the deliberate \"plan a week of meals.\"",
        "I grounded every friction point in observable behavior, not stated preference. Watching both flows is where the friction surfaced — not in discovery, but in everything after it — which turned the problem into a build order.",
      ],
      image: '/case-study/cookstash/mp-journey-method.svg',
      layout: 'right',
    },
    {
      type: 'journey',
      heading: 'User journey map: two behaviors, one broken thread',
      content:
        'Each step traces what Maya does and how she feels. Friction points are flagged — and they cluster in the exact same place across both journeys: the handoff between finding a recipe and acting on it.',
      scenarios: [
        {
          title: 'Scenario 1 — Save a recipe to cook later',
          context: 'The spontaneous save. One recipe, found on social, cooked another day.',
          steps: [
            { stage: 'Discover', action: 'Scrolling Facebook, TikTok, or Instagram, she finds a recipe with clear, easy-to-follow steps.', feeling: 'Inspired — "this looks doable."' },
            { stage: 'Save', action: "Taps save on the reel, assuming she'll make it soon.", feeling: 'Confident, low effort.' },
            { stage: 'Accumulate', action: 'Saves pile up across Facebook, TikTok, and Instagram with no shared home.', feeling: 'Unaware the pile is forming.', friction: true },
            { stage: 'Recall', action: 'On the weekend she wants the beef salad she saved on a Facebook reel.', feeling: 'Motivated, ready to cook.' },
            { stage: 'Retrieve', action: "Opens Facebook, searches the author's name, goes to their page, then searches again inside their reels to re-find it.", feeling: 'Frustrated — a multi-step hunt for one dish.', friction: true },
            { stage: 'Cook', action: 'Finally follows the instructions and makes the meal.', feeling: 'Satisfied — but the path there was the hard part.' },
          ],
        },
        {
          title: 'Scenario 2 — Save recipes for a meal-prep week',
          context: 'The deliberate planner. Existing apps rejected, so she built her own workaround.',
          steps: [
            { stage: 'Reject apps', action: "Skips meal-prep apps — they suggest recipes that don't match her taste, ingredients, or cooking culture.", feeling: 'Distrustful — "this isn\'t food I\'d actually make."', friction: true },
            { stage: 'DIY in Notes', action: "Opens the iPhone Notes app — the fastest tool she trusts — and starts a new note for the week.", feeling: 'Resourceful, pragmatic.' },
            { stage: 'Plan', action: 'Names the plan, uses a table to schedule dishes, and a checklist to list every grocery item by category.', feeling: "In control — but it's all manual typing.", friction: true },
            { stage: 'Shop & prep', action: 'Shops from the checklist on the weekend, comes home, and preps the meals.', feeling: 'Accomplished.' },
            { stage: 'Disconnected', action: "Her Notes list is plain text, fully separate from the social saves the recipes came from.", feeling: "It works for today, not for next time.", friction: true },
            { stage: 'Repeat', action: "Next week she starts a brand-new note and re-hunts every channel — no history, no saved preferences, no single source.", feeling: 'Resigned to redoing it all.', friction: true },
          ],
        },
      ],
      insights: [
        'Saves live in silos. The same recipe library is scattered across Facebook, TikTok, and Instagram with no shared home — so nothing is ever a single source of truth.',
        "Retrieval is the real cost. The pain isn't saving or cooking — it's the manual hunt in between. Every re-find is a multi-step search that taxes the intent until it dies.",
        "Personalization is non-negotiable. Maya rejects suggestion-based apps outright; she trusts her own taste. The library has to be user-curated, never algorithm-pushed.",
        "Her workaround reveals the spec. Notes works because it's fast and hers — but it's ephemeral, manual, and disconnected from the recipes. That gap is the exact product to build.",
        'Planning has no memory. Every week restarts from zero. Without persistent history and preferences, effort never compounds.',
      ],
    },
    {
      type: 'text-image',
      heading: 'Critical decision 1: make saving effortless — and safe',
      content: [
        "The strongest signal from research: nobody fills out a recipe form. So saving is a single paste. A server-side route fetches the link's Open Graph metadata — title, thumbnail, platform — and the recipe lands in the library in about a second, zero typing.",
        "But a public URL-fetcher is a security surface. The route blocks internal addresses (SSRF protection), times out at five seconds, and runs a three-tier check on unknown domains — Schema.org Recipe data, then cooking keywords, then reject — so it only ingests real recipe pages.",
        'OG data is inconsistent, so an edit drawer is always one tap away: optimise the 90% paste-and-done path, make the 10% fixable.',
      ],
      image: '/case-study/cookstash/mp-og-fetch.svg',
      layout: 'left',
    },
    {
      type: 'text-image',
      heading: 'Critical decision 2: two planners, one type-safe store',
      content: [
        'Weekday planning and occasion planning are different problems. Calendar mode lays out the week with meal slots, a month overview, and copy-week. Freeform mode groups dishes by type for a "Thanksgiving" or "camping trip" — no dates at all.',
        'Rather than build two systems, I modelled both as a discriminated union — CalendarPlan | FreeformPlan — over one store. The mode field narrows the type, so each planner gets exactly the fields it needs and the compiler enforces the difference.',
        'The hardest piece was copy-week: it maps by day-of-week, not by date, and merges non-destructively, so it never silently overwrites an existing plan.',
      ],
      image: '/case-study/cookstash/mp-two-planners.svg',
      layout: 'right',
    },
    {
      type: 'image-grid',
      images: [
        '/case-study/cookstash/mp-screen-library.svg',
        '/case-study/cookstash/mp-screen-planner.svg',
        '/case-study/cookstash/mp-screen-grocery.svg',
      ],
      captions: [
        'Library — every save in one searchable home, filterable by ingredient and source.',
        'Planner — pre-structured day slots remove the blank-page decision; copy-week carries a plan forward.',
        'Grocery — auto-generated, grouped by aisle, duplicates deduped, shareable by one link.',
      ],
    },
    {
      type: 'text',
      heading: 'Critical decision 3: sharing without accounts',
      content: [
        'A shared grocery list is useless if the recipient has to sign up. So sharing has no backend at all: the list snapshot is serialised to JSON, base64url-encoded, and embedded directly in the share URL.',
        'The recipient opens the link, it decodes client-side, and they see a clean, read-only view — no account, no lookup, nothing to install. The decoder stays backward-compatible, so old links never break.',
        'A deliberately simple solution that ships the "share with your partner" moment without standing up auth infrastructure first.',
      ],
    },
    {
      type: 'text',
      heading: 'Applying my design system',
      content: [
        'Every primitive — Button, Input, Select, Modal, ScrollTabBar — comes from @jasmine/design-system as a workspace dependency. On that foundation I composed 38 feature components across library, planner, grocery, sharing, and responsive layout.',
        "This is the payoff for the design system. The app felt consistent on day one, and prototyping with real components — not static mocks — is what made the timeline realistic. The first project proved the system could be built; this one proves it was worth building.",
      ],
    },
    {
      type: 'stats',
      heading: 'Outcomes',
      stats: [
        { value: '4', label: 'Product pillars, shipped', note: 'Library, Planner, Grocery, Sharing — the full loop, end to end' },
        { value: '38', label: 'Feature components', note: 'Composed on top of @jasmine/design-system primitives' },
        { value: '5', label: 'Zustand stores', note: 'Domain-split, localStorage-persisted: recipes, planner, grocery, categories, auth' },
        { value: '15+', label: 'Typed domain models', note: 'Written to mirror a future DB schema for zero-rewrite V2 wiring' },
        { value: '2', label: 'Planner modes, 1 store', note: 'Calendar + Freeform via a discriminated union' },
        { value: '1', label: 'Responsive codebase', note: 'Mobile (375px) to desktop (1280px) — bottom nav and sidebar from one source' },
      ],
    },
    {
      type: 'text',
      heading: 'Try the live demo',
      content: [
        'The full loop is live and interactive — save a recipe, plan a week, generate a grocery list, and share it in one link. Open the running app from the "Try the live demo" button at the top of this page.',
      ],
    },
    {
      type: 'quote',
      content:
        "The gap between saving a recipe and cooking it shouldn't take an app full of features to close. It takes one that owns the whole loop — save, plan, shop — and gets out of the way.",
    },
  ],

  images: ['', ''],
  imageLabels: ['Cookstash — desktop', 'Cookstash — mobile'],
  // In dev, point at the local cookstash server (port 3001).
  // NODE_ENV is statically inlined by Next.js at build time.
  link:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://meal-prep.jasminehoang.com',
};
