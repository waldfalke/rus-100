import * as React from 'react';
import { formatSubmissionDate } from '../utils/formatters';

interface SubmissionHeaderProps {
  studentName: string;
  studentEmail: string;
  submittedAt: string;
}

/**
 * Молекула: Заголовок карточки с информацией об ученике
 * Переиспользует StudentAvatar atom и паттерн из StudentCard
 */
export function SubmissionHeader({
  studentName,
  studentEmail,
  submittedAt
}: SubmissionHeaderProps) {
  return (
    <div className="flex items-start">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground truncate">
          {studentName}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {studentEmail}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatSubmissionDate(submittedAt)}
        </div>
      </div>
    </div>
  );
}
