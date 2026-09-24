export interface DocCardItem {
  id: string;
  category: 'guide' | 'tech' | 'api' | 'security';
  badgeLabel: string;
  badgeClass?: string;
  title: string;
  desc: string;
  link: string;
  icon: 'guide' | 'tech' | 'security' | 'api';
}

export const docsData: DocCardItem[] = [
  {
    id: '1',
    category: 'guide',
    badgeLabel: 'Guide',
    title: 'Getting Started & Installation',
    desc: 'Step-by-step instructions on setting up DocShield, configuring environment variables, and running initial document anonymizations.',
    link: '/docs/getting-started',
    icon: 'guide',
  },
  {
    id: '2',
    category: 'tech',
    badgeLabel: 'Technical',
    badgeClass: 'tech',
    title: 'Architecture & Processing Pipeline',
    desc: 'Detailed breakdown of the NER (Named Entity Recognition) models, OCR ingestion, regex rules, and document redaction pipeline.',
    link: '/docs/architecture',
    icon: 'tech',
  },
  {
    id: '3',
    category: 'tech',
    badgeLabel: 'Security',
    badgeClass: 'security',
    title: 'GDPR & Data Privacy Standards',
    desc: 'Comprehensive overview of DocShield\'s zero-retention policy, client-side encryption mechanisms, and regulatory compliance standards.',
    link: '/docs/security',
    icon: 'security',
  },
  {
    id: '4',
    category: 'api',
    badgeLabel: 'API / CLI',
    badgeClass: 'api',
    title: 'REST API & CLI References',
    desc: 'Complete API endpoint specifications, authentication tokens, request/response schemas, and command-line usage examples.',
    link: '/docs/api',
    icon: 'api',
  },
];
