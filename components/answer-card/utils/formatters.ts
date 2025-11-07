/**
 * Утилиты форматирования для answer-card
 */

/**
 * Форматирует дату в короткий формат (дата + время)
 */
export function formatSubmissionDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  // Если меньше часа - показываем минуты
  if (minutes < 60) {
    return `${minutes} мин назад`;
  }
  // Если меньше суток - показываем часы
  if (hours < 24) {
    return `${hours} ч назад`;
  }
  // Если меньше недели - показываем дни
  if (days < 7) {
    return `${days} дн назад`;
  }

  // Иначе показываем дату
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Возвращает инициалы из имени
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Возвращает цвет для процента правильных ответов
 */
export function getScoreColor(scorePercent: number): {
  text: string;
  bg: string;
} {
  if (scorePercent >= 85) {
    return { text: 'text-green-700', bg: 'bg-green-50' };
  } else if (scorePercent >= 70) {
    return { text: 'text-yellow-700', bg: 'bg-yellow-50' };
  } else if (scorePercent >= 50) {
    return { text: 'text-orange-700', bg: 'bg-orange-50' };
  }
  return { text: 'text-red-700', bg: 'bg-red-50' };
}
