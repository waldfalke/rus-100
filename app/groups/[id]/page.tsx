import { Metadata } from 'next';
import GroupStatsClient from './GroupStatsClient';

export const metadata: Metadata = {
  title: 'Группа',
  description: 'Статистика по навыкам и заданиям группы',
};

interface GroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

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
  return <GroupStatsClient groupId={id} />;
}