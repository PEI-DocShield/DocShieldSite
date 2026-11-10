import { METHOD_LABELS } from '../../../lib/anonymize';
import type { Entity, ProtectionMethod, SampleDocument } from '../../../types';
import { DocumentPreview } from '../../document/DocumentPreview';

interface Props {
  doc: SampleDocument;
  entities: Entity[];
  method: ProtectionMethod;
}

/** The selected document as it will be exported, with every protected entity replaced. */
export function AnonymizedDocument({ doc, entities, method }: Props) {
  return <DocumentPreview doc={doc} entities={entities} footer={`Anonymized export · ${METHOD_LABELS[method]}`} />;
}
