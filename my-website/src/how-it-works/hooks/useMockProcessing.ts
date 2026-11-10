import { useEffect, useState } from 'react';
import type { FileStatus, ProcessingStage } from '../types';

/** Relative time a file spends in each stage. */
const STAGE_WEIGHT: Record<ProcessingStage, number> = { extraction: 30, detection: 40, protection: 30 };

/** Larger files take longer. */
const durationFor = (sizeKb: number) => 1800 + sizeKb * 10;

/**
 * MOCK of the processing backend. Reports, per file id, which stage it is in and when it is `done`.
 * Replace this hook with a real client (polling or SSE) returning the same `Record<id, FileStatus>`;
 * nothing else in the UI depends on timers.
 */
export function useMockProcessing(docs: { id: string; sizeKb: number }[], stages: ProcessingStage[]) {
  const key = docs.map((d) => `${d.id}:${d.sizeKb}`).join(',') + '|' + stages.join(',');
  const [statuses, setStatuses] = useState<Record<string, FileStatus>>(() => Object.fromEntries(docs.map((d) => [d.id, stages[0]])));

  useEffect(() => {
    const timers: number[] = [];
    const totalWeight = stages.reduce((sum, s) => sum + STAGE_WEIGHT[s], 0);
    for (const doc of docs) {
      let elapsed = 0;
      stages.forEach((stage, i) => {
        elapsed += (STAGE_WEIGHT[stage] / totalWeight) * durationFor(doc.sizeKb);
        const next: FileStatus = stages[i + 1] ?? 'done';
        timers.push(window.setTimeout(() => setStatuses((prev) => ({ ...prev, [doc.id]: next })), elapsed));
      });
    }
    return () => timers.forEach(window.clearTimeout);
    // `key` captures docs and stages by value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return statuses;
}
