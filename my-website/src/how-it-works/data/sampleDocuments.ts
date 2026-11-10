import type { Entity, EntityType, ProtectionMethod, ReviewMode, SampleDocument, UploadedFile } from '../types';

// Static content standing in for what the backend pipeline (text extraction +
// NLP detection engine) would return. No file content is ever sent anywhere.

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'client-intake',
    name: 'Client-intake.pdf',
    format: 'PDF',
    sizeKb: 284,
    pages: 1,
    title: 'Client intake summary',
    meta: 'Confidential · Service agreement · Page 1 of 1',
    paragraphs: [
      'This intake records the onboarding of Maya Chen with Northwind Analytics. The agreement was received on 12 March 2026.',
      'Please send the welcome pack to maya.chen@northwind.io or contact the client at +351 912 345 678. The correspondence address is Rua das Flores 42, Porto.',
      'The designated account contact, Daniel Ortiz, will coordinate the first meeting on 3 April 2026.',
      'Scope of service\nThe team will prepare an onboarding checklist, confirm service requirements, and schedule a follow-up. This summary may be shared with the operations team after personal information has been protected.',
    ],
  },
  {
    id: 'contact-notes',
    name: 'Contact-notes.docx',
    format: 'DOCX',
    sizeKb: 142,
    pages: 1,
    title: 'Contact notes',
    meta: 'Internal · Call log · Page 1 of 1',
    paragraphs: [
      'Follow-up call regarding the onboarding file. Sofia Marques from the finance department asked to be added as the billing contact.',
      'She can be reached at sofia.marques@mail.pt or by phone on +351 934 210 557.',
      'Invoices should be posted to Avenida da Liberdade 110, Lisboa, starting next quarter.',
      'Action items\nShare the signed agreement with finance and confirm the billing cycle before the first invoice is issued.',
    ],
  },
];

type Detection = [docId: string, text: string, type: EntityType, confidence: number];

const DETECTIONS: Detection[] = [
  ['client-intake', 'Maya Chen', 'PERSON', 99],
  ['client-intake', 'Northwind Analytics', 'ORG', 94],
  ['client-intake', '12 March 2026', 'DATE', 98],
  ['client-intake', 'maya.chen@northwind.io', 'EMAIL', 98],
  ['client-intake', '+351 912 345 678', 'PHONE', 97],
  ['client-intake', 'Rua das Flores 42, Porto', 'ADDRESS', 92],
  ['client-intake', 'Daniel Ortiz', 'PERSON', 99],
  ['client-intake', '3 April 2026', 'DATE', 95],
  ['contact-notes', 'Sofia Marques', 'PERSON', 97],
  ['contact-notes', 'sofia.marques@mail.pt', 'EMAIL', 96],
  ['contact-notes', '+351 934 210 557', 'PHONE', 98],
  ['contact-notes', 'Avenida da Liberdade 110, Lisboa', 'ADDRESS', 94],
];

export const TYPE_LABELS: Record<EntityType, string> = {
  PERSON: 'Name',
  ORG: 'Organization',
  DATE: 'Date',
  EMAIL: 'Email',
  PHONE: 'Phone',
  ADDRESS: 'Address',
  CUSTOM: 'Custom',
};

export const TYPE_PLURALS: Record<EntityType, string> = {
  PERSON: 'Names',
  ORG: 'Organizations',
  DATE: 'Dates',
  EMAIL: 'Emails',
  PHONE: 'Phones',
  ADDRESS: 'Addresses',
  CUSTOM: 'Custom masks',
};

/** Next consistent token for a type, e.g. PERSON_03. */
export function nextToken(type: EntityType, existing: Entity[]): string {
  const count = existing.filter((e) => e.type === type).length + 1;
  return `${type}_${String(count).padStart(2, '0')}`;
}

/** Simulates the NLP detection engine output for the sample documents. */
export function detectEntities(method: ProtectionMethod, reviewMode: ReviewMode): Entity[] {
  const entities: Entity[] = [];
  DETECTIONS.forEach(([docId, text, type, confidence], i) => {
    entities.push({
      id: `e${i + 1}`,
      docId,
      text,
      type,
      token: nextToken(type, entities),
      confidence,
      state: reviewMode === 'automatic' ? 'confirmed' : 'detected',
      method,
    });
  });
  return entities;
}

export const DEFAULT_FILES: UploadedFile[] = SAMPLE_DOCUMENTS.map((d) => ({
  id: d.id,
  name: d.name,
  format: d.format,
  sizeKb: d.sizeKb,
  pages: d.pages,
}));
