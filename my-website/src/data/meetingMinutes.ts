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
    topic: 'Project Kickoff & Milestone 1 Planning',
    date: 'Sept 22, 2026',
    duration: '⏱ 45 min',
    location: 'Discord',
    topicsDiscussed: [
      'Established project communication guidelines & Discord channels.',
      'Defined initial repository architecture and GitHub Organization.',
      'Assigned primary responsibilities for Milestone 1 deliverables.',
    ],
    actionItems: [
      { assignee: 'João & Tiago', task: 'Build and refine DocShield website.' },
      { assignee: 'Mª Inês', task: 'Configure GitHub Organization & permissions.' },
      { assignee: 'Eduardo & Mª Inês', task: 'Draft State-of-the-Art report.' },
    ],
    attendees: 'Tiago Vale, João Silva, Bernardo Coelho, Mª Inês Gonçalves, Eduardo Laranjeiro',
  },
  {
    id: 2,
    badgeTitle: 'Meeting 2',
    topic: 'Architecture Review & Presentation Prep',
    date: 'Sept 25, 2026',
    duration: '⏱ 60 min',
    location: 'Room B1.02',
    topicsDiscussed: [
      'Reviewed website design, responsive layouts, and wave animation.',
      'Finalized document processing workflow diagrams.',
      'Structured PowerPoint presentation deck & speaking parts.',
    ],
    actionItems: [
      { assignee: 'All', task: 'Conduct dry-run presentation prior to M1 deadline.' },
      { assignee: 'Eduardo & Mª Inês', task: 'Attach State-of-the-Art documentation.' },
    ],
    attendees: 'Tiago Vale, João Silva, Bernardo Coelho, Mª Inês Gonçalves, Eduardo Laranjeiro',
  },
];
