import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { LoadContext, Plugin } from '@docusaurus/types';

interface MilestonePhase {
  date: string;
  tasks: string[];
}

interface MilestoneData {
  id: string;
  name: string;
  link: string;
  order: number;
  phases: MilestonePhase[];
}

export default function milestonesPlugin(context: LoadContext): Plugin<MilestoneData[]> {
  return {
    name: 'docusaurus-plugin-milestones',

    getPathsToWatch() {
      const milestonesDir = path.join(context.siteDir, 'docs', 'milestones');
      if (!fs.existsSync(milestonesDir)) return [];
      return fs.readdirSync(milestonesDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => path.join(milestonesDir, f));
    },

    async loadContent(): Promise<MilestoneData[]> {
      const milestonesDir = path.join(context.siteDir, 'docs', 'milestones');

      if (!fs.existsSync(milestonesDir)) {
        return [];
      }

      const files = fs.readdirSync(milestonesDir).filter((f) => f.endsWith('.md'));
      const milestones: MilestoneData[] = [];

      for (const file of files) {
        const filePath = path.join(milestonesDir, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(raw);

        // Only include files that have milestone frontmatter data
        if (data.milestone_name && data.phases) {
          const docId = data.id || path.basename(file, '.md');
          milestones.push({
            id: docId,
            name: data.milestone_name,
            link: `/docs/milestones/${docId}`,
            order: data.order ?? 99,
            phases: data.phases,
          });
        }
      }

      // Sort by order field
      milestones.sort((a, b) => a.order - b.order);
      return milestones;
    },

    async contentLoaded({ content, actions }): Promise<void> {
      const { setGlobalData } = actions;
      setGlobalData({ milestones: content });
    },
  };
}
