const plural = require('plural-ru');

/**
 * Склоняет слово "группа" в зависимости от количества
 * @param count - количество групп
 * @returns склоненное слово с числом
 */
export function pluralizeGroups(count: number): string {
  return plural(count, `${count} группа`, `${count} группы`, `${count} групп`);
}

/**
 * Склоняет слово "тест" в зависимости от количества
 * @param count - количество тестов
 * @returns склоненное слово с числом
 */
export function pluralizeTests(count: number): string {
  return plural(count, `${count} тест`, `${count} теста`, `${count} тестов`);
}

/**
 * Склоняет слово "ученик" в зависимости от количества
 * @param count - количество учеников
 * @returns склоненное слово с числом
 */
export function pluralizeStudents(count: number): string {
  return plural(count, `${count} ученик`, `${count} ученика`, `${count} учеников`);
}

/**
 * Склоняет слово "участник" в зависимости от количества
 * @param count - количество участников
 * @returns склоненное слово с числом
 */
export function pluralizeParticipants(count: number): string {
  return plural(count, `${count} участник`, `${count} участника`, `${count} участников`);
}

/**
 * Склоняет слово "вопрос" в зависимости от количества
 * @param count - количество вопросов
 * @returns склоненное слово с числом
 */
export function pluralizeQuestions(count: number): string {
  return plural(count, `${count} вопрос`, `${count} вопроса`, `${count} вопросов`);
}

/**
 * Склоняет слово "результат" в зависимости от количества
 * @param count - количество результатов
 * @returns склоненное слово с числом
 */
export function pluralizeResults(count: number): string {
  return plural(count, `${count} результат`, `${count} результата`, `${count} результатов`);
}

/**
 * Склоняет слово "навык" в зависимости от количества
 * @param count - количество навыков
 * @returns склоненное слово с числом
 */
export function pluralizeSkills(count: number): string {
  return plural(count, `${count} навык`, `${count} навыка`, `${count} навыков`);
}

/**
 * Универсальная функция для склонения любого слова
 * @param count - количество
 * @param singular - форма единственного числа (1 файл)
 * @param few - форма для 2-4 (2 файла)
 * @param many - форма для 5+ (5 файлов)
 * @returns склоненное слово с числом
 */
export function pluralize(count: number, singular: string, few: string, many: string): string {
  return plural(count, `${count} ${singular}`, `${count} ${few}`, `${count} ${many}`);
}

/**
 * Склонение без числа (только слово)
 * @param count - количество
 * @param singular - форма единственного числа
 * @param few - форма для 2-4
 * @param many - форма для 5+
 * @returns склоненное слово без числа
 */
export function pluralizeWord(count: number, singular: string, few: string, many: string): string {
  return plural(count, singular, few, many);
}