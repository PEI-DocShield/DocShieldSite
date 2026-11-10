import type { AnonymizationMode, ProtectionMethod } from '../../../types';

/** File extensions the drop area takes. */
export const ACCEPTED = ['pdf', 'txt', 'docx'];

export const MODES: { id: AnonymizationMode; label: string; hint: string }[] = [
  { id: 'automatic', label: 'Automatic', hint: 'It finds entities and applies your selected method. Review afterward.' },
  { id: 'manual', label: 'Manual', hint: 'Opens manual editing with the original text intact.' },
];

/** The sentence the protection method examples are applied to. */
export const EXAMPLE_ORIGINAL = 'John Smith lives in Lisbon.';

export const METHODS: { id: ProtectionMethod; label: string; hint: string; example: string }[] = [
  {
    id: 'replacement',
    label: 'Replacement / tokenization',
    hint: 'Swaps each sensitive value for a consistent token.',
    example: '[PERSON_01] lives in [LOCATION_01].',
  },
  {
    id: 'suppression',
    label: 'Suppression',
    hint: 'Blacks out sensitive text completely.',
    example: '█████ lives in █████.',
  },
  {
    id: 'hashing',
    label: 'Hashing',
    hint: 'Swaps each sensitive value for a one-way hashed code.',
    example: '#3f9a1c2e lives in #b71d04aa.',
  },
];

export const LANGUAGES = ['English', 'Portuguese'].map((l) => ({ id: l, label: l }));
