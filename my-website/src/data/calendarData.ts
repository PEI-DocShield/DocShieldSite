export interface MilestonePhase {
  date: string;
  tasks: string[];
}

export interface MilestoneItem {
  id: string;
  name: string;
  link: string;
  phases: MilestonePhase[];
}

export const calendarData: MilestoneItem[] = [
  {
    id: 'milestone-1',
    name: 'M1',
    link: '/docs/milestones/milestone1',
    phases: [
      {
        date: '22 - 29 September',
        tasks: [
          'Context',
          'Communication Plan',
          'Tools Study',
          'Problems and goals',
          'Tasks Definition',
          'Project Calendar',
          'Microsite',
          'Presentation',
        ]
      }
    ]
  },
  {
    id: 'milestone-2',
    name: 'M2',
    link: '#milestone-2',
    phases: [
      {
        date: '30 september - 13 october',
        tasks: [
          'Requirements Gathering',
          'Personas',
          'User Stories',
          'Deployment Diagram',
          'Domain Model',
          'First Mockups',
          'Presentation',
        ]
      }
    ]
  },
  {
    id: 'milestone-3',
    name: 'M3',
    link: '#milestone-3',
    phases: [
      {
        date: '14 october - 3 november',
        tasks: [
          'Security',
          'Privacy Politics - RGPD',
          'Risks Analysis',
          'Technical risks',
          'Negotiation Plan',
          'Presentation',
        ]
      }
    ]
  },
  {
    id: 'milestone-4',
    name: 'M4',
    link: '#milestone-4',
    phases: [
      {
        date: '4 november - 15 december',
        tasks: [
          'To be defined...'
        ]
      }
    ]
  },
  {
    id: 'milestone-4+',
    name: 'M4+',
    link: '#milestone-4+',
    phases: [
      {
        date: '16 december+',
        tasks: [
          'To be defined...'
        ]
      }
    ]
  }
];
