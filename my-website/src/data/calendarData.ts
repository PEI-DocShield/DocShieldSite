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
          'Context, Problems and Goals',
          'Microsite',
          'Tools Study',
          'Communication Plan',
          'Presentation',
          'Presentation',
          'Tasks Definition',
          'Project Calendar',
        ]
      }
    ]
  },
  {
    id: 'milestone-2',
    name: 'M2',
    link: '/docs/milestones/milestone2',
    phases: [
      {
        date: '30 september - 13 october',
        tasks: [
          'Requirements Gathering',
          'Personas',
          'User Stories',
          'Deployment Diagram',
          'Domain Model',
          'System Architecture',
          'Mockup',
          'Presentation',
        ]
      }
    ]
  },
  {
    id: 'milestone-3',
    name: 'M3',
    link: '/docs/milestones/milestone3',
    phases: [
      {
        date: '14 october - 3 november',
        tasks: [
          'Privacy Policy Definition',
          'Analysis of the Risks',
          'Technical Risks and Maintainability',
          'Negotiation Plan',
          'Frontend:  Simple page with a file input and output',
          'Backend: Simple anonymization implementation (supression)',
          'Presentation',
        ]
      }
    ]
  },
  {
    id: 'milestone-4',
    name: 'M4',
    link: '/docs/milestones/milestone4',
    phases: [
      {
        date: '4 november - 15 december',
        tasks: [
          'MVP',
          'Frontend: more anonymization techniques and other file formats options',
          'Backend: apply more anonymization techniques and processing of other file formats',
          'Simple database',
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
          'User Guide',
          'Differenciation between no login required system and full system with login: Login Page & Authentication',
          'Implementation of reverse anonymization option',
          'Expand the anonymization: Images & Multilingual support and selection of specific areas for anonymization',
          'Deployment',
          'Optimization',
          'Testing: Usability & Stress',
          'Students@DETI',
        ]
      }
    ]
  }
];
