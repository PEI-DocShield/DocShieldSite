import { FileText } from 'lucide-react';
import { anonymizedName } from '../../../lib/anonymize';
import type { SampleDocument } from '../../../types';
import { Dropdown } from '../../ui/Dropdown';
import { card } from '../../ui/styles';

interface Props {
  docs: SampleDocument[];
  activeDocId: string;
  onDocChange: (id: string) => void;
}

/** The title card: the page title and the switcher for which anonymized file is shown below. */
export function ConclusionHeader({ docs, activeDocId, onDocChange }: Props) {
  return (
    <section className={card}>
      <h1 className="text-3xl font-bold tracking-[-0.025em]">Ready to download</h1>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-line pt-3">
        <FileText size={17} className="text-teal-600" />
        <div className="max-w-full">
          <Dropdown
            variant="plain"
            wideFrom="left"
            label="Switch file"
            value={activeDocId}
            onChange={onDocChange}
            options={docs.map((d) => ({ id: d.id, label: anonymizedName(d.name) }))}
          />
        </div>
      </div>
    </section>
  );
}
