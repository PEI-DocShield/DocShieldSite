export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  github: string;
  rotation: number;
  image?: string;
}

export const teamData: TeamMember[] = [
  {
    name: 'Bernardo Coelho',
    role: 'DevOps',
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
    role: 'Team Manager | Designer',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/inecalves',
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
    rotation: 3,
    image: '/assets/foto_vale.jpeg',
  },
];
