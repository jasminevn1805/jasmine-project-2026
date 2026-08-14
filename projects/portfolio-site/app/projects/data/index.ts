export type { StatItem, JourneyStep, JourneyScenario, ContentSection, ProjectData } from './types';

import type { ProjectData } from './types';
import { designSystem } from './design-system';
import { designSystemDraft } from './design-system-draft';
import { mealPrepVer1 } from './meal-prep-ver1';
import { mealPrepVer2 } from './meal-prep-ver2';
import { ecommercePlatform } from './ecommerce-platform';
import { datalabDashboard } from './datalab-dashboard';
import { portfolioWebsite } from './portfolio-website';
import { dermago } from './dermago';

// To add a new project: create data/<slug>.ts, import it here, add one line below.
export const projects: Record<string, ProjectData> = {
  'design-system': designSystem,
  'design-system-draft': designSystemDraft,
  'meal-prep-ver1': mealPrepVer1,
  'meal-prep-ver2': mealPrepVer2,
  'ecommerce-platform': ecommercePlatform,
  'datalab-dashboard': datalabDashboard,
  'portfolio-website': portfolioWebsite,
  'dermago': dermago,
};
