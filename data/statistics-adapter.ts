import { StatisticsCardData } from '@/components/ui/statistics-card';

// Интерфейс для тестового задания
interface TestItem {
  id: number;
  title: string;
  description: string;
  content: string;
  type: 'multiple-choice' | 'text' | 'essay';
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficultyType?: string;
}

// Интерфейс для статистики выполнения заданий
export interface TaskCompletionStats {
  taskId: number;
  completedStudents: number;
  totalStudents: number;
  averageScore: number;
  changePercent: number;
}

// Mock данные статистики для разных групп
// Группы: Нормы (4-8), Орфография (9-15), Пунктуация (16-21), Работа с текстом (1-3, 22-26)
const mockTaskStats: Record<string, TaskCompletionStats[]> = {
  '1': [
    // Работа с текстом (1-3) - разные уровни успеваемости
    { taskId: 1, completedStudents: 0, totalStudents: 15, averageScore: 0, changePercent: 0 }, // белый фон
    { taskId: 2, completedStudents: 12, totalStudents: 15, averageScore: 92, changePercent: 5 }, // зеленый фон
    { taskId: 3, completedStudents: 10, totalStudents: 15, averageScore: 78, changePercent: -2 }, // желтый фон
    
    // Нормы (4-8) - разнообразные результаты
    { taskId: 4, completedStudents: 14, totalStudents: 15, averageScore: 88, changePercent: 3 }, // зеленый фон
    { taskId: 5, completedStudents: 8, totalStudents: 15, averageScore: 65, changePercent: -5 }, // розовый фон
    { taskId: 6, completedStudents: 11, totalStudents: 15, averageScore: 75, changePercent: 1 }, // желтый фон
    { taskId: 7, completedStudents: 13, totalStudents: 15, averageScore: 91, changePercent: 7 }, // зеленый фон
    { taskId: 8, completedStudents: 0, totalStudents: 15, averageScore: 0, changePercent: 0 }, // белый фон
    
    // Орфография (9-15) - смешанные результаты
    { taskId: 9, completedStudents: 15, totalStudents: 15, averageScore: 95, changePercent: 8 }, // зеленый фон
    { taskId: 10, completedStudents: 9, totalStudents: 15, averageScore: 72, changePercent: -3 }, // желтый фон
    { taskId: 11, completedStudents: 6, totalStudents: 15, averageScore: 58, changePercent: -8 }, // розовый фон
    { taskId: 12, completedStudents: 12, totalStudents: 15, averageScore: 86, changePercent: 4 }, // зеленый фон
    { taskId: 13, completedStudents: 0, totalStudents: 15, averageScore: 0, changePercent: 0 }, // белый фон
    { taskId: 14, completedStudents: 10, totalStudents: 15, averageScore: 74, changePercent: 2 }, // желтый фон
    { taskId: 15, completedStudents: 7, totalStudents: 15, averageScore: 62, changePercent: -6 }, // розовый фон
    
    // Пунктуация (16-21) - различные уровни
    { taskId: 16, completedStudents: 14, totalStudents: 15, averageScore: 89, changePercent: 6 }, // зеленый фон
    { taskId: 17, completedStudents: 8, totalStudents: 15, averageScore: 71, changePercent: 0 }, // желтый фон
    { taskId: 18, completedStudents: 5, totalStudents: 15, averageScore: 55, changePercent: -10 }, // розовый фон
    { taskId: 19, completedStudents: 13, totalStudents: 15, averageScore: 87, changePercent: 3 }, // зеленый фон
    { taskId: 20, completedStudents: 0, totalStudents: 15, averageScore: 0, changePercent: 0 }, // белый фон
    { taskId: 21, completedStudents: 11, totalStudents: 15, averageScore: 76, changePercent: 1 }, // желтый фон
    
    // Работа с текстом (22-26) - финальные задания
    { taskId: 22, completedStudents: 12, totalStudents: 15, averageScore: 93, changePercent: 9 }, // зеленый фон
    { taskId: 23, completedStudents: 9, totalStudents: 15, averageScore: 68, changePercent: -4 }, // розовый фон
    { taskId: 24, completedStudents: 14, totalStudents: 15, averageScore: 85, changePercent: 5 }, // зеленый фон
    { taskId: 25, completedStudents: 0, totalStudents: 15, averageScore: 0, changePercent: 0 }, // белый фон
    { taskId: 26, completedStudents: 10, totalStudents: 15, averageScore: 79, changePercent: 2 } // желтый фон
  ],
  '2': [
    // Подготовка к ЕГЭ - фокус на основных заданиях
    { taskId: 1, completedStudents: 16, totalStudents: 18, averageScore: 89, changePercent: 4 },
    { taskId: 2, completedStudents: 15, totalStudents: 18, averageScore: 94, changePercent: 6 },
    { taskId: 3, completedStudents: 14, totalStudents: 18, averageScore: 82, changePercent: 2 },
    
    { taskId: 4, completedStudents: 17, totalStudents: 18, averageScore: 91, changePercent: 5 },
    { taskId: 5, completedStudents: 12, totalStudents: 18, averageScore: 73, changePercent: -1 },
    { taskId: 6, completedStudents: 15, totalStudents: 18, averageScore: 85, changePercent: 3 },
    { taskId: 7, completedStudents: 16, totalStudents: 18, averageScore: 88, changePercent: 4 },
    { taskId: 8, completedStudents: 13, totalStudents: 18, averageScore: 76, changePercent: 1 },
    
    { taskId: 9, completedStudents: 18, totalStudents: 18, averageScore: 96, changePercent: 7 },
    { taskId: 10, completedStudents: 14, totalStudents: 18, averageScore: 79, changePercent: 0 },
    { taskId: 11, completedStudents: 11, totalStudents: 18, averageScore: 67, changePercent: -3 },
    { taskId: 12, completedStudents: 16, totalStudents: 18, averageScore: 87, changePercent: 5 },
    { taskId: 13, completedStudents: 10, totalStudents: 18, averageScore: 64, changePercent: -2 },
    { taskId: 14, completedStudents: 15, totalStudents: 18, averageScore: 81, changePercent: 3 },
    { taskId: 15, completedStudents: 12, totalStudents: 18, averageScore: 71, changePercent: -1 },
    
    { taskId: 16, completedStudents: 17, totalStudents: 18, averageScore: 92, changePercent: 6 },
    { taskId: 17, completedStudents: 13, totalStudents: 18, averageScore: 77, changePercent: 2 },
    { taskId: 18, completedStudents: 9, totalStudents: 18, averageScore: 61, changePercent: -4 },
    { taskId: 19, completedStudents: 16, totalStudents: 18, averageScore: 89, changePercent: 4 },
    { taskId: 20, completedStudents: 14, totalStudents: 18, averageScore: 83, changePercent: 3 },
    { taskId: 21, completedStudents: 15, totalStudents: 18, averageScore: 86, changePercent: 5 }
  ],
  '3': [
    // Орфография и пунктуация - углубленное изучение
    { taskId: 1, completedStudents: 19, totalStudents: 22, averageScore: 86, changePercent: 3 },
    { taskId: 2, completedStudents: 20, totalStudents: 22, averageScore: 91, changePercent: 5 },
    { taskId: 3, completedStudents: 18, totalStudents: 22, averageScore: 84, changePercent: 2 },
    
    { taskId: 4, completedStudents: 21, totalStudents: 22, averageScore: 93, changePercent: 6 },
    { taskId: 5, completedStudents: 16, totalStudents: 22, averageScore: 78, changePercent: 1 },
    { taskId: 6, completedStudents: 19, totalStudents: 22, averageScore: 87, changePercent: 4 },
    { taskId: 7, completedStudents: 20, totalStudents: 22, averageScore: 89, changePercent: 3 },
    { taskId: 8, completedStudents: 17, totalStudents: 22, averageScore: 81, changePercent: 2 },
    
    { taskId: 9, completedStudents: 22, totalStudents: 22, averageScore: 97, changePercent: 8 },
    { taskId: 10, completedStudents: 20, totalStudents: 22, averageScore: 88, changePercent: 4 },
    { taskId: 11, completedStudents: 18, totalStudents: 22, averageScore: 82, changePercent: 1 },
    { taskId: 12, completedStudents: 21, totalStudents: 22, averageScore: 94, changePercent: 7 },
    { taskId: 13, completedStudents: 19, totalStudents: 22, averageScore: 85, changePercent: 3 },
    { taskId: 14, completedStudents: 20, totalStudents: 22, averageScore: 90, changePercent: 5 },
    { taskId: 15, completedStudents: 17, totalStudents: 22, averageScore: 79, changePercent: 0 },
    
    { taskId: 16, completedStudents: 21, totalStudents: 22, averageScore: 95, changePercent: 8 },
    { taskId: 17, completedStudents: 19, totalStudents: 22, averageScore: 86, changePercent: 3 },
    { taskId: 18, completedStudents: 16, totalStudents: 22, averageScore: 74, changePercent: -1 },
    { taskId: 19, completedStudents: 20, totalStudents: 22, averageScore: 91, changePercent: 6 },
    { taskId: 20, completedStudents: 18, totalStudents: 22, averageScore: 83, changePercent: 2 },
    { taskId: 21, completedStudents: 19, totalStudents: 22, averageScore: 88, changePercent: 4 }
  ],
  '5': [
    // Работа с текстом (1-3)
    { taskId: 1, completedStudents: 28, totalStudents: 31, averageScore: 82, changePercent: 3 },
    { taskId: 2, completedStudents: 26, totalStudents: 31, averageScore: 88, changePercent: 5 },
    { taskId: 3, completedStudents: 25, totalStudents: 31, averageScore: 79, changePercent: 1 },

    // Нормы (4-8)
    { taskId: 4, completedStudents: 29, totalStudents: 31, averageScore: 85, changePercent: -4 },
    { taskId: 5, completedStudents: 22, totalStudents: 31, averageScore: 77, changePercent: 4 },
    { taskId: 6, completedStudents: 27, totalStudents: 31, averageScore: 82, changePercent: 7 },
    { taskId: 7, completedStudents: 28, totalStudents: 31, averageScore: 85, changePercent: 3 },
    { taskId: 8, completedStudents: 24, totalStudents: 31, averageScore: 74, changePercent: 2 },

    // Орфография (9-15)
    { taskId: 9, completedStudents: 30, totalStudents: 31, averageScore: 91, changePercent: 6 },
    { taskId: 10, completedStudents: 23, totalStudents: 31, averageScore: 76, changePercent: -2 },
    { taskId: 11, completedStudents: 21, totalStudents: 31, averageScore: 68, changePercent: -5 },
    { taskId: 12, completedStudents: 27, totalStudents: 31, averageScore: 84, changePercent: 4 },
    { taskId: 13, completedStudents: 25, totalStudents: 31, averageScore: 78, changePercent: 1 },
    { taskId: 14, completedStudents: 26, totalStudents: 31, averageScore: 81, changePercent: 3 },
    { taskId: 15, completedStudents: 22, totalStudents: 31, averageScore: 71, changePercent: -3 },

    // Пунктуация (16-21)
    { taskId: 16, completedStudents: 29, totalStudents: 31, averageScore: 87, changePercent: 5 },
    { taskId: 17, completedStudents: 24, totalStudents: 31, averageScore: 75, changePercent: 0 },
    { taskId: 18, completedStudents: 20, totalStudents: 31, averageScore: 66, changePercent: -6 },
    { taskId: 19, completedStudents: 28, totalStudents: 31, averageScore: 86, changePercent: 4 },
    { taskId: 20, completedStudents: 25, totalStudents: 31, averageScore: 79, changePercent: 2 },
    { taskId: 21, completedStudents: 26, totalStudents: 31, averageScore: 83, changePercent: 3 },

    // Работа с текстом (22-26)
    { taskId: 22, completedStudents: 30, totalStudents: 31, averageScore: 92, changePercent: 7 },
    { taskId: 23, completedStudents: 23, totalStudents: 31, averageScore: 76, changePercent: -1 },
    { taskId: 24, completedStudents: 28, totalStudents: 31, averageScore: 89, changePercent: 6 },
    { taskId: 25, completedStudents: 22, totalStudents: 31, averageScore: 73, changePercent: -2 },
    { taskId: 26, completedStudents: 27, totalStudents: 31, averageScore: 84, changePercent: 4 }
  ]
};

