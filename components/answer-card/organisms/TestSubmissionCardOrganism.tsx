'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { SubmissionHeader } from '../molecules/SubmissionHeader';
import { TestInfo } from '../molecules/TestInfo';
import { SubmissionStats } from '../molecules/SubmissionStats';
import { TestSubmissionCardProps } from '../types';

/**
 * Организм: Карточка уведомления о прохождении теста учеником
 * Переиспользует стили и паттерны из GroupCard и StatCard
 */
export function TestSubmissionCardOrganism({
  submission,
  onViewDetails
}: TestSubmissionCardProps) {
  const handleClick = () => {
    onViewDetails?.(submission.id);
  };

  return (
    <Card className="group transition-all duration-200 hover:border-primary hover:shadow-md cursor-pointer">
      <CardContent className="p-4 space-y-4">
        {/* Заголовок с информацией об ученике */}
        <SubmissionHeader
          studentName={submission.studentName}
          studentEmail={submission.studentEmail}
          submittedAt={submission.submittedAt}
        />

        {/* Информация о тесте */}
        <TestInfo testTitle={submission.testTitle} />

        {/* Статистика */}
        <SubmissionStats
          totalQuestions={submission.totalQuestions}
          correctAnswers={submission.correctAnswers}
          scorePercent={submission.scorePercent}
        />

        {/* Кнопка просмотра деталей */}
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            Посмотреть детали
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
