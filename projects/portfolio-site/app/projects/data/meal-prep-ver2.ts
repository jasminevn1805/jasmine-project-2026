import type { ProjectData } from './types';

export const mealPrepVer2: ProjectData = {
  slug: 'meal-prep-ver2',
  title: 'Crafting a web app that closes the loop from recipe inspiration to meal prep',
  overviewHeadline: 'Meal Prep Ver 2',
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
    "TikTok. Reels. Shorts. Your recipes live everywhere except where you actually cook. Meal Prep brings every saved video recipe into one library, so planning and shopping start in seconds, not screenshots.",

  sections: [
    {
      type: 'text',
      layout: 'split',
      heading: 'What is Meal Prep?',
      content: [
        'Meal Prep is a web app that helps home cooks turn recipe inspiration into meals they actually make. It consolidates recipes saved from social links and web articles into one organized personal library. From there, users build day-, week-, month-, or occasion-based meal plans and generate grocery lists automatically.',
        'By unifying saving, planning, and shopping into a single flow, the product closes the gap between "that looks good" and dishes on the table.',
      ],
    },
    {
      type: 'text',
      layout: 'split',
      heading: 'Challenges',
      content: [
        'Short-form video has made social media one of the most popular sources of cooking inspiration. But in a category already flooded with recipe-saving tools scattered across platforms, the real challenge was not discovery — it was converting that inspiration into action.',
      ],
    },
    {
      type: 'section-group',
      heading: 'Research Approach',
    },
    {
      type: 'text-image',
      heading: 'Competitive analysis, to validate the opportunity',
      content: [
        'I ran a competitive analysis on three category leaders — Mealime, Paprika, and Yummly — focused on three questions: what job each product owns, where users drop off, and what assumptions each quietly makes. I kept this deliberately broad rather than a deep teardown; going too deep on a near-identical product early on just inherits its assumptions instead of challenging them.',
        'The pattern that emerged: all three treat recipes as a library to browse — a search-and-read experience — not a personal collection. That gap pointed to the real opportunity: a personalized recipe library built around effortless saving, including from short-form video.',
      ],
      image: '/case-study/meal-prep/mp-market-landscape1.svg',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: "User interviews, to pressure-test the hypothesis",
      content: [
        'To get past assumptions and into real behavior, I built Maya — a synthesis persona modeled on behavior patterns — as a working hypothesis, then tested and refined it against interviews. The interviews sharpened the edges: saving had to be effortless, people wanted to stay in control of their own data, and sharing plans with a partner surfaced as a genuine, if secondary, want. Those signals became both my research guardrails and a persona I could design against with confidence.',
      ],
      image: '/case-study/meal-prep/mp-persona-maya1.svg',
      layout: 'left',
    },
    {
      type: 'quote',
      content:
        "Busy home cooks who discover recipes on social media have no single, connected way to collect, plan, and shop from what they save — so saved content is forgotten, planning stays manual, and cooking never quite closes the loop.",
    },
    {
      type: 'stats',
      heading: 'Verified user persona, Maya',
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
      type: 'list',
      heading: 'Problem statement',
      items: [
        {
          summary: 'Recipe inspiration is easy to find, but hard to keep.',
          body: 'Short-form content is where people discover recipes, but those saves scatter across separate apps and platforms. There is no single home where a recipe becomes something you can actually return to and cook from.',
        },
        {
          summary: 'Meal planning still takes too much manual work.',
          body: 'Even when people know what they want to cook, they often rebuild the same weekly plan from scratch in notes or spreadsheets. Existing tools are not built for social-first recipe discovery, so the process stays fragmented and repetitive.',
        },
        {
          summary: 'The jump from planning to shopping is still disconnected.',
          body: 'A good planning tool should make the next step obvious. This product needed to turn saved recipes into structured plans, then into grocery lists, without adding friction at the handoff.',
        },
      ],
    },
    {
      type: 'section-group',
      heading: 'Design Approach',
    },
    {
      type: 'text',
      heading: 'Scoped the MVP around one connected loop',
      content: [
        'The app gives users four connected capabilities, one per broken stage: Save, Plan, Shop, Share. Each step hands off cleanly to the next — a save becomes a library item, a library item becomes a planned meal, a plan becomes a grocery list, and a list can be shared in one link. Owning the full loop keeps friction at the handoffs between disconnected tools, not inside the product itself.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/meal-prep/mp-v1-scope.png',
    },
    {
      type: 'journey',
      heading: "Feature design followed the user's actual journey",
      content:
        'Mapping the journey from "sees a recipe" to "food is shopped for" surfaced two moments where existing tools typically lose people: the save itself, and the transition from inspiration to a usable plan. Those two moments became the critical decisions the design had to get right.',
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
      heading: 'Decision: Make saving effortless, and safe',
      content: [
        "The strongest signal from research: nobody fills out a recipe form. So saving is a single paste. A server-side route fetches the link's Open Graph metadata — title, thumbnail, platform — and the recipe lands in the library in about a second, zero typing.",
        'But a public URL-fetcher is a security surface. The route blocks internal addresses (SSRF protection), times out at five seconds, and runs a three-tier check on unknown domains — Schema.org Recipe data, then cooking keywords, then reject — so it only ingests genuine recipe pages.',
        'Because OG data is inconsistent, an edit drawer is always one tap away: optimize for the 90% paste-and-done path, and make the remaining 10% quickly fixable.',
      ],
      image: '/case-study/meal-prep/mp-og-fetch.svg',
      layout: 'left',
    },
    {
      type: 'text-image',
      heading: 'Decision: Two planners, one type-safe store',
      content: [
        'Weekday planning and occasion planning are different problems. Calendar mode lays out the week with meal slots, a month overview, and copy-week. Freeform mode groups dishes by type for a "Thanksgiving" or "camping trip" — no dates involved at all.',
        'Rather than build two separate systems, I modeled both as a discriminated union — CalendarPlan | FreeformPlan — over a single store. The mode field narrows the type, so each planner gets exactly the fields it needs, and the compiler enforces the difference.',
        'The hardest piece was copy-week: it maps by day-of-week rather than by date, and merges non-destructively, so it never silently overwrites an existing plan.',
      ],
      image: '/case-study/meal-prep/mp-two-planners.svg',
      layout: 'right',
    },
    {
      type: 'image-grid',
      images: [
        '/case-study/meal-prep/mp-screen-library.svg',
        '/case-study/meal-prep/mp-screen-planner.svg',
        '/case-study/meal-prep/mp-screen-grocery.svg',
      ],
      captions: [
        'Library — every save in one searchable home, filterable by ingredient and source.',
        'Planner — pre-structured day slots remove the blank-page decision; copy-week carries a plan forward.',
        'Grocery — auto-generated, grouped by aisle, duplicates deduped, shareable by one link.',
      ],
    },
    {
      type: 'text',
      heading: 'Decision: Efficient and fast sharing without accounts',
      content: [
        'A shared grocery list is useless if the recipient has to sign up. So sharing has no backend at all: the list snapshot is serialised to JSON, base64url-encoded, and embedded directly in the share URL.',
        'The recipient opens the link, it decodes client-side, and they see a clean, read-only view — no account, no lookup, nothing to install. The decoder stays backward-compatible, so old links never break.',
        'A deliberately simple solution that ships the "share with your partner" moment without standing up auth infrastructure first.',
      ],
    },
    {
      type: 'image-grid',
      images: [
        '/case-study/meal-prep/mp-screen-library.svg',
        '/case-study/meal-prep/mp-screen-planner.svg',
        '/case-study/meal-prep/mp-screen-grocery.svg',
      ],
      captions: [
        'Library — every save in one searchable home, filterable by ingredient and source.',
        'Planner — pre-structured day slots remove the blank-page decision; copy-week carries a plan forward.',
        'Grocery — auto-generated, grouped by aisle, duplicates deduped, shareable by one link.',
      ],
    },
    {
      type: 'section-group',
      heading: 'Development Approach',
    },
    {
      type: 'text-image',
      heading: 'Tech stack & setup: built to prototype fast',
      content: [
        "Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · @jasmine/design-system — all in one monorepo. Pulling the design system as a workspace dependency meant I prototyped with real, interactive components from day one, not static mocks. That's what made a six-week build realistic.",
        "State lives in five focused Zustand stores, each localStorage-persisted: recipes, planner, grocery, categories, auth. Splitting by domain keeps every store small and stops a change in grocery logic from rippling into the planner.",
        'The domain types mirror a future database schema — ISO dates, UUID keys, nullable where a column would be. V2 can swap localStorage for a real backend without rewriting the UI.',
      ],
      image: '/case-study/meal-prep/mp-architecture-stores.svg',
      layout: 'right',
    },
    {
      type: 'list',
      heading: 'Turning the design into a working prototype',
      items: [
        {
          summary: 'Built the UI as reusable components organized by feature domain.',
          body: "Rather than building screens one-off, I translated the design system into React components grouped by product domain — Recipe (RecipeCard, RecipeDetail, RecipeGrid, SaveRecipeModal, DeleteConfirmModal), Grocery (GroceryItem, GroceryList), Planner (CalendarPlanner, AddDishModal, AssignDishModal), and Share (ShareListButton). Organizing by domain rather than by page kept components reusable across features and made the codebase mirror the product's actual information architecture.",
        },
        {
          summary: 'Composed pages from the domain components.',
          body: "Each feature's page.tsx was built by assembling the components from step one, with pages responsible for layout and data flow, and components staying focused on presentation. This kept business logic out of the UI layer and made components easy to reuse or restyle without touching page-level logic.",
        },
        {
          summary: 'Choose Zustand for lightweight, domain-scoped state.',
          body: "State was split into five focused stores — useAuthStore, useCategoryStore, useGroceryStore, usePlannerStore, useRecipeStore — one per domain rather than one global store. Zustand was the right fit over heavier options like Redux: minimal boilerplate, no context-provider nesting, and simple selector-based subscriptions, which matched the app's size and kept state logic easy to reason about as features grew.",
        },
        {
          summary: 'Persist state to localStorage.',
          body: "Each Zustand store is persisted to localStorage, ensuring that user data and app state survive page reloads. This approach keeps the app responsive and reduces the need for server-side state management for transient data.",
        },
        {
          summary: 'Use middleware for logging and debugging.',
          body: "In addition to persistence, Zustand stores use middleware for logging state changes and debugging. This helps track state mutations during development and ensures predictable state management.",
        },
        {
          summary: 'Refactored for consistency and performance as the app scaled.',
          body: "As features accumulated, I revisited components for duplicated logic, tightened prop interfaces for type safety, and consolidated repeated patterns (like modal confirmation flows) into shared components. The goal was keeping the codebase easy for a future contributor — or future me — to extend without re-learning it.",
        },
      ],
    },
    {
      type: 'text',
      heading: 'Applying design system for consistency and scalability',
      content: [
        'Every primitive — Button, Input, Select, Modal, ScrollTabBar — comes from @jasmine/design-system as a workspace dependency. On that foundation I composed 38 feature components across library, planner, grocery, sharing, and responsive layout.',
        "This is the payoff for the design system. The app felt consistent on day one, and prototyping with real components — not static mocks — is what made the timeline realistic. The first project proved the system could be built; this one proves it was worth building.",
      ],
    },
    {
      type: 'image',
      image: '/case-study/meal-prep/mp-architecture-components.svg',
    },
    {
      type: 'text-image',
      heading: 'Turning the design into a working prototype',
      content: [
        "Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · @jasmine/design-system — all in one monorepo. Pulling the design system as a workspace dependency meant I prototyped with real, interactive components from day one, not static mocks. That's what made a six-week build realistic.",
        "State lives in five focused Zustand stores, each localStorage-persisted: recipes, planner, grocery, categories, auth. Splitting by domain keeps every store small and stops a change in grocery logic from rippling into the planner.",
        'The domain types mirror a future database schema — ISO dates, UUID keys, nullable where a column would be. V2 can swap localStorage for a real backend without rewriting the UI.',
      ],
      image: '/case-study/meal-prep/mp-architecture-stores.svg',
      layout: 'right',
    },
    {
      type: 'section-group',
      heading: 'Outcomes',
    },
    {
      type: 'stats',
      heading: 'The MVP shipped in three weeks',
      stats: [
        { value: '4', label: 'Product pillars', note: 'Library, Planner, Grocery, Sharing — the full loop, end to end' },
        { value: '38', label: 'Feature components', note: 'Composed on top of @jasmine/design-system primitives' },
        { value: '5', label: 'Zustand stores', note: 'Domain-split, localStorage-persisted: recipes, planner, grocery, categories, auth' },
        { value: '15+', label: 'Typed domain models', note: 'Written to mirror a future DB schema for zero-rewrite V2 wiring' },
        { value: '2', label: 'Planner modes, 1 store', note: 'Calendar + Freeform via a discriminated union' },
        { value: '1', label: 'Responsive codebase', note: 'Mobile (375px) to desktop (1280px) — bottom nav and sidebar from one source' },
      ],
    },
    {
      type: 'image-grid',
      images: [
        '/case-study/meal-prep/mp-screen-library.svg1',
        '/case-study/meal-prep/mp-screen-planner.svg1',
        '/case-study/meal-prep/mp-screen-grocery.svg1',
      ],
      captions: [
        'Library — every save in one searchable home, filterable by ingredient and source.',
        'Planner — pre-structured day slots remove the blank-page decision; copy-week carries a plan forward.',
        'Grocery — auto-generated, grouped by aisle, duplicates deduped, shareable by one link.',
      ],
    },
    {
      type: 'text',
      heading: 'Try the live demo',
      content: [
        'The full loop is live and interactive — save a recipe, plan a week, generate a grocery list, and share it in one link. Open the running app from the "Try the live demo" button at the top of this page.',
      ],
    },
  ],

  images: [],

  // In dev, point at the local meal-prep server (port 3001).
  // NODE_ENV is statically inlined by Next.js at build time.
  link:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://meal-prep.jasminehoang.com',
};
