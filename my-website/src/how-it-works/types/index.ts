export type Step = 'upload' | 'processing' | 'review' | 'conclusion';

export type AnonymizationMode = 'automatic' | 'manual';
export type ProtectionMethod = 'replacement' | 'suppression' | 'hashing';
export type ReviewMode = 'automatic' | 'manual';

export type EntityType = 'PERSON' | 'ORG' | 'DATE' | 'EMAIL' | 'PHONE' | 'ADDRESS' | 'CUSTOM';

/**
 * detected  – auto-found, not yet reviewed (replacement shown)
 * confirmed – reviewer agreed with the detection (replacement shown)
 * manual    – mask added by hand (replacement shown)
 * rejected  – false positive, original text shown
 * reverted  – deliberately revealed, original text shown
 */
export type EntityState = 'detected' | 'confirmed' | 'manual' | 'rejected' | 'reverted';

export interface Entity {
  id: string;
  docId: string;
  text: string;
  type: EntityType;
  token: string;
  confidence: number | null;
  state: EntityState;
  method: ProtectionMethod;
  customReplacement?: string;
  position?: { paragraph: number; start: number };
}

export interface SampleDocument {
  id: string;
  name: string;
  format: 'PDF' | 'DOCX' | 'TXT';
  sizeKb: number;
  pages: number;
  title: string;
  meta: string;
  paragraphs: string[];
}

export interface UploadedFile {
  id: string;
  name: string;
  format: string;
  sizeKb: number;
  pages: number;
}

export interface Settings {
  mode: AnonymizationMode;
  method: ProtectionMethod;
  language: string;
}

/** The stages a file goes through while it is processed, in order. */
export type ProcessingStage = 'extraction' | 'detection' | 'protection';

/** Where a file currently is: the stage it is running, or `done` once it is ready for review. */
export type FileStatus = ProcessingStage | 'done';
