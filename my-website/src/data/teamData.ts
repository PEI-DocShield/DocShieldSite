export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  github: string;
  linkedin?: string;
  rotation: number;
  image?: string;
}

export const teamData: TeamMember[] = [
  {
    name: 'Bernardo Coelho',
    role: 'QA',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/Bernardo2409',
    rotation: 2,
    image: '/assets/foto_bernardo.jpeg',
  },
  {
    name: 'Eduardo Laranjeiro',
    role: 'Architect',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/EduWo18',
    rotation: -3,
    image: '/assets/foto_edu.jpeg',
  },
  {
    name: 'Mª Inês Gonçalves',
    role: 'Team Manager',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/inecalves',
    linkedin: 'https://www.linkedin.com/in/in%C3%AAs-gon%C3%A7alves-67a65636a/',
    rotation: 1,
    image: '/assets/foto_ines.jpeg',
  },
  {
    name: 'João Silva',
    role: 'DevOps',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/ojuoumua',
    rotation: -2,
    image: '/assets/foto_joao.jpeg',
  },
  {
    name: 'Tiago Vale',
    role: 'Product Owner | DPO',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/tiagofcvale',
    linkedin: 'https://www.linkedin.com/in/tiagofcvale/',
    rotation: 3,
    image: '/assets/foto_vale.jpeg',
  },
];
