"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2, ArrowLeft, User, FolderPlus, Dice3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { tasksData, egeFormatData, exercisesData, TestItem, TestCategory, EGESection, EGECategory } from "@/data/test-content"
import { SelectableExamText } from "@/components/feature/selectable-exam-text"
import { Badge } from "@/components/ui/badge"
import { difficultyStatsData, TaskDifficultyStats, DifficultyDataMap } from "@/data/difficulty-data"

// Define difficulty types
// type DifficultyType = "none" | "easy" | "hard" | "both" // Old types - removed
// type DifficultyValue = "easy" | "hard" | "both" | null // Old types - removed

// --- Новая структура данных для уровней сложности ---
interface DifficultyLevel {
  id: string // e.g., 'any', 'easiest', 'medium', 'hardest'
  label: string // e.g., 'Любая', 'Самые лёгкие', 'Средние', 'Самые сложные'
  count: number // количество доступных вопросов
}

// --- Базовый интерфейс для элементов заданий ---
interface Item {
  id: string | number // ID может быть строкой или числом
  count?: number
  maxCount?: number
  difficulty?: string // Старое поле, может присутствовать в данных
  // Добавьте другие общие свойства, если они используются в handleCountChange
}

// --- Интерфейсы для типизации циклов в handleCountChange ---
interface SimpleCategory {
  items: Item[]
  // Добавьте другие свойства категории, если они используются
}

interface SimpleSection {
  categories: SimpleCategory[]
  // Добавьте другие свойства секции, если они используются
}

// --- Определяем порядок и метки для уровней сложности --- 
// (убираем count из этой структуры, т.к. он будет вычисляться)
interface DifficultyTier {
  id: 'easiest' | 'easy' | 'medium' | 'hard' | 'hardest'; // Уровни сложности
  label: string; // Метка для отображения
}

const difficultyTiers: DifficultyTier[] = [
  { id: "easiest", label: "Самые лёгкие" },
  { id: "easy", label: "Лёгкие" },
  { id: "medium", label: "Средние" },
  { id: "hard", label: "Сложные" },
  { id: "hardest", label: "Самые сложные" },
  // { id: "unclassified", label: "Без данных" }, // Можно добавить при необходимости
];

// --- Интерфейс для состояния difficultyLevels (включая 'any') ---
interface DisplayDifficultyLevel {
  id: string; // 'any' или id из DifficultyTier
  label: string;
  count: number;
}

// --- Мок-данные для примера ---
// const mockDifficultyLevels: DifficultyLevel[] = [...]; 

