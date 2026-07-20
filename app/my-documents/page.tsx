"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Trash2, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContractDraft {
  id: string;
  contractId: string;
  contractTitle: string;
  status: "draft" | "signed";
  createdAt: string;
}

export default function MyDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<ContractDraft[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("contract_drafts");
    if (stored) setDocuments(JSON.parse(stored));
  }, []);

  const handleDelete = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    localStorage.setItem("contract_drafts", JSON.stringify(updated));
    toast.success("Документ удалён");
  };

  const drafts = documents.filter((d) => d.status === "draft");
  const signed = documents.filter((d) => d.status === "signed");

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">Мои документы</h1>
      </div>

      {documents.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="size-12 mx-auto mb-3 opacity-30" />
          <p>У вас пока нет документов</p>
          <Button variant="link" onClick={() => router.push("/")}>Создать первый договор</Button>
        </div>
      )}

      {drafts.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Черновики</h2>
          <div className="space-y-2">
            {drafts.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <FileText className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{doc.contractTitle}</p>
                  <p className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString("ru-RU")}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                  <Trash2 className="size-4" />
                </Button>
                <Button size="sm" onClick={() => router.push(`/my-documents/${doc.id}`)}>Открыть</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {signed.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Подписанные</h2>
          <div className="space-y-2">
            {signed.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/20">
                  <Handshake className="size-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{doc.contractTitle}</p>
                  <p className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString("ru-RU")}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                  <Trash2 className="size-4" />
                </Button>
                <Button size="sm" onClick={() => router.push(`/my-documents/${doc.id}`)}>Открыть</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
