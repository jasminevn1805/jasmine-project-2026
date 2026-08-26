import type { ProjectData } from './types';

export const datalabDashboard: ProjectData = {
  slug: 'datalab-dashboard',
  title: 'Datalab Dashboard: Turning Fragmented Data into Confident Decisions',
  overviewHeadline: 'Datalab Dashboard',
  services: ['Product Design', 'UX Research', 'Information Architecture', 'Dashboard & Data Visualization Design'],
  platforms: ['Web Dashboard', 'B2B SaaS'],
  industry: 'Spatial Data Platform (BigGeo DataLab)',
  description:
    "A single, information-dense dashboard request turned into three focused experiences. DataLab Dashboard gives BigGeo's data providers a clear view of Credit Consumption, Sales Performance, and Channel Performance — each built around the question that business area actually needs answered, sharing one consistent analytical pattern.",
  heroImage: '/case-study/datalab-dashboard/dd-hero.png',

  sections: [
    {
      type: 'text',
      layout: 'split',
      heading: "What's DataLab Dashboard?",
      content: [
        "DataLab is BigGeo's workspace for spatial data. It brings datasets, data products, and data-business workflows into one place, letting data providers manage and activate their data across BigGeo's ecosystem.",
        'The DataLab Dashboard was introduced to give data providers a quick view of their business performance across three areas: Credit Consumption — monitor credit usage and spending; Sales Performance — understand revenue and transactions; and Channel Performance — track listing engagement and conversion.',
      ],
    },
    {
      type: 'text',
      layout: 'split',
      heading: 'The Challenge',
      content:
        'Turn a broad set of business requirements into a focused dashboard experience that helps data providers understand what is happening, why it is happening, and where they may need to act.',
    },
    {
      type: 'section-group',
      heading: 'Research',
    },
    {
      type: 'list',
      heading: 'What I needed to understand',
      items: [
        {
          summary: 'What does "business health" mean to data providers?',
          body: 'Identify the information users need to monitor their business and recognize potential issues.',
        },
        {
          summary: 'How are the three business areas different?',
          body: 'Understand whether credit consumption, sales, and channel performance represent different user goals or can be meaningfully combined into one experience.',
        },
        {
          summary: 'What information needs attention first?',
          body: 'Determine which metrics are essential for an overview and which are better suited for deeper investigation.',
        },
        {
          summary: 'What context makes the data useful?',
          body: 'Identify the trends, comparisons, breakdowns, and relationships users need to interpret the numbers rather than simply read them.',
        },
      ],
    },
    {
      type: 'list',
      heading: 'From requirements to user questions',
      items: [
        {
          summary: 'Credit Consumption',
          body: 'How are my credits being consumed, and do I need to adjust?',
        },
        {
          summary: 'Sales Performance',
          body: 'How are my products performing commercially?',
        },
        {
          summary: 'Channel Performance',
          body: 'How effectively are my channels attracting and converting buyers?',
        },
      ],
    },
    {
      type: 'text',
      heading: 'Research approach',
      content:
        'I combined stakeholder interviews, product and requirement exploration, and competitive analysis to understand the business context, user needs, and information relationships before defining the dashboard structure — four methods, each answering a different question about what the dashboard needed to be.',
    },
    {
      type: 'list',
      heading: 'Four methods, four questions',
      items: [
        {
          summary: 'Stakeholder conversations',
          body: [
            '**Goal:** Understand what "business health" means to the people who actually rely on this data, and surface the constraints before defining any metrics.',
            '**Process:** Structured conversations with product, sales, and platform stakeholders, each walking through how they currently judge whether a data provider\'s account is "healthy" and what decision they\'d want the dashboard to support.',
            '**Output:** A shared list of the questions each business area actually needed answered, plus the data and credit-system constraints that would shape what could realistically be shown.',
          ],
        },
        {
          summary: 'Requirement exploration',
          body: [
            '**Goal:** Turn the original brief — "give users a quick view of statistics and highlighted information" — into something buildable.',
            '**Process:** Worked through the requirement line by line, separating it into metrics (what to measure), relationships (what connects to what), and user needs (why it matters), instead of treating it as a flat feature list.',
            '**Output:** A metrics–relationships–needs map for each business area, which is what first exposed that Credit, Sales, and Channel didn\'t share a single information hierarchy.',
          ],
        },
        {
          summary: 'Affinity mapping',
          body: [
            '**Goal:** Find the recurring questions and decision points hiding inside a large, unsorted set of requirements and stakeholder notes.',
            '**Process:** Grouped every finding from the conversations and requirement exploration onto a shared board, clustering by the underlying question being asked rather than by which stakeholder raised it.',
            '**Output:** Four recurring decision themes — current state, performance, drivers, opportunities — that became the backbone of the shared dashboard pattern used across all three experiences.',
          ],
        },
        {
          summary: 'Information mapping',
          body: [
            '**Goal:** Make sure every metric earns its place on the dashboard by tracing it back to a real user question and a real action, not just "data that exists."',
            '**Process:** Connected each clustered question to the specific metrics that answer it, the insight those metrics produce, and the action a data provider could take as a result.',
            '**Output:** A questions → metrics → insights → actions chain for each business area, which became the KPI Summary → Trend → Driver → Insights structure every dashboard follows today.',
          ],
        },
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-stakeholders-kickoff-initial-hypotheses-validate-questions.png',
      // Source is ~1.62:1, 16:10 is 1.6:1 — near-exact match, so 'cover'
      // imageDefaults: { aspectRatio: '16:10', objectFit: 'contain' },
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'list',
      heading: 'What the research found',
      items: [
        {
          summary: 'The three areas represent different jobs to be done',
          body: 'Although Credit Consumption, Sales Performance, and Channel Performance were initially grouped into one dashboard, they answer fundamentally different questions — manage resources, monitor sales, and improve acquisition. The differences were significant enough that forcing them into a single information hierarchy would make the dashboard broad, but not particularly useful for decision-making.',
        },
        {
          summary: 'Users need to understand a business area, not just see its metrics',
          body: 'The requirements contained a large number of KPIs, charts, and breakdowns, but individual metrics rarely provide enough context to support a decision. Users need to understand what is happening, how it is changing, what is driving it, and where to investigate — a common analytical pattern that could apply across the product while each area used its own relevant metrics.',
        },
        {
          summary: 'The original single-dashboard structure needed to be reconsidered',
          body: 'The combination of different questions, priorities, and analytical relationships created competing information hierarchies within one view. Rather than optimizing the layout of a single dashboard, I reframed the information architecture around the three distinct business questions.',
        },
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-IA-creation.png',
      /*imageDefaults: { aspectRatio: '16:10', objectFit: 'contain' },*/
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'quote',
      content:
        'The research shifted the project from "How do we fit all this information into one dashboard?" to "How should we structure the experience so each business question can be understood and acted on clearly?"',
    },
    {
      type: 'section-group',
      heading: 'The IA Decision',
    },
    {
      type: 'text',
      heading: 'From one dashboard to three focused experiences',
      content: [
        'Separate the three business areas into focused dashboards, while maintaining a consistent experience across DataLab.',
        'Original concept: one dashboard, three business areas. Research-driven direction: three focused dashboards, one coherent dashboard experience. This became the first major product decision — separate the experiences by business purpose while maintaining a consistent structure and interaction model across them.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-IA-structure.png',
      /*imageDefaults: { aspectRatio: '16:10', objectFit: 'contain' },*/
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'list',
      heading: 'Why this structure',
      items: [
        { summary: 'Purpose', body: 'One clear business question per experience.' },
        { summary: 'Information hierarchy', body: 'Prioritize what matters most for that context.' },
        { summary: 'Analytical relationships', body: 'Connect metrics that help explain performance.' },
        { summary: 'Action path', body: 'Help users move from overview to investigation.' },
      ],
    },
    {
      type: 'quote',
      content: 'Separate the questions. Unify the experience.',
    },
    {
      type: 'section-group',
      heading: 'Design Strategy',
    },
    {
      type: 'list',
      heading: 'The design principles',
      items: [
        {
          summary: 'Prioritize what requires attention',
          body: 'Surface important changes, trends, and exceptions before detailed information. The dashboard should help users recognize what deserves attention, not make them scan every metric equally.',
        },
        {
          summary: 'Give users context',
          body: 'Avoid presenting isolated numbers without enough information to interpret them. Pair metrics with trends, comparisons, time context, status, and related metrics — a metric becomes useful when users can understand what it means and how it is changing.',
        },
        {
          summary: 'Organize information around user questions',
          body: 'Structure information around what users are trying to understand, rather than how the underlying data or business systems are organized — organize around user mental models and decisions.',
        },
        {
          summary: 'Use progressive disclosure',
          body: 'Give users the right level of information at the right depth. Start with a concise overview, then provide increasingly detailed information for users who need to investigate — keep the initial view focused while preserving depth for exploration.',
        },
      ],
    },
    {
      type: 'quote',
      content:
        'Prioritize what matters, provide enough context to understand it, organize around user questions, and reveal detail progressively.',
    },
    {
      type: 'section-group',
      heading: 'Design Decisions',
    },
    {
      type: 'text',
      heading: 'A shared dashboard pattern',
      content: [
        'Every dashboard follows the same progression: KPI Summary, then Trend / Performance, then Driver / Breakdown, then Insights — establish the current state, provide context, explain the drivers, surface opportunities.',
        'The pattern remained consistent across the product, while the content and analytical relationships were adapted to each business area.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-dashboard-pattern.png',
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'list',
      heading: 'How the pattern maps to each dashboard',
      items: [
        {
          summary: 'Current state',
          body: 'Credit Consumption: balance, estimated spend. Sales Performance: revenue, transactions. Channel Performance: views, visitors.',
        },
        {
          summary: 'Performance',
          body: 'Credit Consumption: spending trend. Sales Performance: revenue / transaction trend. Channel Performance: listing funnel.',
        },
        {
          summary: 'Drivers',
          body: 'Credit Consumption: feature consumption. Sales Performance: product / channel. Channel Performance: listing performance.',
        },
        {
          summary: 'Insights',
          body: 'Credit Consumption: consumption patterns. Sales Performance: sales opportunities. Channel Performance: conversion opportunities.',
        },
      ],
    },
    {
      type: 'quote',
      content: 'Goal: create consistency at the experience level, not by forcing identical content into every dashboard.',
    },
    {
      type: 'section-group',
      heading: 'Deep Dive: Credit Consumption Dashboard',
    },
    {
      type: 'text',
      heading: 'Turning complex credit data into a decision-support experience',
      content: [
        'Credit Consumption brought together multiple credit types, spending metrics, forecasts, expiration information, and consumption drivers. The design challenge was to create a clear hierarchy that helps users understand their current position, recognize what requires attention, and investigate the factors behind their consumption.',
        "The information was organized around the user's decision journey rather than the underlying data structure — establishing a focused overview while preserving deeper context for investigation.",
      ],
    },
    {
      type: 'text-image',
      heading: 'Decision 1 — Establish the current credit position first',
      content: [
        'Design problem: Users need to understand their current credit situation before interpreting historical or projected consumption.',
        'Decision: Lead the experience with the most important current-state information — Balance, Estimated Spend, and Expiring Soon — with Platform and Data Credit clearly distinguished.',
        'Rationale: This gives users an immediate understanding of where they stand and surfaces information that may require attention.',
      ],
      image: '/case-study/datalab-dashboard/dd-credit-consumption-KPIs.png',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'Decision 2 — Make spending trends explain the current state',
      content: [
        'Design problem: A balance or spending figure alone does not explain whether consumption is increasing, decreasing, or likely to change.',
        'Decision: Use the spending visualization to connect actual spending, estimated spending, and balance over time.',
        'Rationale: Users can understand not only what they have spent, but how consumption is evolving and what that may mean for their remaining credits.',
      ],
      image: '/case-study/datalab-dashboard/dd-spending-trend-chart.png',
      layout: 'left',
    },
    {
      type: 'text-image',
      heading: 'Decision 3 — Surface what is driving consumption',
      content: [
        'Design problem: Knowing total consumption does not tell users what is causing it.',
        'Decision: Provide a breakdown of consumption across the key features — Adding Data, Always On, and Variant Creation.',
        'Rationale: Making the drivers visible helps users move from "What happened?" to "Why is this happening?" and identify where further investigation may be needed.',
      ],
      image: '/case-study/datalab-dashboard/dd-spending-by-features.png',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'Decision 4 — Prioritize attention without overwhelming the overview',
      content: [
        'Design problem: The dashboard contains a large amount of information, but not everything deserves equal visual weight.',
        'Decision: Use visual hierarchy and progressive disclosure to keep the primary view focused while giving secondary information enough context for deeper investigation.',
        'Rationale: Users can quickly scan the overall state of their credits without losing access to the detail needed to understand performance.',
      ],
      image: '/case-study/datalab-dashboard/dd-context-support.png',
      layout: 'left',
    },
    {
      type: 'text-image',
      heading: 'Decision 5 — Prioritize attention without overwhelming the overview',
      content: [
        'Design problem: The dashboard contains a large amount of information, but not everything deserves equal visual weight.',
        'Decision: Use visual hierarchy and progressive disclosure to keep the primary view focused while giving secondary information enough context for deeper investigation.',
        'Rationale: Users can quickly scan the overall state of their credits without losing access to the detail needed to understand performance.',
      ],
      image: '/case-study/datalab-dashboard/dd-side-dialog-drilldown.png',
      layout: 'right',
    },
    {
      type: 'text',
      heading: 'Final design of Credit Dashboard',
      content: [
        'Credit Consumption brought together multiple credit types, spending metrics, forecasts, expiration information, and consumption drivers. The design challenge was to create a clear hierarchy that helps users understand their current position, recognize what requires attention, and investigate the factors behind their consumption.',
        "The information was organized around the user's decision journey rather than the underlying data structure — establishing a focused overview while preserving deeper context for investigation.",
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-credit-dashboard.png',
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'quote',
      content:
        "Where am I? How is it changing? What's driving it? Where should I investigate? The decisions were designed to make the dashboard scannable at a glance while still supporting deeper analysis when needed.",
    },
    {
      type: 'section-group',
      heading: 'Extend the Pattern',
    },
    {
      type: 'text',
      heading: 'One design logic, adapted to three business contexts',
      content: [
        'The pattern was then adapted to the other two dashboards. Each follows a familiar path from overview to deeper understanding, while its metrics, relationships, and insights remain specific to the business question.',
        'Sales Performance — State → Trend → Analytics → Product / Sales Channel driver. Understand commercial performance, how revenue and transactions are changing, and what is contributing to sales.',
        'Channel Performance — State → Funnel → Engagement → Conversion opportunity. Understand channel activity, how users move through the listing funnel, and where conversion can be improved.',
        'This allowed the three experiences to feel like one product system without becoming three copies of the same dashboard.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-sales-dashboard.png',
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-channel-dashboard.png',
      // imageDefaults: { aspectRatio: '16:10', objectFit: 'contain' },
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'section-group',
      heading: 'The Impact',
    },
    {
      type: 'text',
      heading: 'From one dense dashboard to three focused experiences',
      content:
        'The project evolved from a single information-dense dashboard into three focused experiences aligned with distinct business questions, while maintaining a consistent analytical pattern across the product.',
    },
    {
      type: 'list',
      heading: 'User, product, and business impact',
      items: [
        {
          summary: 'User impact — less cognitive effort',
          body: 'Users can move from monitoring to investigation with less cognitive effort — understanding what is happening, why it is happening, and where to focus next.',
        },
        {
          summary: 'Product impact — extensible architecture',
          body: 'Business areas can evolve independently while remaining consistent within one product experience.',
        },
        {
          summary: 'Business impact — more proactive business management and optimization',
          body: [
            '**Credit:** Credit visibility → better resource allocation → more efficient credit usage.',
            '**Sales:** Sales visibility → identify commercial opportunities → optimize sales activity.',
            '**Channel:** Channel visibility → identify friction → improve conversion → better customer experience.',
          ],
        },
      ],
    },
    {
      type: 'section-group',
      heading: 'Final Design',
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-credit-dashboard-responsive.png',
      // imageDefaults: { aspectRatio: '16:10', objectFit: 'contain' },
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-sales-dashboard-responsive.png',
      // imageDefaults: { aspectRatio: '16:10', objectFit: 'contain' },
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/datalab-dashboard/dd-channel-dashboard-responsive.png',
      // imageDefaults: { aspectRatio: '16:10', objectFit: 'contain' },
      captions: [
        'Stakeholder interview kick-off — Round 1 working board.',
      ],
    },
  ],
  images: [],
  link: 'https://www.biggeo.com/products/datalab',
};
