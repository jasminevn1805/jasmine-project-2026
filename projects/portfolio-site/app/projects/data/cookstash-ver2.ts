import type { ProjectData } from './types';

export const cookstashVer2: ProjectData = {
  slug: 'cookstash-ver2',
  title: 'Cookstash — Bring all those cooking ideas into one place',
  heroImage: '/case-study/cookstash/cs-hero.png',
  overviewHeadline: 'Case study focus',
  services: [
    'Product Designer',
    'Problem Framing · Ideation · Information Architecture',
    'Interaction Design · Code-based Prototyping',
    'Build & Deploy',
  ],
  platforms: ['Web App'],
  industry: 'Consumer Food & Meal Planning',
  description: [
    'The Cookstash project explored how a product idea could be transformed into a usable experience through an end-to-end product design process—from ideation and concept development through interaction design and coded prototyping.',
    'This case study focuses on how I translated an initial product opportunity into a structured product experience, exploring ideas quickly, defining the interaction model, and iterating from design concepts to a functional prototype.',
  ],

  sections: [
    {
      type: 'text',
      layout: 'split',
      heading: 'What is Cookstash?',
      content: [
        'Cookstash is a personal cooking content hub that brings recipes from social platforms into one organized place. Users can save cooking videos, organize them in their recipe library, and turn them into meal or occasion plans.',
        'From inspiration to meals, Cookstash connects the journey:',
        '**Save → Organize → Plan → Shop → Share**.',
      ],
    },
    {
      type: 'section-group',
      heading: 'Frame the opportunity',
    },
    {
      type: 'text',
      layout: 'split',
      heading: 'The Opportunity',
      content: [
        'Short-form video has transformed how people consume information. A simple, engaging cooking video can make a recipe easier to understand than long, text-heavy instructions, making cooking feel more accessible, natural, and enjoyable.',
        'This creates an opportunity to turn everyday inspiration into healthier, more intentional cooking habits.'
      ],
    },
    {
      type: 'text',
      layout: 'split',
      heading: 'Problem',
      content: [
        "The problem wasn't discovery anymore—it was turning inspiration into action. Cooking inspirations are scattered across social platforms, making it difficult to organize, revisit it later.",
      ],
    },
    {
      type: 'quote',
      heading: 'Hypothesis',
      content: [
        'By connecting recipe discovery, personal collection, meal planning, grocery preparation, and sharing in one continuous experience, Cookstash can turn scattered cooking inspiration into something people can organize, plan, and act on in their everyday lives.',
      ],
    },
    /*{
      type: 'text',
      layout: 'split',
      heading: 'Hypothesis',
      content: [
        'By connecting recipe discovery, personal collection, meal planning, grocery preparation, and sharing in one continuous experience, Cookstash can turn scattered cooking inspiration into something people can organize, plan, and act on in their everyday lives.',
      ],
    },*/
    {
      type: 'section-group',
      heading: 'Opportunity Validation',
    },
    {
      type: 'quote',
      content: [
        '" Is this hypothesis worth pursuing? "',
      ],
    },
    {
      type: 'list-image',
      heading: 'Competitive analysis, quickly validate the opportunity',
      items: [
        {
          summary: 'Goal',
          body: 'Understand how existing products help people discover, save, organize, and act on cooking inspiration, and identify where Cookstash could differentiate.',
        },
        {
          summary: 'Process',
          body: 'Reviewed a focused set of products across the cooking journey — social platforms, recipe libraries, and meal-planning tools — comparing how each supports discovery → saving → organizing → planning → shopping → sharing.',
        },
        {
          summary: 'Findings',
          body: [
            '**Similar flows across products** — Most follow a familiar journey from recipe saving to planning and grocery management, with only minor differences in feature support.',
            '**Similar recipe experience** — Most rely on structured, text-based recipes and in-product libraries, creating a largely similar experience across the category.',
          ],
        },
        {
          summary: 'Opportunity',
          body: [
            'Discovered incidentally. Saved intentionally. Cookstash turns spontaneous cooking inspiration into a personal, video-first recipe collection.',
          ],
        },
      ],
      image: '/case-study/cookstash/ct-competitive-analysis.png',
      layout: 'right',
    },
    {
      type: 'section-group',
      heading: 'Define the product',
    },
    {
      type: 'text-image',
      heading: 'Information model',
      content: [
        'Recipe is the core object. Collections help users organize recipes, while Plans turn them into actionable meals and Grocery Lists support preparation.',
      ],
      image: '/case-study/cookstash/cs-information-model.png',
      //imageDefaults: { aspectRatio: '16:9', objectFit: 'stretch' },
      layout: 'right',
    },
    {
      type: 'list-image',
      heading: 'Scope & Prioritization',
      items: [
        {
          summary: 'MVP Experience',
          body: 'I focused the MVP on Capture, Library, Plan, and Shop because together they form the minimum end-to-end journey from discovering a recipe to turning it into an actionable meal plan and shopping list.',
        },
        {
          summary: 'Trade-off',
          body: [
            '**Ingredient generation was intentionally deferred from the MVP**: Automatic ingredient extraction was deferred because social-media content is often incomplete or unstructured. Instead, the MVP uses a lightweight Note capability to capture missing information.',
            '**V1:** Generate consolidated ingredients from recipes selected in a meal plan, using more reliable recipe data.',
          ],
        },
      ],
      image: '/case-study/cookstash/ct-product-development-scope.png',
      layout: 'right',
    },
    {
      type: 'section-group',
      heading: 'User journey',
    },
    {
      type: 'journey',
      heading: "Where does the painpoints come from?",
      content:
        'Mapping the journey from "sees a recipe" to "shops ingredients" surfaced two moments where existing tools typically lose people: the save itself, and the transition from inspiration to a usable plan. Those two moments became the critical decisions the design had to get right.',
      scenarios: [
        {
          title: 'Save a recipe for later cook',
          context: 'The spontaneous save. One recipe, found on social, cooked another day.',
          steps: [
            { stage: 'Discover', action: 'Scrolling Facebook, TikTok, or Instagram, she finds a recipe with clear, easy-to-follow steps.', feeling: 'Inspired — "this looks doable."' },
            { stage: 'Save', action: "Taps save on the reel, assuming she'll make it soon.", feeling: 'Confident, low effort.' },
            { stage: 'Accumulate', action: 'Saves pile up across Facebook, TikTok, and Instagram with no shared home.', feeling: 'Unaware the pile is forming.', friction: true },
            { stage: 'Recall', action: 'On the weekend she wants the beef salad she saved on a Facebook reel.', feeling: 'Motivated, ready to cook.' },
            { stage: 'Retrieve', action: "Opens Facebook, searches the author's name, goes to their page, then searches again inside their reels to re-find it.", feeling: 'Frustrated — a multi-step hunt for one dish.', friction: true },
            { stage: 'Cook', action: 'Follows the instructions and makes the meal.', feeling: 'Satisfied — but the path there was the hard part.' },
          ],
        },
        {
          title: 'Plan a meal',
          context: 'The deliberate planner. Existing apps rejected, so she built her own workaround.',
          steps: [
            { stage: 'Reject apps', action: "Skips meal-prep apps — they suggest recipes that don't match her taste, ingredients, or cooking culture.", feeling: 'Distrustful — "this isn\'t food I\'d actually make."', friction: true },
            { stage: 'DIY in Notes', action: "Opens the Notes app on iPhone — the fastest tool — starts a new note for the week.", feeling: 'Resourceful, pragmatic.' },
            { stage: 'Plan', action: 'Names the plan, uses table format to schedule dishes. Create a checklist, list out every grocery item, sort by category.', feeling: "In control — but it's all manual typing.", friction: true },
            { stage: 'Shop & prep', action: 'Shops from the checklist on the weekend, comes home, and preps the meals.', feeling: 'Accomplished.' },
            { stage: 'Repeat', action: "Next week she starts a brand-new note and create a new plan — no history, no saved preferences, no single source.", feeling: 'Resigned to redoing it all.', friction: true },
            { stage: 'Disconnected', action: "Her Notes lists pipe up, each list contain long plain text, more days plan, more type.", feeling: "Unmotivated to keep doing.", friction: true },
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
      type: 'section-group',
      heading: 'Design',
    },
    {
      type: 'list-image',
      heading: 'Decision 1 — Make saving effortless, and safe',
      items: [
        {
          summary: 'One-step capture',
          body: 'Users paste a link and the system automatically fetches the title, thumbnail, platform, and other metadata—no manual entry.',
        },
        {
          summary: 'Safe link fetching',
          body: 'Server-side validation blocks internal/private addresses and suspicious destinations before fetching external content.',
        },
        {
          summary: 'Fast failure',
          body: 'A 5-second timeout prevents slow or unresponsive links from blocking the experience.',
        },
        {
          summary: 'Recipe validation',
          body: 'Trusted recipe sources are imported directly; unfamiliar links are checked for recipe metadata or cooking-specific content before being accepted.',
        },
      ],
      image: '/case-study/cookstash/mp-og-fetch.svg',
      layout: 'right',
    },
    {
      type: 'list-image',
      heading: 'Decision 2 — Two planner modes, one type-safe store',
      items: [
        {
          summary: 'Different planning contexts require different structures',
          body: [ 
            'Calendar mode supports recurring weekly meal planning with dates and meal slots, while Freeform mode supports date-independent occasions such as Thanksgiving or a camping trip',
            'Rather than treating them as separate products, I modeled both through a single type-safe planning system, allowing each mode to have only the information and interactions it needs.',
          ],
        },
        {
          summary: 'Key interaction',
          body: 'Copy-week maps meals by day of week and merges them non-destructively, preventing existing plans from being silently overwritten.',
        },
        {
          summary: 'Result',
          body: 'Two distinct planning experiences without duplicating the underlying system—keeping the product flexible while maintaining a consistent architecture.',
        },
      ],
      image: '/case-study/cookstash/mp-two-planners.svg',
      layout: 'left',
    },
    {
      type: 'section-group',
      heading: 'Development',
    },
    {
      type: 'list-image',
      heading: 'Tech stack & setup — Built to prototype fast',
      items: [
        {
          summary: 'Stack',
          body: [ 
            'Next.js 16 · React 19 · TypeScript · Tailwind v4 · Zustand · Design System · Monorepo',
          ],
        },
        {
          summary: 'Real components from day one',
          body: 'The design system was integrated as a workspace dependency, so the prototype was built with real, interactive components instead of static mocks. This shortened the gap between design and implementation and made rapid iteration possible.',
        },
        {
          summary: 'Lightweight, domain-based state',
          body: 'Five focused Zustand stores manage recipes, planning, groceries, categories, and authentication. Keeping state separated by domain makes the prototype easier to evolve without changes in one area cascading into another.',
        },
        {
          summary: 'Backend-ready data model',
          body: 'Domain types follow a database-friendly structure—UUIDs, ISO dates, and nullable fields—so the prototype can move from localStorage to a real backend without requiring a major UI rewrite.',
        },
      ],
      image: '/case-study/cookstash/mp-architecture-stores.svg',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'Turning the design concept into a working prototype — From foundation to working features',
      content: [
        'I used Claude Code to translate the defined design patterns, information architecture, and interaction flows into a reusable React foundation. I built the product progressively—from shared components and domain models to feature experiences—then iterated as the flows came together.',
      ],
      image: '/case-study/cookstash/ct-development-process-using-claude-code.png',
      imageDefaults: { aspectRatio: '3:4', objectFit: 'contain' },
      layout: 'right',
    },
    {
      type: 'card-grid',
      columns: 3,
      imageDefaults: { aspectRatio: '3:4', objectFit: 'stretch' },
      cards: [
        {
          image: '/case-study/cookstash/ct-product-foundation-setup.png',
          heading: '01 — Establish the product foundation',
          body: [
            'I first established the reusable foundation: design-system components, domain types, routing, and state structure.',
            'The codebase was organized around product domains rather than individual screens, allowing the implementation to mirror the product architecture.',
          ],
        },
        {
          image: '/case-study/cookstash/ct-library-page-domain-component.png',
          heading: '02 — Build features from reusable components',
          body: [
            'Features were composed from these domain components rather than built as one-off screens.',
            "This kept the implementation consistent with the product's information architecture and made patterns reusable across flows.",
          ],
        },
        {
          image: '/case-study/cookstash/ct-data-storage-by-zustand.png',
          heading: '03 — Connect components into real interactions',
          body: 'I connected the components through domain-scoped state using Zustand, allowing actions such as saving a recipe, assigning dishes to a planner, generating a grocery list, and sharing a plan to work across the product.',
        },
        {
          image: '/case-study/cookstash/ct-local-persistence.png',
          heading: '04 — Persist the experience',
          body: 'I persisted domain state locally so recipes, plans, and grocery lists survive page reloads, giving the prototype a realistic product experience without requiring a backend.',
        },
        {
          image: '/case-study/cookstash/ct-prototype-iteration-sample.png',
          heading: '05 — Iterate as the product took shape',
          body: [
            'As the flows became interactive, I used the working prototype to identify duplicated patterns, unclear interactions, and inconsistencies between features.',
            'I refactored shared components, tightened type definitions, and consolidated recurring interaction patterns as the product evolved.',
          ],
        },
      ],
    },
    {
      type: 'section-group',
      heading: 'Outcomes',
    },
    {
      type: 'stats',
      heading: 'The MVP highlights',
      stats: [
        { value: '4', label: 'Product pillars', note: 'Library, Planner, Grocery, Sharing — the full loop, end to end' },
        { value: '38', label: 'Feature components', note: 'Composed on top of @jasmine/design-system' },
        { value: '5', label: 'Zustand stores', note: 'Domain-split, localStorage-persisted: recipes, planner, grocery, categories, auth' },
        { value: '19', label: 'Typed domain models', note: 'Written to mirror a future DB schema for zero-rewrite V2 wiring' },
        { value: '2', label: 'Planner modes, 1 store', note: 'Calendar + Freeform via a discriminated union' },
        { value: '1', label: 'Responsive codebase', note: 'Mobile to desktop (768px breakpoint) — bottom nav and sidebar from one source' },
      ],
    },
    {
      type: 'list',
      heading: 'Highlighted features',
      items: [
        {
          summary: 'Zero-typing recipe capture',
          body: 'Paste a link and the recipe lands in the library in about a second — no form. A server-side route resolves Open Graph metadata, blocks internal/private addresses (SSRF protection), and times out at 5 seconds. Unknown domains get a two-tier content check — Schema.org Recipe data, then 3+ cooking-keyword matches — before being accepted.',
        },
        {
          summary: 'No-backend sharing',
          body: 'A shared grocery list needs no account and no server round-trip: the list is serialized to JSON, base64url-encoded, and embedded directly in the share URL. The recipient decodes it client-side.',
        },
        {
          summary: 'Deduped, aisle-grouped grocery lists',
          body: 'Items are deduplicated by name + category as they’re added, so the same ingredient from two recipes merges into one line instead of listing twice.',
        },
        {
          summary: 'Local data that survives schema changes',
          body: 'Recipes, planner, and category state are each on their own versioned migration path (v3–v5) — real users’ existing local data upgrades in place across releases instead of getting wiped.',
        },
      ],
    },
    {
      type: 'card-grid',
      columns: 3,
      //imageDefaults: { aspectRatio: '3:4', objectFit: 'stretch' },
      cards: [
        {
          image: '/case-study/cookstash/cs-save-recipe.png',
          heading: 'Save a recipe',
          body: 'simple and quick save with a link, auto fetching recipe metadata.',
        },
        {
          image: '/case-study/cookstash/cs-library.png',
          heading: 'Library',
          body: 'Every save in one searchable home, filterable by ingredient and source.',
        },
        {
          image: '/case-study/cookstash/cs-manage-category.png',
          heading: 'Category',
          body: ' Mangage collections according to your interests.',
        },
        {
          image: '/case-study/cookstash/cs-plan-calendar-mode.png',
          heading: 'Planner',
          body: ' Pre-structured day slots remove the blank-page decision; copy-week carries a plan forward.',
        },
        {
          image: '/case-study/cookstash/cs-create-shop-list.png',
          heading: 'Grocery',
          body: [
            'Auto-generated, grouped by aisle, duplicates deduped, shareable by one link.',
          ],
        },
        {
          image: '/case-study/cookstash/cs-add-ingredients.png',
          heading: 'Add Ingredients',
          body: 'Categorized ingredients, easy select and add.',
        },
      ],
    },
    /*{
      type: 'image-grid',
      //imageDefaults: { aspectRatio: '4:3', objectFit: 'cover' },
      columns: 3,
      images: [
        '/case-study/cookstash/cs-save-recipe.png',
        '/case-study/cookstash/cs-library.png',
        '/case-study/cookstash/cs-manage-category.png',
        '/case-study/cookstash/cs-plan-calendar-mode.png',
        '/case-study/cookstash/cs-create-shop-list.png',
        '/case-study/cookstash/cs-add-ingredients.png',
      ],
      captions: [
        'Save a recipe — simple and quick save with a link, auto fetching recipe metadata.',
        'Library — every save in one searchable home, filterable by ingredient and source.',
        'Category — mangage collections according to your interests.',
        'Planner — pre-structured day slots remove the blank-page decision; copy-week carries a plan forward.',
        'Grocery — auto-generated, grouped by aisle, duplicates deduped, shareable by one link.',
        'Add Ingredient — categorized ingredients, easy select and add.',
      ],
    },*/
    {
      type: 'text',
      heading: 'Try the live demo',
      content: [
        'The full loop is live and interactive — save a recipe, plan a week, create a grocery list, and share it in one link. Open the running app from the "Try the live demo" button at the top of this page.',
      ],
    },
    /*{
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
    },*/
  ],

  images: [],

  // In dev, point at the local cookstash server (port 3001).
  // NODE_ENV is statically inlined by Next.js at build time.
  link:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'https://meal-prep.jasminehoang.com',
};
