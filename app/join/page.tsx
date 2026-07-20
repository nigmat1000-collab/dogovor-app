"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const [inputCode, setInputCode] = useState(code);
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (!inputCode.trim()) { toast.error("Введите код"); return; }
    setJoined(true);
    toast.success("Вы присоединились к договору!");
  };

  if (joined) {
    return (
      <div className="mx-auto max-w-2xl p-4 space-y-4">
        <h1 className="text-lg font-semibold">Договор для подписания</h1>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-4">Вы можете просмотреть договор и поставить подпись.</p>
          <Button className="w-full">Подписать договор</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-lg font-semibold">Присоединиться к договору</h1>
      <p className="text-sm text-muted-foreground">Введите код, который отправил автор договора</p>
      <input
        type="text"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        placeholder="Введите код"
        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-center text-lg tracking-widest"
      />
      <Button className="w-full" onClick={handleJoin}>Присоединиться</Button>
    </div>
  );
}
