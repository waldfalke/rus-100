// data/difficulty-data.ts

// Структура для хранения статистики сложности по каждому заданию
export interface TaskDifficultyStats {
  easiest: number; // Количество "самых легких" заданий
  easy: number;    // Количество "легких" заданий
  medium: number;  // Количество "средних" заданий
  hard: number;    // Количество "сложных" заданий
  hardest: number; // Количество "самых сложных" заданий
  // Можно добавить unclassified, если нужно
}

// Тип для объекта, хранящего статистику по ID задания
// ID задания будет строкой для унификации (e.g., "tasks-1", "ege-1-1", "ex-1-1-1")
export type DifficultyDataMap = Record<string, TaskDifficultyStats>;

// Мок-данные, имитирующие данные из отчета
// Используем ID из test-content.ts, добавляя префикс вкладки для уникальности
export const difficultyStatsData: DifficultyDataMap = {
  // --- Задания из вкладки "По заданиям" (префикс 'tasks-') ---
  "tasks-1":  { easiest: 2, easy: 5, medium: 10, hard: 6, hardest: 1 },
  "tasks-2":  { easiest: 3, easy: 8, medium: 12, hard: 5, hardest: 2 },
  "tasks-3":  { easiest: 0, easy: 2, medium: 8,  hard: 10, hardest: 5 }, // Пример сложного
  "tasks-26": { easiest: 1, easy: 4, medium: 9,  hard: 7, hardest: 3 },
  "tasks-4":  { easiest: 5, easy: 10, medium: 15, hard: 3, hardest: 1 },
  "tasks-5":  { easiest: 8, easy: 15, medium: 10, hard: 2, hardest: 0 }, // Пример легкого
  "tasks-6":  { easiest: 2, easy: 6, medium: 11, hard: 8, hardest: 2 },
  "tasks-7":  { easiest: 1, easy: 5, medium: 10, hard: 9, hardest: 4 },
  "tasks-8":  { easiest: 0, easy: 1, medium: 7,  hard: 12, hardest: 6 }, // Пример сложного
  "tasks-9":  { easiest: 3, easy: 7, medium: 13, hard: 6, hardest: 2 },
  "tasks-10": { easiest: 4, easy: 8, medium: 14, hard: 5, hardest: 1 },
  "tasks-11": { easiest: 2, easy: 6, medium: 12, hard: 7, hardest: 3 },
  "tasks-12": { easiest: 0, easy: 2, medium: 9,  hard: 11, hardest: 5 }, // Пример сложного
  "tasks-13": { easiest: 3, easy: 8, medium: 11, hard: 6, hardest: 2 },
  "tasks-14": { easiest: 2, easy: 7, medium: 13, hard: 7, hardest: 3 },
  "tasks-15": { easiest: 4, easy: 9, medium: 12, hard: 5, hardest: 1 },
  "tasks-16": { easiest: 3, easy: 7, medium: 10, hard: 8, hardest: 3 },
  "tasks-17": { easiest: 2, easy: 6, medium: 11, hard: 9, hardest: 4 },
  "tasks-18": { easiest: 1, easy: 3, medium: 8,  hard: 12, hardest: 6 }, // Пример сложного
  "tasks-19": { easiest: 3, easy: 8, medium: 12, hard: 7, hardest: 2 },
  "tasks-20": { easiest: 1, easy: 4, medium: 9,  hard: 11, hardest: 5 }, // Пример сложного
  "tasks-21": { easiest: 2, easy: 7, medium: 11, hard: 8, hardest: 3 },
  "tasks-22": { easiest: 4, easy: 9, medium: 13, hard: 5, hardest: 1 },
  "tasks-23": { easiest: 3, easy: 8, medium: 12, hard: 6, hardest: 2 },
  "tasks-24": { easiest: 1, easy: 3, medium: 8,  hard: 10, hardest: 5 }, // Пример сложного
  "tasks-25": { easiest: 2, easy: 6, medium: 10, hard: 9, hardest: 4 },
  // --- Добавьте ID из вкладок "Формат ЕГЭ" (префикс 'ege-') и "Упражнения" (префикс 'ex-') по аналогии ---
  // Пример для ЕГЭ
  "ege-1-1": { easiest: 5, easy: 10, medium: 8, hard: 3, hardest: 1 }, // ID = 1, Категория = 1, Секция = 1 (?)
  // Пример для Упражнений
  "ex-1-1-1": { easiest: 10, easy: 15, medium: 5, hard: 1, hardest: 0 }, // ID = 1, Категория = 1, Секция = 1 (?)
}; 