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
    badgeTitle: 'Reunião 1',
    topic: 'Kickoff & Planeamento Milestone 1',
    date: '22 de Setembro de 2026',
    duration: '⏱ 67 min',
    location: 'Discord',
    topicsDiscussed: [
      'Definição das diretrizes de comunicação do projeto.',
      'Estruturação do repositório no GitHub Organization.',
      'Distribuição de tarefas para a Milestone 1.',
    ],
    actionItems: [
      { assignee: 'João & Tiago', task: 'Construção e refinamento do website DocShield.' },
      { assignee: 'Mª Inês', task: 'Configuração da GitHub Organization e permissões.' },
      { assignee: 'Eduardo & Mª Inês', task: 'Elaboração do relatório de Estado da Arte.' },
    ],
    attendees: 'Tiago Vale, João Silva, Bernardo Coelho, Mª Inês Gonçalves, Eduardo Laranjeiro',
  },
  {
    id: 2,
    badgeTitle: 'Reunião 2',
    topic: 'Revisão de Arquitetura & Preparação da Apresentação',
    date: '25 de Setembro de 2026',
    duration: '⏱ 60 min',
    location: 'Sala B1.02',
    topicsDiscussed: [
      'Validação do design e layout responsivo do website.',
      'Finalização dos diagramas de fluxo do processamento de documentos.',
      'Divisão das partes de apresentação em PowerPoint.',
    ],
    actionItems: [
      { assignee: 'Todos', task: 'Ensaio geral da apresentação antes do prazo da M1.' },
      { assignee: 'Eduardo & Mª Inês', task: 'Anexo da documentação do Estado da Arte.' },
    ],
    attendees: 'Tiago Vale, João Silva, Bernardo Coelho, Mª Inês Gonçalves, Eduardo Laranjeiro',
  },
];