// Функция для получения уровня сложности
function getDifficultyLevel(difficultyType?: string): 1 | 2 | 3 {
  switch (difficultyType) {
    case 'easy': return 1;
    case 'both': return 2;
    case 'hard': return 3;
    default: return 2;
  }
}

// Функция для извлечения номера задания из заголовка
function extractTaskNumber(title: string): string {
  const match = title.match(/№\s*(\d+)/);
  return match ? `№${match[1]}` : title.split('.')[0] || title.substring(0, 10);
}

// Функция для преобразования TestItem в StatisticsCardData
function convertTaskToStatisticsCard(
  item: TestItem, 
  stats: TaskCompletionStats | undefined,
  categoryName: string
): StatisticsCardData {
  const taskNumber = extractTaskNumber(item.title);
  
  // Специальная детальная статистика для задания №16
  const generateTask16DetailedStats = () => {
    return {
      recentStats: {
        title: "Средний балл по последним 15 вопросам",
        items: [
          { name: "и О, и О ИЛИ О, и О, и О", correct: 20, total: 20, percentage: 0 },
          { name: "О, О", correct: 9, total: 9, percentage: 0 },
          { name: "Здесь просто не должно быть запятых)", correct: 19, total: 28, percentage: 32 },
          { name: "ССП", correct: 8, total: 11, percentage: 27 },
          { name: "ОЧП с союзом ДА", correct: 4, total: 4, percentage: 0 },
          { name: "ОЧП с двойными союзами", correct: 11, total: 19, percentage: 42 },
          { name: "Комбинация распространённого и одиночного определения", correct: 2, total: 2, percentage: 0 },
          { name: "ОЧП, соединённые попарно", correct: 7, total: 19, percentage: 63 },
          { name: "ОЧП, соединённые одиночными союзами", correct: 1, total: 31, percentage: 97 },
          { name: "Разные ряды ОЧП (два ряда, каждый из которых соединён своим одиночным союзом)", correct: 1, total: 34, percentage: 97 },
          { name: "Однородные/неоднородные определения", correct: 0, total: 5, percentage: 100 }
        ]
      },
      totalStats: {
        title: "Средний балл за всё время",
        items: [
          { name: "и О, и О ИЛИ О, и О, и О", correct: 77, total: 118, percentage: 35 },
          { name: "ССП", correct: 43, total: 59, percentage: 27 },
          { name: "ОЧП с двойными союзами", correct: 47, total: 70, percentage: 33 },
          { name: "О, О", correct: 21, total: 25, percentage: 16 },
          { name: "Здесь просто не должно быть запятых)", correct: 25, total: 49, percentage: 49 },
          { name: "ОЧП, соединённые попарно", correct: 26, total: 54, percentage: 52 },
          { name: "Запятая в ССП с общим компонентом", correct: 6, total: 6, percentage: 0 },
          { name: "ОЧП с союзом ДА", correct: 10, total: 13, percentage: 23 },
          { name: "ОЧП, соединённые одиночными союзами", correct: 32, total: 135, percentage: 76 },
          { name: "Комбинация распространённого и одиночного определения", correct: 4, total: 7, percentage: 43 },
          { name: "Фразеологизм", correct: 1, total: 1, percentage: 0 },
          { name: "Однородные/неоднородные определения", correct: 6, total: 19, percentage: 68 },
          { name: "Разные ряды ОЧП (два ряда, каждый из которых соединён своим одиночным союзом)", correct: 17, total: 111, percentage: 85 }
        ]
      }
    };
  };
  
  // Генерируем детальную статистику если есть основная статистика
  const generateDetailedStats = (stats: TaskCompletionStats) => {
    // Если это задание №16, используем специальные данные
    const taskNum = parseInt(taskNumber.replace(/[^\d]/g, '')) || 0;
    if (taskNum === 16) {
      return generateTask16DetailedStats();
    }
    
    const completionRate = (stats.completedStudents / stats.totalStudents) * 100;
    
    // Генерируем реалистичные данные для последних результатов
    const recentCorrect = Math.max(1, Math.floor(stats.completedStudents * 0.7));
    const recentTotal = Math.max(recentCorrect, Math.floor(stats.completedStudents * 0.8));
    
    // Генерируем данные для разных типов ошибок
    const errorTypes = [
      'Орфографические ошибки',
      'Пунктуационные ошибки', 
      'Грамматические ошибки',
      'Чередующиеся корни, которые зависят от последней согласной корня. (ЛАГ/ЛОЖ, РАСТ/РАЩ/РОС, СКАК/СКОЧ)'
    ];
    
    const recentItems = errorTypes.slice(0, Math.min(3, errorTypes.length)).map((errorType, index) => {
      const correct = Math.max(0, recentCorrect - Math.floor(Math.random() * 3));
      const total = recentTotal;
      return {
        name: errorType,
        correct,
        total,
        percentage: Math.round((correct / total) * 100)
      };
    });
    
    // Общая статистика (немного лучше последних результатов)
    const totalItems = errorTypes.map((errorType, index) => {
      const correct = Math.max(0, stats.completedStudents - Math.floor(Math.random() * 2));
      const total = stats.totalStudents;
      return {
        name: errorType,
        correct,
        total,
        percentage: Math.round((correct / total) * 100)
      };
    });
    
    return {
      recentStats: {
        title: "Последние результаты (за неделю)",
        items: recentItems
      },
      totalStats: {
        title: "Общая статистика",
        items: totalItems
      }
    };
  };
  
  return {
    id: item.id.toString(),
    questionNumber: taskNumber,
    title: item.title,
    completedWorkouts: stats?.completedStudents || 0,
    averageScore: stats?.averageScore || 0,
    changePercent: stats?.changePercent || 0,
    level: getDifficultyLevel(item.difficultyType),
    details: stats ? generateDetailedStats(stats) : undefined
  };
}

