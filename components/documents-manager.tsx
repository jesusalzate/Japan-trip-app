"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  ExternalLink,
  Trash2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { deleteDocument } from "@/app/actions";
import { DOCUMENT_CATEGORIES } from "@/lib/trip";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DocumentCategory, TripDocument } from "@/lib/types";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
];

function prettySize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsManager({ documents }: { documents: TripDocument[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("vuelo");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Selecciona un archivo.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("El archivo supera los 10 MB.");
      return;
    }
    if (file.type && !ALLOWED.includes(file.type)) {
      setError("Formato no permitido (usa PDF, JPG, PNG o WEBP).");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${category}/${crypto.randomUUID()}-${safeName}`;

    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: false });

    if (upErr) {
      setError("No se pudo subir el archivo.");
      setBusy(false);
      return;
    }

    const { error: insErr } = await supabase.from("documents").insert({
      category,
      title: title.trim() || file.name,
      storage_path: path,
      mime_type: file.type || null,
      size_bytes: file.size,
      uploaded_by: user?.id ?? null,
    });

    if (insErr) {
      await supabase.storage.from("documents").remove([path]);
      setError("No se pudo guardar el documento.");
      setBusy(false);
      return;
    }

    setTitle("");
    if (fileRef.current) fileRef.current.value = "";
    setBusy(false);
    router.refresh();
  }

  async function open(doc: TripDocument) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 3600);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={onUpload} className="space-y-3">
            <Input
              placeholder="Título (p. ej. Reserva vuelo Iberia)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              >
                {(Object.keys(DOCUMENT_CATEGORIES) as DocumentCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {DOCUMENT_CATEGORIES[c]}
                  </option>
                ))}
              </Select>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp,image/heic"
                className="text-xs file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-xs file:font-medium"
              />
            </div>
            {error && (
              <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            )}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Subiendo…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Subir documento
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {documents.length === 0 && (
          <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            Aún no hay documentos. Sube las reservas, el visado, el seguro…
          </p>
        )}
        {documents.map((doc) => {
          const isImg = doc.mime_type?.startsWith("image/");
          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                {isImg ? (
                  <ImageIcon className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.title}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <Badge className="bg-muted text-muted-foreground">
                    {DOCUMENT_CATEGORIES[doc.category]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {prettySize(doc.size_bytes)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => open(doc)}
                className="text-muted-foreground hover:text-primary"
                aria-label="Abrir"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  start(() => deleteDocument(doc.id, doc.storage_path))
                }
                disabled={pending}
                className="text-muted-foreground hover:text-danger"
                aria-label="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
