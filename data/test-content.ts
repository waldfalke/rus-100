// Define types
// Восстанавливаем типы, т.к. они используются в TestItem ниже
type DifficultyType = "none" | "easy" | "hard" | "both";
type DifficultyValue = "easy" | "hard" | "both" | null;

// Экспортируем интерфейсы
export interface TestItem {
  id: number
  title: string
  count?: number
  difficulty?: DifficultyValue // Старое поле
  difficultyType?: DifficultyType // Старое поле
  maxCount?: number
}

export interface TestCategory {
  category: string
  items: TestItem[]
}

export interface EGECategory {
  title: string
  items: TestItem[]
}

export interface EGESection {
  title: string
  categories: EGECategory[]
}

// По заданиям tab data
export const tasksData: TestCategory[] = [
  {
    category: "Работа с текстом",
    items: [
      {
        id: 1,
        title: "№1. Средства связи предложений в тексте",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 2,
        title: "№2. Определение лексического значения слова",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 3,
        title: "№3. Стилистический анализ текстов",
        count: 0,
        difficultyType: "hard",
        maxCount: 10,
      },
      {
        id: 26,
        title: "№26. Средства связи предложений в тексте",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
    ],
  },
  {
    category: "Нормы",
    items: [
      {
        id: 4,
        title: "№4. Постановка ударения",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 5,
        title: "№5. Употребление паронимов",
        count: 0,
        difficultyType: "easy",
        maxCount: 10,
      },
      {
        id: 6,
        title: "№6. Лексические нормы",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 7,
        title: "№7. Морфологические нормы (образование форм слова)",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 8,
        title: "№8. Синтаксические нормы. Нормы согласования. Нормы управления",
        count: 0,
        difficultyType: "hard",
        maxCount: 10,
      },
    ],
  },
  {
    category: "Орфография",
    items: [
      {
        id: 9,
        title: "№9. Правописание корней",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 10,
        title: "№10. Правописание приставок",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 11,
        title: "№11. Правописание суффиксов (кроме -Н-/-НН-)",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 12,
        title: "№12. Правописание личных окончаний глаголов и суффиксов причастий",
        count: 0,
        difficultyType: "hard",
        maxCount: 10,
      },
      {
        id: 13,
        title: "№13. Правописание НЕ и НИ",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 14,
        title: "№14. Слитное, дефисное, раздельное написание слов",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 15,
        title: "№15. Правописание -Н- и -НН- в суффиксах",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
    ],
  },
  {
    category: "Пунктуация",
    items: [
      {
        id: 16,
        title: "№16. Пунктуация в сложносочиненном предложении и в предложении с однородными членами",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 17,
        title: "№17. Знаки препинания в предложениях с обособленными членами",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 18,
        title: "№18. Знаки препинания при словах и конструкциях, не связанных с членами предложения",
        count: 0,
        difficultyType: "hard",
        maxCount: 10,
      },
      {
        id: 19,
        title: "№19. Знаки препинания в сложноподчиненном предложении",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 20,
        title: "№20. Знаки препинания в сложных предложениях с разными видами связи",
        count: 0,
        difficultyType: "hard",
        maxCount: 10,
      },
      {
        id: 21,
        title: "№21. Постановка знаков препинания в различных случаях",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
    ],
  },
  {
    category: "Работа с текстом (продолжение)",
    items: [
      {
        id: 22,
        title: "№22. Языковые средства выразительности",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 23,
        title: "№23. Смысловая и композиционная целостность текста",
        count: 0,
        difficultyType: "both",
        maxCount: 10,
      },
      {
        id: 24,
        title: "№24. Функционально-смысловые типы речи",
        count: 0,
        difficultyType: "hard",
        maxCount: 10,
      },
      {
        id: 25,
        title: "№25. Лексическое значение слова",
        count: 0,
        difficultyType: "easy",
        maxCount: 10,
      },
    ],
  },
]

// Формат ЕГЭ tab data
export const egeFormatData: EGESection[] = [
  {
    title: "Орфография",
    categories: [
      {
        title: "Правила, №9, правописание корней",
        items: [
          {
            id: 101,
            title: "1. Проверяемые гласные в корне",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 102,
            title: "2. Непроверяемые гласные в корне",
            count: 0,
            difficultyType: "hard",
            maxCount: 10,
          },
          {
            id: 103,
            title:
              "4. Чередующиеся корни, которые зависят от ударения: ПЛАВ/ПЛОВ, ЗАР/ЗОР, ГАР/ГОР, ТВАР/ТВОР, КЛАН/КЛОН",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 104,
            title: "5. Чередующиеся корни, которые зависят от суффикса А (+ КАС/КОС)",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 105,
            title: "6. -а(я)- / -им-а- / - ин-а-",
            count: 0,
            difficultyType: "hard",
            maxCount: 10,
          },
        ],
      },
      {
        title: "Правила, №10, правописание приставок",
        items: [
          {
            id: 201,
            title: "1. Неизменяемые приставки",
            count: 0,
            difficultyType: "easy",
            maxCount: 10,
          },
          {
            id: 202,
            title: "2. Приставка С-",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 203,
            title: "3. И/Ы после приставок",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
        ],
      },
    ],
  },
  {
    title: "Пунктуация",
    categories: [
      {
        title: "Правила, №17, Знаки препинания в предложениях с обособленными членами",
        items: [
          {
            id: 301,
            title:
              "1. Обособленные определения, выраженные причастным оборотом, прилагательными с зависимыми словами, одиночными определениями",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 302,
            title: "2. Обособленные обстоятельства",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 303,
            title: "3. Необособленные определения, выраженные причастным оборотом",
            count: 0,
            difficultyType: "hard",
            maxCount: 10,
          },
        ],
      },
    ],
  },
]

// Упражнения tab data
export const exercisesData: EGESection[] = [
  {
    title: "Орфография",
    categories: [
      {
        title: "Правила, №12, Правописание НЕ и НИ",
        items: [
          {
            id: 401,
            title: "1. Слитное/раздельное написание НЕ с глаголами и деепричастиями",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 402,
            title: "2. Слитное/раздельное написание НЕ с прилагательные, наречия, существительные",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 403,
            title: "3. Слитное/раздельное написание НЕ с причастиями",
            count: 0,
            difficultyType: "hard",
            maxCount: 10,
          },
        ],
      },
      {
        title: "Правила, №14, Слитное, дефисное, раздельное написание слов",
        items: [
          {
            id: 501,
            title: "1. Правописание союзов/омонимичные части речи (чтобы/что бы и тд)",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 502,
            title: "2. Правописание частиц (бы, ли, же)",
            count: 0,
            difficultyType: "easy",
            maxCount: 10,
          },
        ],
      },
    ],
  },
  {
    title: "Пунктуация",
    categories: [
      {
        title: "Правила, №16, Пунктуация в сложносочиненном предложении и в предложении с однородными членами",
        items: [
          {
            id: 601,
            title: "1. и О, и О ИЛИ О, и О, и О",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 602,
            title: "2. ОЧП с двойными союзами",
            count: 0,
            difficultyType: "both",
            maxCount: 10,
          },
          {
            id: 603,
            title: "3. ОЧП с союзом ДА",
            count: 0,
            difficultyType: "hard",
            maxCount: 10,
          },
        ],
      },
    ],
  },
]
