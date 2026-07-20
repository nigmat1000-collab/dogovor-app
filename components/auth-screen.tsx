"use client";
import { useState } from "react";
import { Handshake, Mail, Phone, Smartphone, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AuthScreenProps {
  onLogin: (user: { email?: string; phone?: string }) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [step, setStep] = useState<"choose" | "phone" | "email" | "code" | "password-setup" | "biometric-setup">("choose");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");

  const handleSendCode = () => {
    if (loginMethod === "phone" && phone.length < 10) {
      toast.error("Введите номер телефона");
      return;
    }
    if (loginMethod === "email" && !email.includes("@")) {
      toast.error("Введите корректный email");
      return;
    }
    toast.success("Код отправлен! Тестовый код: 123456");
    setStep("code");
  };

  const handleVerifyCode = () => {
    if (code !== "123456") {
      toast.error("Неверный код");
      return;
    }
    const user = loginMethod === "phone" ? { phone } : { email };
    localStorage.setItem("auth_user", JSON.stringify(user));
    toast.success("Вход выполнен!");
    setStep("password-setup");
  };

  const handleSetPassword = () => {
    if (password.length < 4) {
      toast.error("Пароль должен быть минимум 4 символа");
      return;
    }
    localStorage.setItem("auth_password", password);
    toast.success("Пароль установлен!");
    setStep("biometric-setup");
  };

  const handleSkipBiometric = () => {
    onLogin(loginMethod === "phone" ? { phone } : { email });
  };

  const handleEnableBiometric = async () => {
    try {
      if (!window.PublicKeyCredential) {
        toast.error("Биометрия не поддерживается");
        handleSkipBiometric();
        return;
      }
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "ДОГОВОР" },
          user: {
            id: new Uint8Array(16),
            name: loginMethod === "phone" ? phone : email,
            displayName: "Пользователь",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
          timeout: 60000,
        },
      });
      if (cred) {
        localStorage.setItem("auth_biometric", "true");
        toast.success("Биометрия включена!");
      }
    } catch {
      toast.error("Не удалось настроить биометрию");
    }
    onLogin(loginMethod === "phone" ? { phone } : { email });
  };

  if (step === "choose") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Handshake className="size-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">ДОГОВОР</h1>
          <p className="text-sm text-muted-foreground">Войдите, чтобы начать работу</p>
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => { setLoginMethod("phone"); setStep("phone"); }}>
              <Phone className="size-4" />
              Войти по телефону
            </Button>
            <Button className="w-full" size="lg" variant="outline" onClick={() => { setLoginMethod("email"); setStep("email"); }}>
              <Mail className="size-4" />
              Войти по email
            </Button>
            <Button className="w-full" size="lg" variant="secondary" disabled onClick={() => toast.info("Скоро будет доступно")}>
              <Smartphone className="size-4" />
              Войти через Сбер ID
            </Button>
            <Button className="w-full" size="lg" variant="secondary" disabled onClick={() => toast.info("Скоро будет доступно")}>
              <Fingerprint className="size-4" />
              Войти через Госуслуги
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "phone") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h2 className="text-xl font-semibold">Введите номер телефона</h2>
          <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg"
          />
          <Button className="w-full" size="lg" onClick={handleSendCode}>Получить код</Button>
          <Button variant="ghost" size="sm" onClick={() => setStep("choose")}>Назад</Button>
        </div>
      </div>
    );
  }

  if (step === "email") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h2 className="text-xl font-semibold">Введите email</h2>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg"
          />
          <Button className="w-full" size="lg" onClick={handleSendCode}>Получить код</Button>
          <Button variant="ghost" size="sm" onClick={() => setStep("choose")}>Назад</Button>
        </div>
      </div>
    );
  }

  if (step === "code") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h2 className="text-xl font-semibold">Введите код</h2>
          <p className="text-sm text-muted-foreground">Код отправлен на {loginMethod === "phone" ? phone : email}</p>
          <input
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg tracking-widest"
            maxLength={6}
          />
          <Button className="w-full" size="lg" onClick={handleVerifyCode}>Подтвердить</Button>
          <Button variant="ghost" size="sm" onClick={() => setStep("choose")}>Назад</Button>
        </div>
      </div>
    );
  }

  if (step === "password-setup") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h2 className="text-xl font-semibold">Установите пароль</h2>
          <p className="text-sm text-muted-foreground">Для быстрого входа в следующий раз</p>
          <input
            type="password"
            placeholder="Придумайте пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-lg"
          />
          <Button className="w-full" size="lg" onClick={handleSetPassword}>Установить пароль</Button>
          <Button variant="ghost" size="sm" onClick={handleSkipBiometric}>Пропустить</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h2 className="text-xl font-semibold">Вход по биометрии</h2>
        <p className="text-sm text-muted-foreground">Используйте отпечаток пальца или Face ID для быстрого входа</p>
        <div className="flex justify-center py-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
            <Fingerprint className="size-10 text-primary" />
          </div>
        </div>
        <Button className="w-full" size="lg" onClick={handleEnableBiometric}>Включить биометрию</Button>
        <Button variant="ghost" size="sm" onClick={handleSkipBiometric}>Пропустить</Button>
      </div>
    </div>
  );
}
