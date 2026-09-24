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
    name: 'M1-Inception',
    link: '#milestone-1',
    date: '22/09/2026 – 29/09/2026',
    tasks: [
      'Discord Group for Project communication',
      'Project Website (João, Tiago)',
      'Github Organization (Inês)',
      'State-of-the-art and Context (Eduardo, Inês)',
      'M1 Powerpoint presentation',
    ],
  },
];
