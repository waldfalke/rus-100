import React from 'react';
import { H1 } from '@/components/ui/typography';
import { ResponsiveStatsTable } from '@/components/stats-table';
import { getTableStatisticsByGroupId, TableStats } from '@/data/statistics-adapter';

export default function GroupStatisticsPage({ params, searchParams }: { params: { id: string }, searchParams?: { title?: string, stat?: string } }) {
  const selectedTitle = searchParams?.title ?? null;
  const selectedTitleFromId = (() => {
    const idParam = searchParams?.stat;
    if (!idParam) return null;
    const stats = getTableStatisticsByGroupId(params.id);
    const match = stats.find((s: TableStats) => s.id === idParam);
    return match?.title ?? null;
  })();
  const displayTitle = selectedTitleFromId ?? selectedTitle ?? 'Статистика по группе';
  // Моки студентов (как в GroupStatsClient)
  const mockTableStudents = [
    { id: '1', name: 'Иванов Алексей', email: 'ivanov@example.com' },
    { id: '2', name: 'Петрова Мария', email: 'petrova@example.com' },
    { id: '3', name: 'Сидоров Дмитрий', email: 'sidorov@example.com' },
    { id: '4', name: 'Козлова Анна', email: 'kozlova@example.com' },
    { id: '5', name: 'Морозов Игорь', email: 'morozov@example.com' },
    { id: '6', name: 'Васильева Елена', email: 'vasileva@example.com' },
    { id: '7', name: 'Николаев Павел', email: 'nikolaev@example.com' },
    { id: '8', name: 'Смирнова Ольга', email: 'smirnova@example.com' },
    { id: '9', name: 'Федоров Андрей', email: 'fedorov@example.com' },
    { id: '10', name: 'Кузнецова Татьяна', email: 'kuznetsova@example.com' },
    { id: '11', name: 'Попов Максим', email: 'popov@example.com' },
    { id: '12', name: 'Лебедева Наталья', email: 'lebedeva@example.com' },
    { id: '13', name: 'Волков Сергей', email: 'volkov@example.com' },
    { id: '14', name: 'Соколова Юлия', email: 'sokolova@example.com' },
    { id: '15', name: 'Новиков Владимир', email: 'novikov@example.com' }
  ];

  // Группы колонок (как в GroupStatsClient)
  const mockColumnGroups = [
    {
      name: 'Работа с текстом',
      key: 'text-work-1',
      columns: [
        { key: 'text1_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'text1_1', label: '№1', type: 'score' as const, sortable: true },
        { key: 'text1_2', label: '№2', type: 'score' as const, sortable: true },
        { key: 'text1_3', label: '№3', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Нормы',
      key: 'norms',
      columns: [
        { key: 'norms_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'norms_4', label: '№4', type: 'score' as const, sortable: true },
        { key: 'norms_5', label: '№5', type: 'score' as const, sortable: true },
        { key: 'norms_6', label: '№6', type: 'score' as const, sortable: true },
        { key: 'norms_7', label: '№7', type: 'score' as const, sortable: true },
        { key: 'norms_8', label: '№8', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Орфография',
      key: 'orfography',
      columns: [
        { key: 'orf_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'orf_9', label: '№9', type: 'score' as const, sortable: true },
        { key: 'orf_10', label: '№10', type: 'score' as const, sortable: true },
        { key: 'orf_11', label: '№11', type: 'score' as const, sortable: true },
        { key: 'orf_12', label: '№12', type: 'score' as const, sortable: true },
        { key: 'orf_13', label: '№13', type: 'score' as const, sortable: true },
        { key: 'orf_14', label: '№14', type: 'score' as const, sortable: true },
        { key: 'orf_15', label: '№15', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Пунктуация',
      key: 'punctuation',
      columns: [
        { key: 'punct_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'punct_16', label: '№16', type: 'score' as const, sortable: true },
        { key: 'punct_17', label: '№17', type: 'score' as const, sortable: true },
        { key: 'punct_18', label: '№18', type: 'score' as const, sortable: true },
        { key: 'punct_19', label: '№19', type: 'score' as const, sortable: true },
        { key: 'punct_20', label: '№20', type: 'score' as const, sortable: true },
        { key: 'punct_21', label: '№21', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
    {
      name: 'Работа с текстом',
      key: 'text-work-2',
      columns: [
        { key: 'text2_total', label: 'Всего', type: 'score' as const, sortable: true },
        { key: 'text2_22', label: '№22', type: 'score' as const, sortable: true },
        { key: 'text2_23', label: '№23', type: 'score' as const, sortable: true },
        { key: 'text2_24', label: '№24', type: 'score' as const, sortable: true },
        { key: 'text2_25', label: '№25', type: 'score' as const, sortable: true },
        { key: 'text2_fraz', label: 'Фразеологизмы', type: 'score' as const, sortable: true },
        { key: 'text2_26', label: '№26', type: 'score' as const, sortable: true },
      ],
      collapsed: false
    },
  ];

  // Генератор данных, совпадающий по логике с GroupStatsClient
  const generateStudentData = (studentId: number) => {
    const baseScore = 60 + (studentId * 2);
    const randomVariation = () => Math.floor(Math.random() * 20) - 10; // ±10

    return {
      'text1_total': baseScore + randomVariation(),
      'text1_1': baseScore + randomVariation(),
      'text1_2': baseScore + randomVariation(),
      'text1_3': baseScore + randomVariation(),
      'norms_total': baseScore + randomVariation(),
      'norms_4': baseScore + randomVariation(),
      'norms_5': baseScore + randomVariation(),
      'norms_6': baseScore + randomVariation(),
      'norms_7': baseScore + randomVariation(),
      'norms_8': baseScore + randomVariation(),
      'orf_total': baseScore + randomVariation(),
      'orf_9': baseScore + randomVariation(),
      'orf_10': baseScore + randomVariation(),
      'orf_11': baseScore + randomVariation(),
      'orf_12': baseScore + randomVariation(),
      'orf_13': baseScore + randomVariation(),
      'orf_14': baseScore + randomVariation(),
      'orf_15': baseScore + randomVariation(),
      'punct_total': baseScore + randomVariation(),
      'punct_16': baseScore + randomVariation(),
      'punct_17': baseScore + randomVariation(),
      'punct_18': baseScore + randomVariation(),
      'punct_19': baseScore + randomVariation(),
      'punct_20': baseScore + randomVariation(),
      'punct_21': baseScore + randomVariation(),
      'text2_total': baseScore + randomVariation(),
      'text2_22': baseScore + randomVariation(),
      'text2_23': baseScore + randomVariation(),
      'text2_24': baseScore + randomVariation(),
      'text2_25': baseScore + randomVariation(),
      'text2_fraz': baseScore + randomVariation(),
      'text2_26': baseScore + randomVariation(),
    };
  };

  const mockTableDataGrouped: Record<string, any> = {};
  for (let i = 1; i <= 15; i++) {
    mockTableDataGrouped[i.toString()] = generateStudentData(i);
  }

  return (
    <div className="space-y-6">
      <H1 className="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground">{displayTitle}</H1>
      <ResponsiveStatsTable
        students={mockTableStudents}
        columnGroups={mockColumnGroups}
        data={mockTableDataGrouped}
      />
    </div>
  );
}