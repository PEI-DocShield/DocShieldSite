import type { AnonymizationMode, FileStatus, ProcessingStage } from '../types';

export const STAGE_LABELS: Record<ProcessingStage, string> = {
  extraction: 'Text extraction',
  detection: 'Entity detection',
  protection: 'Apply protection',
};

const AUTOMATIC_STAGES: ProcessingStage[] = ['extraction', 'detection', 'protection'];
const MANUAL_STAGES: ProcessingStage[] = ['extraction'];

/** The stages every file goes through for the given mode. */
export const stagesFor = (mode: AnonymizationMode) => (mode === 'manual' ? MANUAL_STAGES : AUTOMATIC_STAGES);

/** Share (0–1) of a single file that is finished, from the number of completed stages. */
function fileFraction(status: FileStatus, stages: ProcessingStage[]) {
  return status === 'done' ? 1 : stages.indexOf(status) / stages.length;
}

/**
 * Overall batch progress (0–100): completed stages across all files, weighted by `weights`
 * (e.g. file size). It never reads 100 until every file is `done`.
 */
export function overallPercent(statuses: FileStatus[], weights: number[], stages: ProcessingStage[]) {
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total === 0) return 0;
  const finished = statuses.reduce((sum, s, i) => sum + fileFraction(s, stages) * weights[i], 0);
  const percent = (finished / total) * 100;
  return statuses.every((s) => s === 'done') ? 100 : Math.min(99, percent);
}
