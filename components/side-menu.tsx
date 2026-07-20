"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, FileText, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const contractTypes = [
  { id: "rent", name: "Аренда", category: "Недвижимость" },
  { id: "rent-apartment", name: "Аренда квартиры", category: "Недвижимость" },
  { id: "sale-apartment", name: "Купля-продажа квартиры", category: "Недвижимость" },
  { id: "sale-car", name: "Купля-продажа автомобиля", category: "Купля-продажа" },
  { id: "loan", name: "Займ", category: "Деньги" },
  { id: "services", name: "Услуги", category: "Услуги" },
  { id: "contract-work", name: "Подряд", category: "Услуги" },
  { id: "gift", name: "Дарение", category: "Имущество" },
  { id: "power-of-attorney", name: "Доверенность", category: "Простые документы" },
  { id: "promissory-note", name: "Расписка", category: "Простые документы" },
  { id: "statement", name: "Заявление", category: "Простые документы" },
  { id: "pledge", name: "Залог", category: "Деньги" },
  { id: "exchange", name: "Мена", category: "Имущество" },
  { id: "lease", name: "Лизинг", category: "Недвижимость" },
];

const categories = [...new Set(contractTypes.map((c) => c.category))];

export function SideMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-1">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Plus className="size-4" />
            Новый договор
          </Link>
          <Link
            href="/my-documents"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <FileText className="size-4" />
            Мои документы
          </Link>
        </div>
        <div className="mt-4 px-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Каталог договоров
          </h3>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat}>
                <h4 className="px-3 text-xs text-muted-foreground mb-1">{cat}</h4>
                {contractTypes
                  .filter((c) => c.category === cat)
                  .map((ct) => (
                    <Link
                      key={ct.id}
                      href={`/contract/${ct.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <ChevronRight className="size-3 text-muted-foreground" />
                      {ct.name}
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
