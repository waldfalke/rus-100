import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { H3 } from '@/components/ui/typography';
import { FileText, ChevronRight } from 'lucide-react';
import plural from 'plural-ru';

interface StatCardProps {
  title: string;
  testsCompleted: number;
  score: number;
  totalScore: number;
  percentage: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, testsCompleted, score, totalScore, percentage }) => {
  return (
    <Card className="h-full group transition-all duration-200 hover:border-green-600 hover:shadow-md cursor-pointer relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
        <H3 className="truncate">{title}</H3>
        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-app-h3 font-bold">{percentage}%</div>
        <p className="text-app-small text-muted-foreground leading-tight">
          {score} / {totalScore} {plural(totalScore, 'балл', 'балла', 'баллов')} • {testsCompleted} {plural(testsCompleted, 'тест', 'теста', 'тестов')}
        </p>
      </CardContent>
      {/* Кнопка-иконка со стрелочкой в правом нижнем углу с hover эффектом */}
      <div className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-md transition-all duration-200 group-hover:bg-muted/50 pointer-events-none">
        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </Card>
  );
};

export default StatCard;
