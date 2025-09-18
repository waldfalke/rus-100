import type { UserProfileData, Tariff, PaymentOption } from '../types/account';

// --- Базовые данные тарифов ---
const tariffBasic: Tariff = {
  id: 'basic',
  name: 'от 1 до 15 учеников',
  costPerPeriod: 3000,
  periodDescription: 'за 3000р.',
  studentLimit: 15,
};

const tariffAdvanced: Tariff = {
  id: 'advanced',
  name: 'от 16 до 30 учеников',
  costPerPeriod: 3500,
  periodDescription: 'за 3500р.',
  studentLimit: 30,
};

// --- Базовые опции оплаты (для тарифа basic) ---
const paymentOptionsBasic: PaymentOption[] = [
  {
    id: 'pay_month_basic',
    label: 'Оплатить на месяц, до 16.05.2025',
    cost: 3000,
    url: '#',
  },
  {
    id: 'pay_year_basic',
    label: 'Оплатить до конца года: до 01.06.2025',
    cost: 4500,
    url: '#',
  },
];

// --- Моковые данные для обычного пользователя ---
export const mockUserData: UserProfileData = {
  isCurrentUserAdmin: false,
  isAdminView: false,
  profileUserId: 'user-123',
  profileUserName: 'Светлана Юрьевна А',
  profileUserEmail: 'anisovasu@mail.ru',
  registrationDate: '10.01.2025',
  paidUntilDate: '16.02.2025',
  currentStudentCount: 14,
  currentTariff: tariffBasic,
  nextTariff: tariffAdvanced,
  paymentOptions: paymentOptionsBasic,
};

// --- Моковые данные для админа, просматривающего пользователя ---
export const mockAdminViewingUserData: UserProfileData = {
  isCurrentUserAdmin: true,
  isAdminView: true,
  availableUsers: [
    { id: 'user-123', name: 'Светлана Юрьевна А' },
    { id: 'user-456', name: 'Иван Петрович Б' },
    { id: 'user-789', name: 'Ольга Васильевна В' },
  ],
  selectedUserId: 'user-123', // По умолчанию выбран первый пользователь

  // Данные совпадают с mockUserData, так как админ смотрит на Светлану
  profileUserId: 'user-123',
  profileUserName: 'Светлана Юрьевна А',
  profileUserEmail: 'anisovasu@mail.ru',
  registrationDate: '10.01.2025',
  paidUntilDate: '16.02.2025',
  currentStudentCount: 14,
  currentTariff: tariffBasic,
  nextTariff: tariffAdvanced,
  paymentOptions: paymentOptionsBasic, // Пока опции оплаты для админа те же
};

// --- Моковые данные для админа, просматривающего СВОЙ профиль (пример) ---
export const mockAdminOwnData: UserProfileData = {
  isCurrentUserAdmin: true,
  isAdminView: false, // Админ смотрит на себя
  availableUsers: [
    { id: 'user-123', name: 'Светлана Юрьевна А' },
    { id: 'user-456', name: 'Иван Петрович Б' },
    { id: 'user-789', name: 'Ольга Васильевна В' },
    { id: 'admin-001', name: 'Администратор Главный'}
  ],
  selectedUserId: 'admin-001', // По умолчанию выбран сам админ

  profileUserId: 'admin-001',
  profileUserName: 'Администратор Главный',
  profileUserEmail: 'admin@rus100.ru',
  registrationDate: '01.01.2024',
  paidUntilDate: 'N/A', // У админа нет срока оплаты?
  currentStudentCount: 0, // У админа нет учеников?
  currentTariff: undefined, // У админа нет тарифа?
  nextTariff: undefined,
  paymentOptions: [], // У админа нет опций оплаты?
}; 