import { FileText, X } from 'lucide-react';
import { cn } from '../../../lib/cn';
import type { UploadedFile } from '../../../types';
import { IconButton } from '../../ui/Button';
import { muted } from '../../ui/styles';

interface Props {
  files: UploadedFile[];
  onRemove: (id: string) => void;
  className?: string;
}

/** The uploaded files: three rows show at a time and the rest scroll inside. */
export function FileList({ files, onRemove, className }: Props) {
  const totalKb = files.reduce((sum, f) => sum + f.sizeKb, 0);

  // Always reserves room for the file count and three rows, so the card keeps one height whatever the files.
  return (
    <div className={cn('flex min-h-52 flex-col gap-3', className)}>
      {files.length > 0 && (
        <>
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <strong className="text-sm">
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </strong>
            <span className={muted}>{totalKb} KB</span>
          </div>
          <ul className="max-h-42 overflow-y-auto">
            {files.map((f) => (
              <li key={f.id} className="flex h-14 items-center gap-3">
                <FileText size={20} className="text-teal-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-md font-semibold">{f.name}</div>
                  <div className={muted}>
                    {f.format} · {f.sizeKb} KB
                  </div>
                </div>
                <IconButton aria-label={`Remove ${f.name}`} onClick={() => onRemove(f.id)}>
                  <X size={15} />
                </IconButton>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
