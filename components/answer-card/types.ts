/**
 * Типы для компонента answer-card (карточка уведомления о прохождении теста)
 */

export interface TestSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  testId: string;
  testTitle: string;
  submittedAt: string; // ISO date string
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
}

export interface TestSubmissionCardProps {
  submission: TestSubmission;
  onViewDetails?: (submissionId: string) => void;
}
