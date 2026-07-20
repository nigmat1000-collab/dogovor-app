export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const contractTemplates: ContractTemplate[] = [
  { id: "rent", name: "Аренда", category: "Недвижимость", description: "Аренда помещения или квартиры" },
  { id: "rent-apartment", name: "Аренда квартиры", category: "Недвижимость", description: "Аренда квартиры" },
  { id: "sale-apartment", name: "Купля-продажа квартиры", category: "Недвижимость", description: "Продажа квартиры" },
  { id: "sale-car", name: "Купля-продажа автомобиля", category: "Купля-продажа", description: "Продажа автомобиля" },
  { id: "loan", name: "Займ", category: "Деньги", description: "Денежный займ" },
  { id: "services", name: "Услуги", category: "Услуги", description: "Оказание услуг" },
  { id: "contract-work", name: "Подряд", category: "Услуги", description: "Выполнение работ" },
  { id: "gift", name: "Дарение", category: "Имущество", description: "Дарение имущества" },
  { id: "power-of-attorney", name: "Доверенность", category: "Простые документы", description: "Доверенность" },
  { id: "promissory-note", name: "Расписка", category: "Простые документы", description: "Расписка" },
  { id: "statement", name: "Заявление", category: "Простые документы", description: "Заявление" },
  { id: "pledge", name: "Залог", category: "Деньги", description: "Залог имущества" },
  { id: "exchange", name: "Мена", category: "Имущество", description: "Обмен имуществом" },
  { id: "lease", name: "Лизинг", category: "Недвижимость", description: "Лизинг" },
];
