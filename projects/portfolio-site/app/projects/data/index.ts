export type { StatItem, JourneyStep, JourneyScenario, ContentSection, ProjectData, ImageAspectRatio } from './types';

import type { ProjectData } from './types';
import { designSystem } from './design-system';
import { designSystemDraft } from './design-system-draft';
import { cookstashVer1 } from './cookstash-ver1';
import { cookstashVer2 } from './cookstash-ver2';
import { ecommercePlatform } from './ecommerce-platform';
import { datalabDashboard } from './datalab-dashboard';
import { portfolioWebsite } from './portfolio-website';
import { dermago } from './dermago';

// To add a new project: create data/<slug>.ts, import it here, add one line below.
export const projects: Record<string, ProjectData> = {
  'design-system': designSystem,
  'design-system-draft': designSystemDraft,
  'cookstash-ver1': cookstashVer1,
  'cookstash-ver2': cookstashVer2,
  'ecommerce-platform': ecommercePlatform,
  'datalab-dashboard': datalabDashboard,
  'portfolio-website': portfolioWebsite,
  'dermago': dermago,
};
