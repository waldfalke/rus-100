import { Metadata } from 'next';
import GroupStatsClient from '../GroupStatsClient';

export const metadata: Metadata = {
  title: 'Статистика группы',
  description: 'Статистика по навыкам и заданиям группы',
};

interface GroupStatsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GroupStatsPage({ params }: GroupStatsPageProps) {
  const { id } = await params;
  return <GroupStatsClient groupId={id} />;
}

export async function generateStaticParams() {
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