export interface MeetingMinute {
  id: number;
  badgeTitle: string;
  topic: string;
  date: string;
  duration: string;
  location: string;
  topicsDiscussed: string[];
  actionItems: Array<{ assignee: string; task: string }>;
  attendees: string;
}

export const meetingMinutesData: MeetingMinute[] = [
  {
    id: 1,
    badgeTitle: 'Meeting 1',
    topic: 'Kickoff & Milestone 1 Planning',
    date: 'September 22, 2026',
    duration: '⏱ 67 min',
    location: 'Discord',
    topicsDiscussed: [
      'Definition of project communication guidelines.',
      'Structuring the repository in the GitHub Organization.',
      'Task distribution for Milestone 1.',
    ],
    actionItems: [
      { assignee: 'João & Tiago', task: 'Construction and refinement of the DocShield website.' },
      { assignee: 'Mª Inês', task: 'Setup of GitHub Organization and permissions.' },
      { assignee: 'Eduardo & Mª Inês', task: 'Preparation of the State of the Art report.' },
    ],
    attendees: 'Tiago Vale, João Silva, Bernardo Coelho, Mª Inês Gonçalves, Eduardo Laranjeiro',
  },
  {
    id: 2,
    badgeTitle: 'Meeting 2',
    topic: 'Architecture Review & Presentation Preparation',
    date: 'September 25, 2026',
    duration: '⏱ 60 min',
    location: 'Room B1.02',
    topicsDiscussed: [
      'Validation of website design and responsive layout.',
      'Finalization of document processing flowcharts.',
      'Division of PowerPoint presentation sections.',
    ],
    actionItems: [
      { assignee: 'All', task: 'Rehearsal of the presentation before M1 deadline.' },
      { assignee: 'Eduardo & Mª Inês', task: 'Attaching State of the Art documentation.' },
    ],
    attendees: 'Tiago Vale, João Silva, Bernardo Coelho, Mª Inês Gonçalves, Eduardo Laranjeiro',
  },
];
