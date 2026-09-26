export interface MilestoneItem {
  id: string;
  name: string;
  link: string;
  date: string;
  tasks: string[];
}

export const calendarData: MilestoneItem[] = [
  {
    id: 'milestone-1',
    name: 'Milestone 1',
    link: '/docs/milestones/milestone1',
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
    ],
  },
  {
    id: 'milestone-2',
    name: 'Milestone 2',
    link: '#milestone-2',
    date: '29 september - 13 october',
    tasks: [
      'Requirements Gathering',
      'Personas',
      'User Stories',
      'Deployment Diagram',
      'Domain Model',
      'First Mockups',
      'Presentation',
    ],
  },
  {
    id: 'milestone-3',
    name: 'Milestone 3',
    link: '#milestone-3',
    date: '13 october - 3 november',
    tasks: [
      'Estudo sobre regulação e proteção de dados',
      'Definição das políticas de privacidade',
      'Análise de Riscos',
      'Dívida Técnica e Manutenebilidade',
      'Negotiation Plan',
      'Presentation',
    ],
  },
  {
    id: 'milestone-4',
    name: 'Milestone 4',
    link: '#milestone-4',
    date: '3 november - 15 december',
    tasks: [
      'To be defined...'
    ],
  },
  {
    id: 'milestone-4+',
    name: 'Milestone 4+',
    link: '#milestone-4+',
    date: '15 december+',
    tasks: [
      'To be defined...'
    ],
  },
];
