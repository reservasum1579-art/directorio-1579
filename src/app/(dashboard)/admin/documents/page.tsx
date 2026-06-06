import { AdminDocumentManager } from '@/modules/documents/components/AdminDocumentManager';
import { documentService } from '@/modules/documents/services/document.service';
import { DEFAULT_BUILDING_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function AdminDocumentsPage() {
  const documents = await documentService.getDocuments(DEFAULT_BUILDING_ID);

  return (
    <AdminDocumentManager initialDocuments={documents} />
  );
}
