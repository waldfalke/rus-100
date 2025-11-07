import * as React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '../utils/formatters';

interface StudentAvatarProps {
  studentName: string;
  className?: string;
}

/**
 * Атом: Аватар ученика с инициалами
 * Переиспользует Avatar из shadcn/ui
 */
export function StudentAvatar({ studentName, className = '' }: StudentAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {getInitials(studentName)}
      </AvatarFallback>
    </Avatar>
  );
}
