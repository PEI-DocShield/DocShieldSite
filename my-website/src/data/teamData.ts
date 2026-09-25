export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  github: string;
  rotation: number;
}

export const teamData: TeamMember[] = [
  {
    name: 'Bernardo Coelho',
    role: 'Developer',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/Bernardo2409',
    rotation: 2,
  },
  {
    name: 'Eduardo Laranjeiro',
    role: 'Developer',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/EduWo18',
    rotation: -3,
  },
  {
    name: 'Mª Inês Gonçalves',
    role: 'Design Manager',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/inecalves',
    rotation: 1,
  },
  {
    name: 'João Silva',
    role: 'Developer',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/ojuoumua',
    rotation: -2,
  },
  {
    name: 'Tiago Vale',
    role: 'Developer',
    bio: 'DocShield team member, working on platform development.',
    github: 'https://github.com/tiagofcvale',
    rotation: 3,
  },
];
