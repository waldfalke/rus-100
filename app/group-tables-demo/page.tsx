import React from 'react';
import StatCard from '@/components/feature/StatCard';
import { H1, P } from '@/components/ui/typography';
import { getTableStatisticsByGroupId, TableStats } from '@/data/statistics-adapter';

const GroupTablesDemoPage = () => {
  const tableStats: TableStats[] = getTableStatisticsByGroupId('1');

  return (
    <div className="w-full">
      <H1 className="mb-2">Таблицы группы (демо)</H1>
      <P className="mb-4">Низкоуровневая статистика по типам заданий.</P>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tableStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            testsCompleted={stat.testsCompleted}
            score={stat.score}
            totalScore={stat.totalScore}
            percentage={stat.percentage}
          />
        ))}
      </section>
    </div>
  );
};

export default GroupTablesDemoPage;
