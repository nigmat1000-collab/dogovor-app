"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bot, Handshake, Send, Mic, MicOff, Sparkles, ChevronRight, FileText, CheckCircle2, ImagePlus, X, Volume2, VolumeX, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  options?: { id: string; label: string; action: string }[];
  imageUrl?: string;
}

interface ContractDraft {
  id: string;
  contractId: string;
  contractTitle: string;
  fields: Record<string, string>;
  status: "draft" | "signed";
  createdAt: string;
}

function WelcomeScreen({ onExampleClick }: { onExampleClick: (text: string) => void }) {
  const router = useRouter();
  const examples = ["Хочу сдать квартиру другу на год", "Продаю свой автомобиль", "Нужна расписка, даю деньги в долг", "Хочу подарить квартиру сыну"];
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
        <Handshake className="size-6 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Ваш помощник</h1>
        <p className="text-xs text-muted-foreground max-w-sm">Опишите вашу ситуацию — я подберу подходящий договор, задам уточняющие вопросы и подготовлю готовый документ.</p>
      </div>
      <div className="w-full max-w-md grid grid-cols-2 gap-2">
        <button type="button" onClick={() => router.push("/my-documents")}
          className="flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/50 p-3 text-xs font-medium hover:bg-accent hover:text-foreground transition-colors">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10"><FileText className="size-4 text-primary" /></div>
          <span>Мои документы</span>
        </button>
        <button type="button" onClick={() => router.push("/")}
          className="flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/50 p-3 text-xs font-medium hover:bg-accent hover:text-foreground transition-colors">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10"><Plus className="size-4 text-primary" /></div>
          <span>Новый договор</span>
        </button>
      </div>
      <div className="w-full max-w-md space-y-1">
        <p className="text-[10px] text-muted-foreground text-center">Например:</p>
        {examples.map((ex) => (
          <button key={ex} type="button" onClick={() => onExampleClick(ex)}
            className="w-full text-left rounded-lg border border-border/50 bg-card/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [draft, setDraft] = useState<ContractDraft | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        recognitionRef.current = new SR();
        recognitionRef.current.lang = "ru-RU";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          setTimeout(() => sendMessage(transcript), 200);
        };
        recognitionRef.current.onerror = () => { setIsListening(false); toast.error("Ошибка распознавания голоса"); };
        recognitionRef.current.onend = () => { setIsListening(false); };
      }
    }
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const sendMessage = useCallback(async (text: string, imageUrl?: string) => {
    if (!text.trim() && !imageUrl) return;
    if (isProcessing) return;
    setIsProcessing(true);
    setInputValue("");
    setPendingImage(null);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text: text.trim(), imageUrl };
    addMessage(userMsg);
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Я проанализировал вашу ситуацию. Это похоже на **Договор аренды**. Давайте заполним обязательные условия.\n\nКакая будет сумма аренды в месяц?",
        options: [
          { id: "opt-1", label: "50000 ₽", action: "confirm" },
          { id: "opt-2", label: "30000 ₽", action: "confirm" },
          { id: "opt-3", label: "Другая сумма", action: "modify" },
        ],
      };
      addMessage(assistantMsg);
      setIsProcessing(false);
    }, 1500);
  }, [isProcessing, addMessage]);

  const handleSend = useCallback(() => { sendMessage(inputValue, pendingImage ?? undefined); }, [inputValue, pendingImage, sendMessage]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }, [handleSend]);

  const handleVoiceToggle = useCallback(() => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    if (recognitionRef.current) { recognitionRef.current.start(); setIsListening(true); }
    else { toast.error("Голосовой ввод недоступен"); }
  }, [isListening]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Пожалуйста, выберите изображение"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Изображение слишком большое (макс. 10 МБ)"); return; }
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleAction = useCallback(async (actionId: string) => {
    const msg = messages.find((m) => m.options?.some((o) => o.id === actionId));
    if (!msg?.options) return;
    const action = msg.options.find((o) => o.id === actionId);
    if (!action) return;
    if (action.action === "view" || action.action === "sign") {
      const existing = localStorage.getItem("contract_drafts");
      const drafts: ContractDraft[] = existing ? JSON.parse(existing) : [];
      if (drafts.length > 0) window.location.href = `/my-documents/${drafts[drafts.length - 1].id}`;
      return;
    }
    if (action.action === "confirm") {
      const newDraft: ContractDraft = {
        id: Date.now().toString(), contractId: "rent", contractTitle: "Договор аренды",
        fields: { rentAmount: action.label }, status: "draft", createdAt: new Date().toISOString(),
      };
      const existing = localStorage.getItem("contract_drafts");
      const drafts: ContractDraft[] = existing ? JSON.parse(existing) : [];
      drafts.push(newDraft);
      localStorage.setItem("contract_drafts", JSON.stringify(drafts));
      setDraft(newDraft);
      const doneMsg: ChatMessage = {
        id: (Date.now() + 2).toString(), role: "assistant",
        text: "✅ **Договор аренды** сформирован!\n\nВы можете посмотреть полный текст, отредактировать или подписать.",
        options: [
          { id: "view-doc", label: "Посмотреть договор", action: "view" },
          { id: "sign-doc", label: "Подписать", action: "sign" },
          { id: "new-doc", label: "Создать новый", action: "restart" },
        ],
      };
      addMessage(doneMsg);
    }
  }, [messages, addMessage]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("[data-action]");
      if (btn) {
        const actionId = btn.getAttribute("data-action");
        if (actionId) handleAction(actionId);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [handleAction]);

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto max-w-2xl py-2 space-y-3">
          {showWelcome ? (
            <WelcomeScreen onExampleClick={(text) => sendMessage(text)} />
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2 group">
                  <div className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse ml-auto" : ""} animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[80%]`}>
                    {msg.role !== "user" && (
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="size-3.5 text-primary" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                      <div className="whitespace-pre-wrap [&_strong]:font-semibold text-[13px]">{msg.text}</div>
                      {msg.options && msg.options.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {msg.options.map((opt) => (
                            <Button key={opt.id} size="sm" variant={opt.action === "confirm" || opt.action === "view" ? "default" : "outline"} className="gap-1 text-xs h-7 px-2.5" data-action={opt.id}>
                              {opt.action === "confirm" && <CheckCircle2 className="size-3" />}
                              {opt.action === "view" && <FileText className="size-3" />}
                              {opt.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="size-3.5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-3 py-2">
                    <span className="size-1.5 rounded-full bg-muted-foreground/40 pulse-dot" />
                    <span className="size-1.5 rounded-full bg-muted-foreground/40 pulse-dot" style={{ animationDelay: "0.3s" }} />
                    <span className="size-1.5 rounded-full bg-muted-foreground/40 pulse-dot" style={{ animationDelay: "0.6s" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
      <div className="border-t bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-2">
          {draft && (
            <div className="mb-2 flex items-center gap-2 rounded-lg border bg-card p-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <FileText className="size-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{draft.contractTitle}</p>
                <p className="text-[10px] text-muted-foreground">Договор сохранён</p>
              </div>
              <Button size="sm" className="h-7 text-xs" onClick={() => { window.location.href = `/my-documents/${draft.id}`; }}>
                <ChevronRight className="mr-1 size-3" /> Посмотреть
              </Button>
            </div>
          )}
          <div className="flex items-end gap-1.5">
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageSelect} />
            <Button variant="outline" size="icon" className="size-9 shrink-0" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
              <ImagePlus className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className={`size-9 shrink-0 ${isListening ? "bg-destructive text-destructive-foreground" : ""}`} onClick={handleVoiceToggle} disabled={isProcessing}>
              {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </Button>
            <div className="relative flex-1">
              <textarea value={inputValue}
                onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={isProcessing ? "Ассистент думает..." : "Опишите вашу ситуацию..."}
                rows={1} disabled={isProcessing}
                className="flex w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[2.5rem] max-h-32" />
            </div>
            <Button size="icon" className="size-9 shrink-0" onClick={handleSend} disabled={(!inputValue.trim() && !pendingImage) || isProcessing}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
