import * as React from 'react';
import { BookOpen } from 'lucide-react';

interface TestInfoProps {
  testTitle: string;
}

/**
 * Молекула: Информация о тесте
 */
export function TestInfo({ testTitle }: TestInfoProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="font-medium text-foreground truncate">
        {testTitle}
      </span>
    </div>
  );
}