export default function TestGenerator() {
  // --- Инициализируем состояния пустыми массивами --- 
  const [testName, setTestName] = useState("")
  const [testGroup, setTestGroup] = useState<string | undefined>(undefined)
  const [account, setAccount] = useState<string | undefined>(undefined)
  const [tasksDataState, setTasksDataState] = useState<TestCategory[] | null>(null);
  const [egeFormatDataState, setEgeFormatDataState] = useState<EGESection[] | null>(null);
  const [exercisesDataState, setExercisesDataState] = useState<EGESection[] | null>(null);
  const [itemDifficulties, setItemDifficulties] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedTab, setSelectedTab] = useState("tasks");
  const [newGroup, setNewGroup] = useState("")
  const [buttonText, setButtonText] = useState("Создать тест")

  const totalLimit = 50
  const [totalSelected, setTotalSelected] = useState(0)
  const progress = (totalSelected / totalLimit) * 100

  const [tasksSelected, setTasksSelected] = useState(false)
  const [egeSelected, setEgeSelected] = useState(false)
  const [exercisesSelected, setExercisesSelected] = useState(false)

  // Добавляем состояние для отслеживания загрузки
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Модифицируем useEffect для лучшей обработки загрузки данных
  useEffect(() => {
    try {
      // Проверяем наличие данных
      if (!tasksData || !egeFormatData || !exercisesData) {
        throw new Error('Data is missing');
      }

      // Инициализируем данные
      setTasksDataState(tasksData);
      setEgeFormatDataState(egeFormatData);
      setExercisesDataState(exercisesData);
      
      // Автоматически разворачиваем первую категорию
      if (tasksData.length > 0) {
        setExpandedCategories(prev => ({ ...prev, [tasksData[0].category]: true }));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing data:', error);
      setIsError(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    updateButtonText()
  }, [tasksSelected, egeSelected, exercisesSelected])

  const updateButtonText = () => {
    const selectedTabs = []
    if (tasksSelected) selectedTabs.push("по заданиям")
    if (egeSelected) selectedTabs.push("ЕГЭ")
    if (exercisesSelected) selectedTabs.push("упражнения")

    if (selectedTabs.length === 0) {
      setButtonText("Создать тест")
    } else if (selectedTabs.length === 1) {
      setButtonText(`Создать тест ${selectedTabs[0]}`)
    } else if (selectedTabs.length === 2) {
      setButtonText(`Создать тест ${selectedTabs[0]} и ${selectedTabs[1]}`)
    } else {
      setButtonText(`Создать тест ${selectedTabs[0]}, ${selectedTabs[1]} и ${selectedTabs[2]}`)
    }
  }

  // Добавляем типы к параметрам handleCountChange
  const handleCountChange = (
    id: string | number, // ID может быть строкой или числом
    categoryIdentifier: string, // Используем общее имя
    increment: number, // Инкремент - число
    tabType: "tasks" | "ege" | "exercises" // Тип вкладки
  ) => {
    let updatedData
    if (tabType === "tasks") {
      updatedData = JSON.parse(JSON.stringify(tasksDataState))
      // Find the item and update its count
      for (const categoryData of updatedData) {
        // Указываем тип Item для item
        const item: TestItem | undefined = categoryData.items.find((item: TestItem) => item.id === id)
        if (item) {
          const oldCount = item.count || 0
          const newCount = Math.max(
            0,
            Math.min(item.maxCount || 10, oldCount + increment)
          )
          item.count = newCount

          // Update total selected count
          setTotalSelected((prev) =>
            Math.max(0, Math.min(totalLimit, prev + (newCount - oldCount)))
          )

          // Update tab selection state if there are any items selected
          const hasSelectedItems = updatedData.some((cat: TestCategory) =>
            cat.items.some((item: TestItem) => item.count && item.count > 0)
          )
          setTasksSelected(hasSelectedItems)
          setTasksDataState(updatedData)
          break
        }
      }
    } else if (tabType === "ege" || tabType === "exercises") { // Объединяем логику для EGE и Exercises
      const currentState = tabType === "ege" ? egeFormatDataState : exercisesDataState;
      updatedData = JSON.parse(JSON.stringify(currentState));
      let found = false;
      for (const section of updatedData) {
        for (const categoryData of section.categories) {
          const item: TestItem | undefined = categoryData.items.find((item: TestItem) => item.id === id);
          if (item) {
            const oldCount = item.count || 0;
            const newCount = Math.max(
              0,
              Math.min(item.maxCount || 10, oldCount + increment)
            );
            item.count = newCount;
            setTotalSelected((prev) => Math.max(0, Math.min(totalLimit, prev + (newCount - oldCount))));

            const hasSelectedItems = updatedData.some((sec: EGESection) =>
              sec.categories.some((cat: EGECategory) =>
                cat.items.some((i: TestItem) => i.count && i.count > 0)
              )
            );
            if (tabType === "ege") setEgeSelected(hasSelectedItems);
            else setExercisesSelected(hasSelectedItems);

            if (tabType === "ege") setEgeFormatDataState(updatedData);
            else setExercisesDataState(updatedData);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }

  // ADD NEW PER-ITEM HANDLER
  const handleItemDifficultyChange = (itemId: string | number, difficultyId: string) => {
    setItemDifficulties(prev => ({
      ...prev,
      [itemId]: difficultyId // Set the difficulty for the specific item
    }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // --- Модифицированная renderItemRow --- 
  const renderItemRow = (item: TestItem, category: TestCategory | EGECategory, tabType: "tasks" | "ege" | "exercises") => {
      const currentCount = item.count || 0;
      const maxCount = item.maxCount || 10;
      const categoryIdentifier = 'category' in category ? category.category : category.title; 
      
      // Формируем уникальный ID для поиска в difficultyStatsData
      // Префиксы должны совпадать с ключами в data/difficulty-data.ts
      const statsId = `${tabType}-${item.id}`;
      const itemStats: TaskDifficultyStats | undefined = difficultyStatsData[statsId];

      return (
        // Оборачиваем в Card для лучшего вида, если нужно
        <Card key={item.id} className="border border-gray-200 mb-2">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* Название задания */}
              <span className="text-sm text-gray-800 flex-grow pr-4">{item.title}</span>

              {/* Блок управления (сложность + количество) */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 w-full sm:w-auto justify-end">
                
                {/* Чипсы сложности для этого задания */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  {itemStats ? (
                    <>
                      {/* "Любая" Badge */}
                      <Badge
                        key={`${item.id}-any`}
                        variant={!itemDifficulties[item.id] || itemDifficulties[item.id] === 'any' ? "default" : "outline"}
                        onClick={() => handleItemDifficultyChange(item.id, 'any')}
                        className={`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${
                          !itemDifficulties[item.id] || itemDifficulties[item.id] === 'any'
                            ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        role="radio"
                        aria-checked={!itemDifficulties[item.id] || itemDifficulties[item.id] === 'any'}
                        tabIndex={0}
                      >
                        <Dice3 className="w-3 h-3" />
                        Любая ({Object.values(itemStats).reduce((sum, count) => sum + count, 0)})
                      </Badge>

                      {/* Tier-specific Badges */}
                      {difficultyTiers.map(tier => {
                        const countForItemTier = itemStats[tier.id] || 0;
                        const isDisabled = countForItemTier === 0;
                        const isSelected = itemDifficulties[item.id] === tier.id;

                        return (
                          <Badge
                            key={`${item.id}-${tier.id}`}
                            variant={isSelected && !isDisabled ? "default" : "outline"}
                            onClick={() => !isDisabled && handleItemDifficultyChange(item.id, tier.id)}
                            className={`cursor-pointer transition-colors text-xs px-2 py-0.5 ${ 
                              isDisabled
                                ? "cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 border-gray-200"
                                : isSelected
                                ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                            aria-disabled={isDisabled}
                            role="radio"
                            aria-checked={isSelected && !isDisabled}
                            tabIndex={isDisabled ? -1 : 0}
                          >
                            {tier.label} ({countForItemTier})
                          </Badge>
                        );
                      })}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Нет данных о сложности</span>
                  )}
                </div>

                {/* Разделитель */}
                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                {/* Кнопки +/- */} 
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCountChange(item.id, categoryIdentifier, -1, tabType)}
                    disabled={currentCount <= 0}
                  >
                    -
                  </Button>
                  <span className="text-sm font-medium w-8 text-center tabular-nums">{currentCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCountChange(item.id, categoryIdentifier, 1, tabType)}
                    disabled={currentCount >= maxCount}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };

  // Добавляем обработку состояний загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Progress value={30} className="w-[60%] mx-auto" />
          <p className="mt-4">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Ошибка загрузки</h2>
          <p className="mt-2">Не удалось загрузить данные. Пожалуйста, обновите страницу.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Обновить страницу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-sans pb-24 min-h-screen">
      {/* Top navigation */}
      <nav className="max-w-6xl bg-[#434343] rounded-2xl flex items-center p-2 mx-auto mt-5 mb-10 relative">
        <span className="text-white text-sm font-medium px-3 py-2">
          Русский<span className="text-teal-400">_100</span>
        </span>

        <div className="hidden lg:flex flex-wrap flex-1 items-center">
          <a
            href="#"
            className="text-white text-sm font-medium bg-[#515151] rounded-xl px-4 py-2 mx-1 my-1 text-center hover:bg-[#616161]"
          >
            Дашборд
          </a>
          <a
            href="#"
            className="text-white text-sm font-medium bg-[#515151] rounded-xl px-4 py-2 mx-1 my-1 text-center hover:bg-[#616161]"
          >
            Задания
          </a>
          <a
            href="#"
            className="text-white text-sm font-medium bg-[#515151] rounded-xl px-4 py-2 mx-1 my-1 text-center hover:bg-[#616161]"
          >
            Результаты
          </a>
        </div>

        <div className="relative ml-auto mx-1 my-1">
          <div className="text-white text-sm font-medium bg-[#515151] rounded-xl px-3 py-2 text-center hover:bg-[#616161] cursor-pointer">
            <User className="inline-block w-5 h-5" />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="container max-w-6xl mx-auto p-3 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <nav className="breadcrumbs text-sm text-gray-600 hidden sm:block">
            <a href="#" className="hover:underline">
              Главная
            </a>{" "}
            &gt; <span>Генерация теста</span>
          </nav>
          <a href="#" className="text-teal-600 hover:underline sm:hidden flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" /> Назад
          </a>
          <a href="#" className="text-teal-600 hover:underline text-sm sm:text-base">
            Мои тесты
          </a>
        </div>

        {/* Test generation header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Edit2 className="mr-2 text-teal-600 w-6 h-6" /> Генерация теста
        </h1>
        <p className="text-sm text-gray-600 mt-2 mb-6">
          Выберите задания для включения в тест (не более 50), укажите название, аккаунт и группу, затем нажмите
          "Создать тест".
        </p>

        {/* Form */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="test-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Название теста <span className="text-red-500">*</span>
                </label>
                <Input
                  id="test-name"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Введите название теста"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="test-group" className="block text-sm font-medium text-gray-700 mb-1">
                  Группа тестов
                </label>
                <div className="flex items-center gap-2">
                  <Select value={testGroup} onValueChange={setTestGroup}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-- Выберите --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Тесты-25</SelectItem>
                      <SelectItem value="4">Пунктуация</SelectItem>
                      <SelectItem value="5">Пунктуация. Контроль.</SelectItem>
                      <SelectItem value="6">Чекапы</SelectItem>
                      <SelectItem value="7">Сочинение</SelectItem>
                      <SelectItem value="8">Сочинение. Контроль.</SelectItem>
                      <SelectItem value="9">Грамматика</SelectItem>
                      <SelectItem value="10">Грамматика контроль</SelectItem>
                      <SelectItem value="29">Сгенерированные тесты</SelectItem>
                      <SelectItem value="60">ЕГКР (от ФИПИ)</SelectItem>
                      <SelectItem value="127">Орфография</SelectItem>
                      <SelectItem value="128">Орфография. Контроль</SelectItem>
                      <SelectItem value="255">Орфография (тексты с пропущенными буквами)</SelectItem>
                      <SelectItem value="333">Речь</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <FolderPlus className="h-5 w-5 text-teal-600" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="account-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Аккаунт
                </label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Выберите аккаунт --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Аккаунт 1</SelectItem>
                    <SelectItem value="2">Аккаунт 2</SelectItem>
                    <SelectItem value="3">Аккаунт 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* --- УДАЛЕНА ВСТАВКА ГЛОБАЛЬНЫХ ЧИПОВ --- */}
          {/* <div className="mb-6"> {renderDifficultyChips()} </div> */}

        </div>

        {/* Selectable Exam Text */}
        <div className="mb-4">
          <SelectableExamText />
        </div>

        {/* Tabs */}
        <Tabs 
          defaultValue="tasks" 
          value={selectedTab} 
          onValueChange={setSelectedTab} 
          className="w-full max-w-full flex flex-col"
        >
          <div className="border-b border-gray-200 sticky top-0 z-30 bg-white shadow-sm overflow-hidden rounded-t-xl">
            <TabsList className="grid w-full grid-cols-3 bg-transparent shadow-none border-0 h-auto p-0 m-0">
              <TabsTrigger
                value="tasks"
                className="py-3 px-4 text-gray-500 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-none hover:text-gray-700 transition-colors"
              >
                По заданиям
              </TabsTrigger>
              <TabsTrigger
                value="ege"
                className="py-3 px-4 text-gray-500 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-none hover:text-gray-700 transition-colors"
              >
                Формат ЕГЭ
              </TabsTrigger>
              <TabsTrigger
                value="exercises"
                className="py-3 px-4 text-gray-500 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-none hover:text-gray-700 transition-colors"
              >
                Упражнения
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Общий контейнер для всех вкладок с единым отступом */}
          <div className="pt-6">
            {/* Восстановленное содержимое вкладок */}
            <TabsContent value="tasks" className="w-full max-w-full mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Генерация по заданиям</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Выберите количество вопросов и уровень сложности для каждого задания:
                </p>
                {tasksDataState?.map((category: TestCategory) => {
                  if (!category) return null;
                  return (
                  <div key={category.category} className="mb-6">
                    <div
                      className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg cursor-pointer"
                      onClick={() => toggleCategory(category.category)}
                    >
                      <h3 className="font-medium text-gray-800">{category.category}</h3>
                      {expandedCategories[category.category] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    {expandedCategories[category.category] && (
                      <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                          {category.items?.map((item: TestItem) => {
                            if (!item) return null;
                            return renderItemRow(item, category, "tasks");
                          })}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="ege" className="w-full max-w-full mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Формат ЕГЭ</h2>
                <p className="text-sm text-gray-600 mb-6">Выберите параметры для генерации теста в формате ЕГЭ:</p>
                {egeFormatDataState?.map((section: EGESection) => {
                  if (!section) return null;
                  return (
                  <div key={section.title} className="mb-5 sm:mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">{section.title}</h3>
                      {section.categories?.map((category: EGECategory) => {
                        if (!category) return null;
                        return (
                      <div key={`${section.title}-${category.title}`} className="mb-6">
                        <div
                          className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg cursor-pointer"
                          onClick={() => toggleCategory(`${section.title}-${category.title}`)}
                        >
                          <h4 className="font-medium text-gray-800">{category.title}</h4>
                          {expandedCategories[`${section.title}-${category.title}`] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        {expandedCategories[`${section.title}-${category.title}`] && (
                          <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                                {category.items?.map((item: TestItem) => {
                                  if (!item) return null;
                                  return renderItemRow(item, category, "ege");
                                })}
                                        </div>
                                      )}
                          </div>
                        );
                      })}
                      </div>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="exercises" className="w-full max-w-full mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Упражнения</h2>
                <p className="text-sm text-gray-600 mb-6">Выберите упражнения для включения в тест:</p>
                {exercisesDataState?.map((section: EGESection) => {
                  if (!section) return null;
                  return (
                  <div key={section.title} className="mb-5 sm:mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">{section.title}</h3>
                      {section.categories?.map((category: EGECategory) => {
                        if (!category) return null;
                        return (
                      <div key={`${section.title}-${category.title}`} className="mb-6">
                        <div
                          className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg cursor-pointer"
                          onClick={() => toggleCategory(`${section.title}-${category.title}`)}
                        >
                          <h4 className="font-medium text-gray-800">{category.title}</h4>
                          {expandedCategories[`${section.title}-${category.title}`] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        {expandedCategories[`${section.title}-${category.title}`] && (
                          <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                                {category.items?.map((item: TestItem) => {
                                  if (!item) return null;
                                  return renderItemRow(item, category, "exercises");
                                })}
                                        </div>
                                      )}
                          </div>
                        );
                      })}
                      </div>
                  );
                })}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      {/* Fixed bottom panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-3 px-4 z-50">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-medium text-gray-700">Выбрано заданий:</span>
              <span className="text-lg font-bold text-teal-600">
                {totalSelected} / {totalLimit}
              </span>
            </div>

            <div className="w-full sm:w-1/3 flex-grow">
              <Progress value={progress} className="h-2" />
            </div>

            <Button
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 font-medium"
              variant="default"
              disabled={!testName}
              style={{ opacity: 1 }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