// Функция для получения статистики заданий по группе
export function getTaskStatisticsByGroupId(groupId: string): Record<string, StatisticsCardData[]> {
  const groupStats = mockTaskStats[groupId] || [];
  const result: Record<string, StatisticsCardData[]> = {};

  // Создаем категории согласно новым данным
  const categories = {
    'Работа с текстом': [1, 2, 3, 22, 23, 24, 25, 26],
    'Нормы': [4, 5, 6, 7, 8],
    'Орфография': [9, 10, 11, 12, 13, 14, 15],
    'Пунктуация': [16, 17, 18, 19, 20, 21]
  };

  // Создаем карточки для каждой категории
  Object.entries(categories).forEach(([categoryName, taskIds]) => {
    const categoryStats: StatisticsCardData[] = [];
    
    taskIds.forEach(taskId => {
      const stats = groupStats.find(s => s.taskId === taskId);
      if (stats) {
        // Создаем mock TestItem для задания
        const mockItem = {
          id: taskId,
          title: `№${taskId}`,
          description: `Задание №${taskId}`,
          content: '',
          type: 'multiple-choice' as const,
          options: [],
          correctAnswer: '',
          explanation: ''
        };
        
        categoryStats.push(convertTaskToStatisticsCard(mockItem, stats, categoryName));
      }
    });

    if (categoryStats.length > 0) {
      result[categoryName] = categoryStats;
    }
  });

  return result;
}