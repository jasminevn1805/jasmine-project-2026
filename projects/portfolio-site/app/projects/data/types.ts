export interface StatItem {
  value: string;
  label: string;
  note?: string;
}

export interface JourneyStep {
  stage: string;
  action: string;
  feeling: string;
  friction?: boolean; // true = a pain point / emotional low
}

export interface JourneyScenario {
  title: string;
  context?: string;
  steps: JourneyStep[];
}

export interface ListItem {
  summary: string;
  body: string | string[];
}

export interface ContentSection {
  type: 'text' | 'image' | 'text-image' | 'image-grid' | 'quote' | 'stats' | 'journey' | 'list' | 'list-image' | 'section-group';
  heading?: string;
  groupNumber?: number;
  content?: string | string[];
  items?: ListItem[];
  stats?: StatItem[];
  scenarios?: JourneyScenario[];
  insights?: string[];
  image?: string;
  images?: string[];
  captions?: string[];
  layout?: 'left' | 'right' | 'split';
}

export interface ProjectData {
  slug: string;
  title: string;
  overviewHeadline?: string;
  services: string[];
  platforms: string[];
  industry: string;
  description: string;
  sections: ContentSection[];
  images: string[];
  imageLabels?: string[];
  link?: string;
  github?: string;
}
