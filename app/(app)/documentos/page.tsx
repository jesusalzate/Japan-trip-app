import { getDocuments, isConfigured } from "@/lib/data";
import { DocumentsManager } from "@/components/documents-manager";
import { SetupNotice } from "@/components/setup-notice";

export const dynamic = "force-dynamic";

export default async function DocumentosPage() {
  if (!isConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Documentos</h1>
        <SetupNotice />
      </div>
    );
  }

  const documents = await getDocuments();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">Documentos</h1>
        <p className="text-sm text-muted-foreground">
          Reservas, visado, seguro y pasaportes. Privados para nosotros dos.
        </p>
      </div>

      <DocumentsManager documents={documents} />
    </div>
  );
}
