"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Camera, Upload, Fingerprint, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContractFormProps {
  contractId: string;
  draftId?: string;
}

const fieldConfigs: Record<string, { key: string; label: string; type: string }[]> = {
  rent: [
    { key: "party1_name", label: "Арендодатель (ФИО)", type: "text" },
    { key: "party2_name", label: "Арендатор (ФИО)", type: "text" },
    { key: "property_address", label: "Адрес помещения", type: "text" },
    { key: "rent_amount", label: "Сумма аренды в месяц", type: "text" },
    { key: "duration", label: "Срок аренды", type: "text" },
  ],
  loan: [
    { key: "lender_name", label: "Займодавец (ФИО)", type: "text" },
    { key: "borrower_name", label: "Заёмщик (ФИО)", type: "text" },
    { key: "amount", label: "Сумма займа", type: "text" },
    { key: "interest_rate", label: "Процентная ставка", type: "text" },
    { key: "repayment_date", label: "Дата возврата", type: "text" },
  ],
};

export default function ContractForm({ contractId, draftId }: ContractFormProps) {
  const router = useRouter();
  const fields = fieldConfigs[contractId] || fieldConfigs.rent;
  const [values, setValues] = useState<Record<string, string>>({});
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (draftId) {
      const stored = localStorage.getItem("contract_drafts");
      if (stored) {
        const drafts = JSON.parse(stored);
        const draft = drafts.find((d: any) => d.id === draftId);
        if (draft) {
          setValues(draft.fields || {});
          setSigned(draft.status === "signed");
        }
      }
    }
  }, [draftId]);

  const handleSave = () => {
    const stored = localStorage.getItem("contract_drafts");
    const drafts = stored ? JSON.parse(stored) : [];
    const existing = drafts.findIndex((d: any) => d.id === draftId);
    const draft = {
      id: draftId || Date.now().toString(),
      contractId,
      contractTitle: contractId === "rent" ? "Договор аренды" : "Договор займа",
      fields: values,
      status: "draft" as const,
      createdAt: new Date().toISOString(),
    };
    if (existing >= 0) {
      drafts[existing] = { ...drafts[existing], fields: values };
    } else {
      drafts.push(draft);
    }
    localStorage.setItem("contract_drafts", JSON.stringify(drafts));
    toast.success("Сохранено!");
  };

  const handleSign = () => {
    const stored = localStorage.getItem("contract_drafts");
    const drafts = stored ? JSON.parse(stored) : [];
    const idx = drafts.findIndex((d: any) => d.id === draftId);
    if (idx >= 0) {
      drafts[idx].status = "signed";
      drafts[idx].signedAt = new Date().toISOString();
      localStorage.setItem("contract_drafts", JSON.stringify(drafts));
      setSigned(true);
      toast.success("Договор подписан!");
      setTimeout(() => router.push(`/my-documents/${draftId}`), 1500);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-lg font-semibold">
          {contractId === "rent" ? "Договор аренды" : "Договор займа"}
        </h1>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Upload className="size-4" /> Загрузить документ
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Camera className="size-4" /> Сфотографировать
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium mb-1 block">{field.label}</label>
            <input
              type={field.type}
              value={values[field.key] || ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              disabled={signed}
            />
          </div>
        ))}
      </div>

      {!signed && (
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-semibold">Подписание договора</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSign} className="gap-1.5">
              <Handshake className="size-4" /> Подписать
            </Button>
            <Button variant="outline" className="gap-1.5">
              <Fingerprint className="size-4" /> Отпечатком пальца
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="gap-1.5 opacity-60 border-dashed" disabled onClick={() => toast.info("Скоро будет доступно")}>
              Подписать через Сбер ID
            </Button>
            <Button variant="secondary" className="gap-1.5 opacity-60 border-dashed" disabled onClick={() => toast.info("Скоро будет доступно")}>
              Подписать через Госуслуги
            </Button>
          </div>
        </div>
      )}

      {!signed && (
        <Button onClick={handleSave} className="w-full gap-1.5">
          <Save className="size-4" /> Сохранить черновик
        </Button>
      )}

      {signed && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 text-center">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">✓ Договор подписан</p>
          <Button variant="link" onClick={() => router.push(`/my-documents/${draftId}`)}>
            Посмотреть договор
          </Button>
        </div>
      )}
    </div>
  );
}
