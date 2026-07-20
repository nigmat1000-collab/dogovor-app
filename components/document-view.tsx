"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, Share2, Edit, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContractDraft {
  id: string;
  contractId: string;
  contractTitle: string;
  fields: Record<string, string>;
  status: "draft" | "signed";
  createdAt: string;
  signedAt?: string;
}

export default function DocumentView({ draftId }: { draftId: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ContractDraft | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("contract_drafts");
    if (stored) {
      const drafts = JSON.parse(stored);
      const found = drafts.find((d: any) => d.id === draftId);
      if (found) setDraft(found);
    }
  }, [draftId]);

  if (!draft) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Документ не найден</p>
      </div>
    );
  }

  const contractText = `ДОГОВОР ${draft.contractTitle.toUpperCase()}

г. Москва                                          ${new Date(draft.createdAt).toLocaleDateString("ru-RU")}

1. СТОРОНЫ ДОГОВОРА

${Object.entries(draft.fields).map(([key, val]) => `${key}: ${val}`).join("\n")}

2. ПРЕДМЕТ ДОГОВОРА

Стороны заключили настоящий договор о нижеследующем...

3. ПРАВА И ОБЯЗАННОСТИ СТОРОН

...

4. ОТВЕТСТВЕННОСТЬ СТОРОН

...

5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ

Настоящий договор составлен в двух экземплярах, имеющих равную юридическую силу.

ПОДПИСИ СТОРОН:

_______________              _______________
(Сторона 1)                  (Сторона 2)

${draft.status === "signed" ? "\nДоговор подписан: " + (draft.signedAt ? new Date(draft.signedAt).toLocaleString("ru-RU") : "") : "\nСтатус: Черновик"}`;

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`<pre style="font-family: 'Times New Roman', serif; font-size: 14px; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px;">${contractText}</pre>`);
      win.document.close();
      win.print();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: draft.contractTitle, text: contractText });
    } else {
      navigator.clipboard.writeText(contractText);
      toast.success("Текст договора скопирован");
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">{draft.contractTitle}</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="size-4" /> Печать
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="size-4" /> Отправить
          </Button>
        </div>
      </div>

      {draft.status === "draft" && (
        <Button variant="secondary" onClick={() => router.push(`/contract/${draft.contractId}?draft=${draft.id}`)} className="gap-1.5">
          <Edit className="size-4" /> Продолжить заполнение
        </Button>
      )}

      <div className="rounded-lg border bg-card p-6">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {contractText}
        </pre>
      </div>

      {draft.status === "signed" && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 flex items-center gap-3">
          <Handshake className="size-5 text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Договор подписан</p>
            <p className="text-xs text-green-600/70">{draft.signedAt ? new Date(draft.signedAt).toLocaleString("ru-RU") : ""}</p>
          </div>
        </div>
      )}
    </div>
  );
}
