import * as React from 'react';
import { ScoreDisplay } from '../atoms/ScoreDisplay';
import { getScoreColor } from '../utils/formatters';

interface SubmissionStatsProps {
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
}

/**
 * Молекула: Статистика прохождения теста
 * Переиспользует ScoreDisplay atom и паттерн сетки из существующих карточек
 */
export function SubmissionStats({
  totalQuestions,
  correctAnswers,
  scorePercent
}: SubmissionStatsProps) {
  const scoreColors = getScoreColor(scorePercent);
  const incorrectAnswers = totalQuestions - correctAnswers;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <ScoreDisplay
        label="Всего вопросов"
        value={totalQuestions}
      />
      <ScoreDisplay
        label="Правильные"
        value={correctAnswers}
        colorClass="text-green-700"
      />
      <ScoreDisplay
        label="Неправильные"
        value={incorrectAnswers}
        colorClass="text-red-700"
      />
      <ScoreDisplay
        label="Итоговый балл"
        value={`${scorePercent}%`}
        colorClass={scoreColors.text}
      />
    </div>
  );
}
