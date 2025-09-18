export {};

// types/account.ts
// Опция оплаты
export interface PaymentOption {
  id: string; // Уникальный ID опции
  label: string; // Текст ссылки (напр., "Оплатить на месяц, до 16.05.2025")
  cost: number; // Стоимость в рублях (напр., 3000)
  url?: string; // URL для перехода к оплате (пока заглушка '#')
}

// Описание тарифа
export interface Tariff {
  id: string; // Уникальный ID тарифа
  name: string; // Короткое название/описание (напр., "от 1 до 15 учеников")
  costPerPeriod: number; // Стоимость за период (напр., 3000)
  periodDescription?: string; // Полное описание стоимости (напр., "за 3000р.")
  studentLimit: number; // Максимальное количество учеников
}

// Данные профиля пользователя
export interface UserProfileData {
  // --- Метаданные для отображения ---
  isCurrentUserAdmin: boolean; // Является ли текущий залогиненный пользователь админом?
  isAdminView: boolean; // Просматривает ли админ чужой профиль? (Может быть true только если isCurrentUserAdmin true)
  availableUsers?: { id: string; name: string }[]; // Список пользователей для выбора админом
  selectedUserId?: string; // ID пользователя, чей профиль просматривает админ

  // --- Данные отображаемого профиля ---
  profileUserId: string; // ID пользователя, чей профиль отображается
  profileUserName: string; // Имя пользователя (напр., "Светлана Юрьевна А")
  profileUserEmail: string; // Email пользователя (напр., "anisovasu@mail.ru")
  registrationDate: string; // Дата регистрации (напр., "10.01.2025")
  paidUntilDate: string; // Дата, до которой оплачен доступ (напр., "16.02.2025")
  currentStudentCount: number; // Текущее количество учеников (напр., 14)

  currentTariff?: Tariff; // Текущий тариф пользователя (может быть undefined?)
  nextTariff?: Tariff; // Следующий доступный тариф (может отсутствовать)

  // Опции оплаты, соответствующие ТЕКУЩЕМУ тарифу пользователя
  paymentOptions: PaymentOption[];
} 