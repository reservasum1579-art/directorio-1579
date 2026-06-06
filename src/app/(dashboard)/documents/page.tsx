import { DocumentList } from '@/modules/documents/components/DocumentList';
import { documentService } from '@/modules/documents/services/document.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const documents = await documentService.getDocuments(DEFAULT_BUILDING_ID);

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h2 className="font-display text-3xl font-bold text-primary-500 mb-2 text-glow">
          Documentos
        </h2>
        <p className="text-text-secondary">
          Descargá expensas, actas y documentación importante del consorcio.
        </p>
      </header>

      <DocumentList documents={documents} />
    </div>
  );
}
