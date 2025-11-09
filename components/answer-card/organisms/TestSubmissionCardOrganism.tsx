'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen } from 'lucide-react';
import { TestSubmissionCardProps } from '../types';
import { formatSubmissionDate, getScoreColor } from '../utils/formatters';
import { ScoreDisplay } from '../atoms/ScoreDisplay';

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

  const scoreColors = getScoreColor(submission.scorePercent);
  const incorrectAnswers = submission.totalQuestions - submission.correctAnswers;

  return (
    <Card className="group transition-all duration-200 hover:border-primary hover:shadow-md cursor-pointer" onClick={handleClick}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="truncate">{submission.testTitle}</CardTitle>
          <CardDescription>{formatSubmissionDate(submission.submittedAt)}</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="transition-colors -mt-2 -mr-2"
        >
          <span className="sr-only">Посмотреть детали</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <ScoreDisplay
            label="Ученик"
            value={submission.studentName}
            className="col-span-2 sm:col-span-1"
          />
          <ScoreDisplay
            label="Всего вопросов"
            value={submission.totalQuestions}
          />
          <ScoreDisplay
            label="Правильные"
            value={submission.correctAnswers}
            colorClass="text-green-700"
          />
          <ScoreDisplay
            label="Неправильные"
            value={incorrectAnswers}
            colorClass="text-red-700"
          />
          <ScoreDisplay
            label="Итоговый балл"
            value={`${submission.scorePercent}%`}
            colorClass={scoreColors.text}
          />
        </div>
      </CardContent>
    </Card>
  );
}
