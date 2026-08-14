import type { ProjectData } from './types';

// NOTE: image paths below are placeholders following the mp- naming convention
// (e.g. '/case-study/dermago/dg-...'). Swap in real exports from your Figma file
// or the PDF screenshots before publishing — none of these assets exist yet.

export const dermago: ProjectData = {
  slug: 'dermago',
  title: 'Designing an asynchronous telemedicine app that turns a photo and a symptom into a diagnosis, no waiting room required',
  overviewHeadline: 'Dermago',
  services: [
    'Product Strategy',
    'UX Research & Usability Testing',
    'Service & Interaction Design',
    'Design Systems',
    'Accessibility & Mobile-First Design',
    'Cross-functional Facilitation',
  ],
  platforms: ['Mobile App (Patient)', 'Web Dashboard (Doctor)', 'Responsive, Mobile-First'],
  industry: 'Digital Health & Teledermatology',
  description:
    "A rash. A photo. A three-week wait for a five-minute appointment. Dermago replaces that wait with an asynchronous, chat-based consult — a patient submits photos and symptoms, a dermatologist reviews on their own schedule, and a diagnosis comes back without either side ever needing to be online at the same time.",

  sections: [
    {
      type: 'text',
      layout: 'split',
      heading: 'What is Dermago?',
      content: [
        'Dermago is an asynchronous, chat-based telemedicine app built for ORO Health, a Montreal dermatology and aesthetic care provider. A patient submits a consultation — photos of the skin concern, a description of symptoms, a treatment preference — and a licensed dermatologist reviews the case at their convenience, then returns a diagnosis, a treatment plan, and medical advice, all inside the app. In its first rollout, the product scaled across four Canadian provinces.',
        "By replacing the real-time appointment with an asynchronous review loop, Dermago closes the gap between “I have a skin concern” and “a doctor has seen it” — without either side needing to be available at the same moment.",
      ],
    },
    {
      type: 'text',
      layout: 'split',
      heading: 'Challenges',
      content: [
        "Telemedicine itself was not a hard sell — 63% of the patients we surveyed already understood the concept going in. The real challenge was trust: getting someone to hand over photos of a skin condition, personal symptoms, and a payment to a doctor they'd never meet in real time, with no live interaction to reassure them along the way. That trust had to be built entirely through the design of the intake itself.",
      ],
    },
    {
      type: 'section-group',
      heading: 'Research Approach',
    },
    {
      type: 'text-image',
      heading: 'Competitive analysis, to map the telehealth landscape',
      content: [
        'I benchmarked leading telehealth platforms to find UX patterns, industry trends, and gaps worth designing into. Most competitors optimized for one thing: getting a patient to a live appointment faster. Almost none of them optimized the async path — the intake itself, the information a doctor actually needs to diagnose without a call.',
        'That gap became the brief: the opportunity was not a faster booking flow, it was a smarter intake — one structured enough that a doctor could diagnose confidently from photos and text alone.',
      ],
      image: '/case-study/dermago/dg-competitive-landscape.svg',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'User and stakeholder research, to separate the concept from the execution',
      content: [
        "I ran a patient survey and interviews to understand onboarding expectations, trust factors, and pain points around asynchronous care, alongside stakeholder interviews across three lenses at once — business and strategy, clinical and medical workflow, and technical and platform constraints — because in healthcare, 'efficient' means something different to each of those groups, and the design had to satisfy all three, not just the loudest one.",
        "The finding that reframed the whole project: 63% of patients were already familiar with telehealth, but 82% struggled with onboarding, and only 37% completed a consultation successfully. The concept was accepted. The execution was losing people.",
      ],
      image: '/case-study/dermago/dg-research-synthesis.svg',
      layout: 'left',
    },
    {
      type: 'list',
      heading: 'Business priorities, pain points, and the resulting opportunity',
      items: [
        {
          summary: 'Business wanted speed and retention, not just satisfaction.',
          body: "ORO's stated priorities were reducing consultation time per case and increasing patient retention — the product had to serve clinic throughput, not only individual patient experience.",
        },
        {
          summary: "Doctors' time was going to back-and-forth, not diagnosis.",
          body: "The sharpest pain point in the existing workflow was repetitive back-and-forth inquiry that consumed doctors' time before a diagnosis could even be given — the bottleneck was information gathering, not medical judgment.",
        },
        {
          summary: 'The fix was structure, not more doctors.',
          body: 'The opportunity that fell out of both was a smarter intake — structured clinical templates for common dermatologic diagnoses — built to capture what a doctor needed on the first pass, not the fifth follow-up message.',
        },
      ],
    },
    {
      type: 'quote',
      content:
        "Patients with non-urgent skin conditions have no fast, trustworthy way to reach a dermatologist — so care gets delayed, frustration builds, and doctors stay buried in routine cases that crowd out the complex ones that actually need them.",
    },
    {
      type: 'stats',
      heading: 'Two verified personas, designed for in parallel',
      stats: [
        { value: 'Patient — Marie', label: 'Tech-savvy, time-poor', note: 'Wants a fast, accurate remote diagnosis, without an unnecessary in-person visit for something a photo could resolve.' },
        { value: 'Patient need', label: 'Frictionless access', note: 'Long intake forms, unclear steps, and delayed responses read as reasons to abandon, not reasons to trust.' },
        { value: 'Doctor — Emilie', label: 'Busy, unpredictable schedule', note: 'Needs an asynchronous tool to review, diagnose, and treat cases whenever her schedule allows, not on a fixed clinic clock.' },
        { value: 'Doctor need', label: 'Less repetition, more capacity', note: 'Real-time appointments and repetitive follow-up questions eat into the hours she needs for complex cases.' },
      ],
    },
    {
      type: 'list',
      heading: 'Problem statement',
      items: [
        {
          summary: 'Care that is easy to need, but hard to reach.',
          body: 'Patients seeking treatment for common skin conditions face lengthy wait times and limited access to dermatological expertise, which turns into delayed care and mounting frustration before a doctor is ever involved.',
        },
        {
          summary: "Doctors' time gets spent on routine, not complexity.",
          body: 'Providers are overwhelmed with routine consultations that could be handled more efficiently, which crowds out the time and attention that genuinely complex, in-person cases require.',
        },
        {
          summary: 'The inefficiency compounds on both sides.',
          body: 'This is not two separate problems — patients experience treatment delays while providers struggle with capacity and productivity, and each side makes the other worse.',
        },
      ],
    },
    {
      type: 'section-group',
      heading: 'Design Approach',
    },
    {
      type: 'text',
      heading: 'Scoped around two roles sharing one loop',
      content: [
        "The product only works if two very different clocks stay in sync: a patient's, and a doctor's. So I ideated for each role separately before designing the shared loop between them. For patients, the HMW was: how might we make onboarding seamless and intuitive enough to reduce friction for first-time users, so they engage deeper and longer? For doctors, it was: how might we support dermatologists in handling their caseload and delivering consistent diagnoses at their convenience, by reducing repetitive tasks?",
        'The shared loop those two answers had to plug into: a patient submits photos, symptoms, and a treatment preference; the app securely stores the case and assigns it to an available doctor by specialty and availability; the doctor reviews and prescribes a plan; the patient receives it, follows it, and can follow up if needed.',
      ],
    },
    {
      type: 'image',
      image: '/case-study/dermago/dg-app-concept-flow.svg',
    },
    {
      type: 'journey',
      heading: "Design followed two different clocks",
      content:
        "Mapping each role's actual path surfaced where trust and time were being lost — the intake form for patients, and case history for doctors. Those two moments became the decisions the design had to get right.",
      scenarios: [
        {
          title: 'Scenario 1 — Marie submits a consultation',
          context: 'Tech-savvy, time-poor. A skin concern that does not feel urgent enough for a clinic visit, but persistent enough to want answers.',
          steps: [
            { stage: 'Discover', action: 'Notices a skin concern and looks for a faster option than booking a walk-in or waiting weeks for a dermatologist referral.', feeling: 'Hopeful — "there has to be a faster way."' },
            { stage: 'Onboard', action: 'Opens Dermago and walks through a guided introduction to what the app does, before any account is required.', feeling: 'Curious, not yet committed.' },
            { stage: 'Submit', action: 'Uploads photos, describes symptoms and a treatment preference, creates an account, and pays.', feeling: 'Willing, but the form is long.', friction: true },
            { stage: 'Wait', action: 'The case sits with an assigned dermatologist reviewing it on their own schedule.', feeling: 'Uncertain — hopes it was worth the effort.' },
            { stage: 'Receive', action: 'Gets a diagnosis and a personalized treatment plan back in the same chat thread.', feeling: 'Relieved — "that was faster than a clinic visit."' },
            { stage: 'Follow up', action: 'Messages the doctor directly if symptoms do not resolve.', feeling: 'Reassured she is not on her own after the first message.' },
          ],
        },
        {
          title: "Scenario 2 — Emilie works her caseload",
          context: 'Experienced dermatologist, unpredictable schedule. Needs to clear routine cases without losing time she needs for complex ones.',
          steps: [
            { stage: 'Start shift', action: 'Opens a consultation grid showing everything waiting, matched to her specialty and availability.', feeling: 'In control, not blindsided.' },
            { stage: 'Review', action: 'Opens one case into a focused workspace — photos, symptoms, and treatment preferences in a single view.', feeling: 'Efficient — no context switching.' },
            { stage: 'Check history', action: "Needs to confirm whether she's seen this patient before, and has to hunt through a multi-step process to find prior records.", feeling: 'Frustrated — this costs time she does not have.', friction: true },
            { stage: 'Compare progression', action: 'Can only see the current photo, with no way to see how the skin has changed since the last submission.', feeling: 'Unsure whether the treatment is even working.', friction: true },
            { stage: 'Diagnose', action: 'Writes the diagnosis and treatment plan and sends it back through the same case thread.', feeling: 'Satisfied, but wants less manual digging next time.' },
          ],
        },
      ],
      insights: [
        'Trust is built before the first photo is uploaded. Most patients already accepted the idea of telemedicine — the barrier was whether the intake itself felt safe enough to hand over health information to.',
        'Onboarding friction is a drop-off risk, not a UX nitpick. With 82% of patients struggling and only 37% completing a consultation, a long, undifferentiated form was the reason people left before a doctor ever saw the case.',
        "Doctors' bottleneck is not diagnosing — it's the digging around it. Hunting for case history and fielding repetitive follow-up questions ate the hours meant for complex cases.",
        'A single photo cannot show a treatment working. Skin conditions change over days and weeks; without a timeline, doctors were being asked to judge progress from one still frame.',
        'The fix on both sides was the same shape: less to dig through, more of it surfaced automatically, right where the decision happens.',
      ],
    },
    {
      type: 'text-image',
      heading: 'Decision: Let patients look before they commit',
      content: [
        'The strongest signal from research: patients decide whether to trust an app before they decide whether to sign up for it. So onboarding opens with a guided walkthrough of what Dermago does, followed by one simple choice — the consultation type that fits their concern — before any account is required.',
        "Sign-in is deferred until after the patient has already invested effort describing their case, not demanded upfront. The tradeoff is real: some of that early investment can be lost if a session never converts. We treated that as an acceptable cost for removing the one barrier every intake study showed was thinning the number of people who ever reached a doctor's queue.",
        'The onboarding screens also show only essential information at each step — a deliberate cut, not a default — because every extra field on screen is a reason to hesitate before a patient has decided the app is worth trusting.',
      ],
      image: '/case-study/dermago/dg-patient-onboarding.svg',
      layout: 'right',
    },
    {
      type: 'text-image',
      heading: 'Decision: Break one long form into steps a patient will actually finish',
      content: [
        "Usability testing confirmed the research: of 10 first-time users walking through profile setup, photo upload, symptoms, account creation, and payment, only 5 completed the full flow, 7 felt overwhelmed by the intake length, and 6 struggled to navigate between steps.",
        'The response was structural, not cosmetic: the single long form was split into manageable steps, primary choices were surfaced first for fast selection, and secondary fields were hidden behind progressive disclosure — shown only when relevant to what the patient had already answered.',
        "The progress bar and back button turned out to be part of the problem, not just supporting chrome — testing showed navigation confusion was compounding the form fatigue, so both were rebuilt for a clearer, more forgiving sense of where a patient was in the flow.",
      ],
      image: '/case-study/dermago/dg-progressive-intake.svg',
      layout: 'left',
    },
    {
      type: 'stats',
      heading: 'Patient testing, before → after',
      stats: [
        { value: '-71%', label: 'Fewer "overwhelming" flags', note: 'Reduction in users rating the input sections overwhelming, after splitting the form and adding progressive disclosure.' },
        { value: '+45%', label: 'More completed submissions', note: 'Increase in patients who completed payment and submission after the redesign.' },
        { value: '-33%', label: 'Faster task completion', note: 'Drop in average task completion time across the same tested flow.' },
        { value: '+42%', label: 'More positive experience ratings', note: 'Increase in patients rating the overall experience positively, post-iteration.' },
      ],
    },
    {
      type: 'text-image',
      heading: "Decision: Give doctors a workspace, not a queue",
      content: [
        "Doctors' time is the scarcest resource in this loop, so the workflow started with a consultation grid view — an overview of every request, matched to specialty and availability — that opens into a single-case workspace built to avoid context switching entirely.",
        "Testing with 4 doctors across desktop and mobile surfaced the real bottleneck: not the workspace itself, but what sat outside it. Retrieving follow-up case history took a multi-step hunt, and a single current-state photo could not show whether a treatment was actually working.",
        "The fix nested more information into the same focused view instead of adding a second list: an expanded grid with parent/child rows keeps follow-up cases inline; a new Skin Progression section adds a chronological photo timeline to each case; and consultation history was centralized into one list instead of split across two tabs. The risk was recreating the clutter the focused workspace was built to remove — resolved by keeping the extra context nested and expandable, not flattened into more rows to scan.",
      ],
      image: '/case-study/dermago/dg-doctor-workspace.svg',
      layout: 'right',
    },
    {
      type: 'stats',
      heading: 'Doctor testing, before → after (desktop / mobile)',
      stats: [
        { value: '63% → 83%', label: 'Success rate, desktop', note: 'Task success improved after the history and progression redesign.' },
        { value: '50% → 78%', label: 'Success rate, mobile', note: 'Mobile saw the larger relative gain — where context-switching cost the most before.' },
        { value: '3.1 → 4.2', label: 'Satisfaction /5, desktop', note: 'Doctor-reported satisfaction after centralizing case history.' },
        { value: '2.6 → 3.9', label: 'Satisfaction /5, mobile', note: 'Paired with average task time dropping from 5:23 to 4:45.' },
      ],
    },
    {
      type: 'image-grid',
      images: [
        '/case-study/dermago/dg-screen-onboarding.svg',
        '/case-study/dermago/dg-screen-consultation.svg',
        '/case-study/dermago/dg-screen-doctor-workflow.svg',
      ],
      captions: [
        'Patient onboarding — a guided walkthrough and consultation-type choice, before any account is required.',
        'Consultation — case details, diagnosis, and treatment plan in one chat-based thread.',
        'Doctor workflow — grid overview, focused case workspace, and skin-progression timeline.',
      ],
    },
    {
      type: 'section-group',
      heading: 'Design System & Delivery',
    },
    {
      type: 'text',
      heading: 'A design system built alongside the front end, not after it',
      content: [
        "Every screen in both flows came out of a shared, scalable design system built and maintained in step with the product's front-end architecture, so components shipped as living code, not static handoff files.",
        "Accessibility and mobile-first constraints were built into the components themselves rather than retrofitted later, since patient onboarding needed to work as reliably on a phone in bad light as a doctor's workflow needed to work on a clinic desktop. Design patterns, specs, and guidelines were documented directly to support the team adopting them, not just to describe what had already shipped.",
      ],
    },
    {
      type: 'text',
      heading: 'Delivery ran on alignment, not handoff',
      content: [
        'Stakeholder interviews ran across three lenses from day one — business and strategy, clinical and medical workflow, and technical and platform constraints — and that same three-way alignment carried through delivery: partnering directly with engineers to verify implementation matched design intent, and with the product owner to keep design decisions tied to actual priorities and roadmap, not working in parallel to them.',
        'Cross-functional workshops kept those three groups talking to each other instead of through documents, which is what let a genuinely complex, high-stakes healthcare workflow stay coherent from research through shipped iteration.',
      ],
    },
    {
      type: 'section-group',
      heading: 'Outcomes',
    },
    {
      type: 'stats',
      heading: 'From accepted concept to a working, tested product',
      stats: [
        { value: '4', label: 'Canadian provinces', note: "Scaled in Dermago's first rollout, across both patients and clinics." },
        { value: '-71%', label: 'Fewer overwhelming-intake flags', note: 'After splitting one long form into progressive, multi-step disclosure.' },
        { value: '+45%', label: 'More completed submissions', note: 'Patients reaching payment and submission after the onboarding redesign.' },
        { value: '83% / 78%', label: 'Doctor task success, desktop / mobile', note: 'Up from 63% / 50% before the workspace and history redesign.' },
        { value: '4.2 / 3.9', label: 'Doctor satisfaction, out of 5', note: 'Up from 3.1 / 2.6 after centralizing history and adding progression timelines.' },
        { value: '2', label: 'Roles designed end-to-end', note: 'Patient onboarding and consultation, and doctor caseload workflow — research through validated iteration.' },
      ],
    },
    {
      type: 'text',
      heading: 'What I learned',
      content: [
        'Stakeholder collaboration is foundational. Early alignment across business, clinical, and technical interviews kept the design grounded and strategic through every later decision, instead of needing correction after the fact.',
        'Design thinking brings clarity to complex workflows. Moving deliberately from insight to ideation to continuous testing is what made it possible to build targeted solutions for two very different users sharing one product.',
        'Testing with real users is essential, not optional. Usability testing with real doctors and patients surfaced friction — the intake length, the case-history hunt — that was not visible from the design alone, and every one of those findings became a shipped iteration.',
      ],
    },
    {
      type: 'text',
      heading: 'Explore the full case study',
      content: [
        'The complete set of final mobile and desktop screens — patient onboarding through doctor workflow — is available as a working file on request, alongside the original ORO Health case study deck.',
      ],
    },
  ],

  images: [],

  link: 'https://orohealth.me',
};
