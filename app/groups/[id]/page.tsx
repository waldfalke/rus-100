import { Metadata } from 'next';
import GroupStatsClient from './GroupStatsClient';
import GroupPageClient from './GroupPageClient';

export const metadata: Metadata = {
  title: 'Группа',
  description: 'Статистика по навыкам и заданиям группы',
};

interface GroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock данные для определения статуса группы
// В реальном приложении это приходило бы из API
const mockGroups = [
  { id: "1", status: "active" },
  { id: "2", status: "active" },
  { id: "3", status: "archived" },
  { id: "4", status: "draft" },
  { id: "5", status: "active" },
  { id: "6", status: "draft" },
  { id: "demo", status: "active" },
];

// Генерируем статические параметры для статического экспорта
export async function generateStaticParams() {
  // Возвращаем список возможных ID групп
  // В реальном приложении это могло бы быть получено из API или базы данных
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: 'demo' },
  ];
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;

  // Определяем статус группы
  const group = mockGroups.find(g => g.id === id);
  const isDraft = group?.status === 'draft';

  // Черновики → страница редактирования/управления
  // Активные/архивные → статистика с таблицей
  if (isDraft) {
    return <GroupPageClient />;
  }

  return <GroupStatsClient groupId={id} />;
}