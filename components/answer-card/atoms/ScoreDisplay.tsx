import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  value: number | string;
  label: string;
  colorClass?: string;
  className?: string;
}

/**
 * Атом: Отображение значения со статистикой
 * Переиспользует паттерн из StatCard
 */
export function ScoreDisplay({
  value,
  label,
  colorClass = 'text-foreground',
  className = ''
}: ScoreDisplayProps) {
  return (
    <div className={cn('bg-muted rounded-lg p-3', className)}>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={cn('font-semibold', colorClass)}>
        {value}
      </div>
    </div>
  );
}
