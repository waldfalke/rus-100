"use client"

import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2, ArrowLeft, User, FolderPlus, Dice3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { tasksData, egeFormatData, exercisesData, TestItem, TestCategory, EGESection, EGECategory } from "@/data/test-content"
import { SelectableExamText } from "@/components/ui/selectable-exam-text"
import { Badge } from "@/components/ui/badge"
import { difficultyStatsData, TaskDifficultyStats, DifficultyDataMap } from "@/data/difficulty-data"
import { TaskCategorySelector } from "@/components/ui/task-category-selector"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TaskCardBlock } from "@/components/ui/TaskCardBlock"
import { SelectionDropdown, SelectionOption } from "@/components/ui/SelectionDropdown"
import { ProgressPanelBlock } from "@/components/ui/ProgressPanelBlock"
import { TopNavBlock } from "@/components/ui/TopNavBlock"
import { H1, P, H2, H3 } from "@/components/ui/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

// Обновляем интерфейс для хранения выбранных сложностей
interface ItemDifficulties {
  [key: string | number]: string[];  // Changed from string to string[]
}

// Добавляем интерфейс для хранения выбранных категорий
interface ItemCategories {
  [key: string | number]: string[];
}

// Добавляем маппинг заданий к их категориям
const taskCategories: Record<string, string[]> = {
  "1": ["предлоги", "союзы", "частицы", "местоимения", "наречия", "вводные слова"],
  "6": ["исключить", "заменить"],
  "21": ["запятая", "тире", "двоеточие"],
  "25": ["синонимы", "антонимы", "фразеологизмы", "слово"],
};

// Define NavLink type mirroring the one in TopNavBlock
interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

export default function TestGenerator() {
  // --- Инициализируем состояния пустыми массивами --- 
  const [testName, setTestName] = useState("")
  const [testGroup, setTestGroup] = useState<string | undefined>(undefined)
  const [account, setAccount] = useState<string | undefined>(undefined)
  const [tasksDataState, setTasksDataState] = useState<TestCategory[] | null>(null);
  const [egeFormatDataState, setEgeFormatDataState] = useState<EGESection[] | null>(null);
  const [exercisesDataState, setExercisesDataState] = useState<EGESection[] | null>(null);
  const [itemDifficulties, setItemDifficulties] = useState<ItemDifficulties>({});
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

  // Добавляем состояние для хранения выбранных категорий
  const [itemCategories, setItemCategories] = useState<ItemCategories>({});

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
  const handleItemDifficultyChange = (itemId: string | number, difficulty: string[]) => {
    setItemDifficulties(prev => ({
          ...prev,
      [itemId]: difficulty
    }));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Добавляем функцию для обработки изменения категорий
  const handleCategoriesChange = (itemId: string | number, categories: string[]) => {
    setItemCategories({ ...itemCategories, [itemId]: categories });
  };

  // Функция рендеринга карточки задания
  const renderItemRow = (item: TestItem, category: TestCategory | EGECategory, tabType: "tasks" | "ege" | "exercises") => {
    const currentCount = item.count || 0;
    const maxCount = item.maxCount || 10;
    const categoryIdentifier = 'category' in category ? category.category : category.title;
    const statsId = `${tabType}-${item.id}`;
    const itemStats = difficultyStatsData[statsId] || null;
    
    // Определение типа карточки по контракту B-стиля
    const taskNumber = item.title.match(/№\s*(\d+)/)?.[1];
    const hasCategories = taskNumber && taskNumber in taskCategories;
    const availableCategories = hasCategories 
      ? taskCategories[taskNumber]
      : [];
    
    // Создаем дропдауны для категорий и сложности (B-стиль)
    const difficultyDropdown = itemStats ? createDifficultyDropdown(item, itemStats) : null;
    const categoryDropdown = hasCategories ? createCategoryDropdown(item, availableCategories) : null;
    
    // Обновленный рендер TaskCardBlock
    return (
      <TaskCardBlock
        key={item.id}
        item={{
          id: String(item.id),
          title: item.title,
          description: "",
        }}
        currentCount={currentCount}
        maxCount={maxCount}
        onDecrement={() => handleCountChange(item.id, categoryIdentifier, -1, tabType)}
        onIncrement={() => handleCountChange(item.id, categoryIdentifier, 1, tabType)}
        difficulties={itemDifficulties[item.id] || ["any"]}
        onDifficultyChange={(id: string) => handleItemDifficultyChange(item.id, [id])}
        categories={itemCategories[item.id] || availableCategories}
        onCategoriesChange={(id: string, categories: string[]) => handleCategoriesChange(id, categories)}
        itemStats={itemStats ? Object.entries(itemStats).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'number' ? value : 0;
          return acc;
        }, {} as Record<string, number>) : {}}
        difficultyTiers={difficultyTiers}
        difficultyDropdown={difficultyDropdown}
        categoryDropdown={categoryDropdown}
        noWrapper={true}
      />
    );
  };
  
  // Вспомогательные функции для renderItemRow
  const createDifficultyDropdown = (item: TestItem, itemStats: TaskDifficultyStats | Record<string, number>) => {
    const itemId = item.id;
    const selected = itemDifficulties[itemId] || ["any"];
    
    // Преобразуем статистику сложности в объект с числовыми значениями
    const statsRecord: Record<string, number> = {};
    
    // Безопасно преобразуем статистику в объект с числовыми значениями
    if (itemStats) {
      Object.entries(itemStats).forEach(([key, value]) => {
        statsRecord[key] = typeof value === 'number' ? value : 0;
      });
    }
    
    // Определяем общее количество заданий
    const totalCount = Object.values(statsRecord).reduce((sum, count) => sum + count, 0);
    
    // Создаем опции для дропдауна сложности
    const options = difficultyTiers.map(tier => ({
      id: tier.id,
      label: tier.label,
      count: statsRecord[tier.id] || 0
    }));
    
    return (
      <SelectionDropdown
        options={options}
        selected={selected}
        onChange={(newValues) => handleItemDifficultyChange(itemId, newValues)}
        label="Сложность"
        allLabel="любая сложность"
        totalCount={totalCount}
        className="w-full sm:w-auto"
      />
    );
  };
  
  const createCategoryDropdown = (item: TestItem, availableCategories: string[]) => {
    const itemId = item.id;
    const selectedCategories = itemCategories[itemId] || [];
    
    // Создаем опции для дропдауна категорий
    const options = availableCategories.map(cat => ({
      id: cat,
      label: cat
    }));
    
    return (
      <SelectionDropdown
        options={options}
        selected={selectedCategories.length ? selectedCategories : ["any"]}
        onChange={(newValue) => handleCategoriesChange(itemId, newValue)}
        label="Категории"
        allLabel="все категории"
        className="w-full sm:w-auto"
      />
    );
  };

  // Добавляем обработку состояний загрузки
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Progress value={30} className="w-[60%] mx-auto" />
          <p className="mt-4 text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="font-source-serif-pro text-xl font-bold text-destructive">Ошибка загрузки</h2>
          <p className="mt-2 text-muted-foreground">Не удалось загрузить данные. Пожалуйста, обновите страницу.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Обновить страницу
          </Button>
        </div>
      </div>
    );
  }

  // Define static navLinks for TopNavBlock in this context
  const staticNavLinks: NavLink[] = [
    { label: "Дашборд", href: "/dashboard" },
    { label: "Задания", href: "/tasks" },
    { label: "Результаты", href: "/results" },
    { label: "Тесты", href: "/tests" },
    { label: "Демо", href: "/demo" },
  ];

  return (
    <div className="font-sans min-h-screen bg-background flex flex-col">
      <TopNavBlock 
        userName="Евгений" 
        userEmail="stribojich@gmail.com" 
        navLinks={staticNavLinks}
        onUserClick={() => {}} 
      />

      <main className="flex-grow pb-20">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <nav className="breadcrumbs text-sm text-muted-foreground hidden sm:block">
              <a href="#" className="hover:text-foreground hover:underline">Главная</a> &gt; <span>Генерация теста</span>
            </nav>
            <a href="#" className="text-primary hover:underline sm:hidden flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Назад
            </a>
            <a href="#" className="text-primary hover:underline text-sm sm:text-base">Мои тесты</a>
          </div>
          {/* 1. Main Page Title "Генерация теста" - Added mb-2 */}
          <H1 className="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground mb-2">Генерация теста</H1>
          {/* 2. Page Subtitle/Description "Выберите задания для включения в тест (не более 50), укажите название, аккаунт и группу, затем нажмите {"Создать тест"}. - Removed mt-2 */}
          <P className="font-inter text-app-body leading-cyr-text font-normal text-muted-foreground mb-6">
            Выберите задания для включения в тест (не более 50), укажите название, аккаунт и группу, затем нажмите {"Создать тест"}.
          </P>

          <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border mb-4 sm:mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="test-name" className="block font-inter text-app-small leading-5 font-normal text-foreground mb-1">Название теста <span className="text-destructive">*</span></label>
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
                  <label htmlFor="test-group" className="block font-inter text-app-small leading-5 font-normal text-foreground mb-1">Группа тестов</label>
                  <div className="flex items-center gap-2">
                    <Select value={testGroup} onValueChange={setTestGroup}>
                      <SelectTrigger className="w-full font-inter text-app-small leading-5 font-normal">
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
                      <FolderPlus className="h-5 w-5 text-primary" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="account-select" className="block font-inter text-app-small leading-5 font-normal text-foreground mb-1">Аккаунт</label>
                  <Select value={account} onValueChange={setAccount}>
                    <SelectTrigger className="w-full font-inter text-app-small leading-5 font-normal">
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
          </div>

          <div className="mb-4">
            <SelectableExamText />
          </div>

          {/* Sticky navigation tabs - separate from content */}
          <div className="sticky top-0 z-30 bg-muted rounded-t-xl border-b border-border mb-4">
            <Tabs 
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full max-w-full"
            >
              <TabsList className="grid w-full grid-cols-3 gap-1.5 p-1.5 items-center">
                  <TabsTrigger
                    value="tasks"
                    className="font-inter text-app-small leading-5 font-normal py-1.5 px-4 rounded-md transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary/90 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
                  >
                    По заданиям
                  </TabsTrigger>
                  <TabsTrigger
                    value="ege"
                    className="font-inter text-app-small leading-5 font-normal py-1.5 px-4 rounded-md transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary/90 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
                  >
                    Формат ЕГЭ
                  </TabsTrigger>
                  <TabsTrigger
                    value="exercises"
                    className="font-inter text-app-small leading-5 font-normal py-1.5 px-4 rounded-md transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary/90 data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
                  >
                    Упражнения
                  </TabsTrigger>
                </TabsList>
            </Tabs>
          </div>

          {/* Content area - separate from navigation */}
          <Tabs 
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full max-w-full flex flex-col"
          >
            <TabsContent value="tasks" className="w-full max-w-full mt-0">
                <Card data-ui="card">
                  <CardContent className="p-4 sm:p-6">
                   <H2 className="font-source-serif-pro text-app-h2-mobile md:text-app-h2 font-semibold leading-tight text-foreground mb-2">Генерация по заданиям</H2>
                   <P className="font-inter text-app-small leading-5 font-normal text-muted-foreground mb-6">
                     Выберите количество вопросов и уровень сложности для каждого задания:
                   </P>
                   <Accordion type="multiple" className="w-full">
                     {tasksDataState?.map((category: TestCategory) => {
                       if (!category) return null;
                       const categoryId = category.category;
                       return (
                         <AccordionItem value={categoryId} key={categoryId} className="border border-border rounded-lg mb-2 bg-background">
                           <AccordionTrigger className="font-inter text-app-body font-bold leading-cyr-text no-underline hover:no-underline p-2 sm:p-3 rounded-t-lg data-[state=open]:border-b border-border flex w-full items-center justify-between">
                             {category.category}
                           </AccordionTrigger>
                           <AccordionContent className="p-4">
                               {category.items?.map((item: TestItem, index: number) => {
                                 if (!item) return null;
                                 return (
                                   <React.Fragment key={item.id}>
                                     {renderItemRow(item, category, "tasks")}
                                     {index < category.items.length - 1 && <Separator className="my-2" />}
                                   </React.Fragment>
                                 );
                               })}
                           </AccordionContent>
                         </AccordionItem>
                       );
                     })}
                  </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ege" className="w-full max-w-full mt-0">
                <Card data-ui="card">
                  <CardContent className="p-4 sm:p-6">
                   <H2 className="font-source-serif-pro text-app-h2-mobile md:text-app-h2 font-semibold leading-tight text-foreground mb-2">Формат ЕГЭ</H2>
                   <P className="font-inter text-app-small leading-5 font-normal text-muted-foreground mb-6">Выберите параметры для генерации теста в формате ЕГЭ:</P>
                   {egeFormatDataState?.map((section: EGESection) => {
                     if (!section) return null;
                     return (
                     <div key={section.title} className="mb-5 sm:mb-8">
                       <H3 className="font-source-serif-pro text-app-h3-mobile md:text-app-h3 font-medium leading-snug text-foreground mb-4">{section.title}</H3>
                         <Accordion type="multiple" className="w-full">
                           {section.categories?.map((category: EGECategory) => {
                             if (!category) return null;
                             const categoryId = `${section.title}-${category.title}`;
                             return (
                               <AccordionItem value={categoryId} key={categoryId} className="border border-border rounded-lg mb-2 bg-background">
                                 <AccordionTrigger className="font-inter text-app-body font-bold leading-cyr-text no-underline hover:no-underline p-2 sm:p-3 rounded-t-lg data-[state=open]:border-b border-border flex w-full items-center justify-between">
                                    {category.title}
                                 </AccordionTrigger>
                                 <AccordionContent className="p-4">
                                       {category.items?.map((item: TestItem, index: number) => {
                                         if (!item) return null;
                                         return (
                                           <React.Fragment key={item.id}>
                                             {renderItemRow(item, category, "ege")}
                                             {index < category.items.length - 1 && <Separator className="my-2" />}
                                           </React.Fragment>
                                         );
                                       })}
                                 </AccordionContent>
                               </AccordionItem>
                             );
                           })}
                         </Accordion>
                    </div>
                  );
                })}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="exercises" className="w-full max-w-full mt-0">
                <Card data-ui="card">
                  <CardContent className="p-4 sm:p-6">
                   <H2 className="font-source-serif-pro text-app-h2-mobile md:text-app-h2 font-semibold leading-tight text-foreground mb-2">Упражнения</H2>
                   <P className="font-inter text-app-small leading-5 font-normal text-muted-foreground mb-6">
                     Выберите упражнения для включения в тест:
                   </P>
                   {exercisesDataState?.map((section: EGESection) => {
                     if (!section) return null;
                     return (
                     <div key={section.title} className="mb-5 sm:mb-8">
                       <H3 className="font-source-serif-pro text-app-h3-mobile md:text-app-h3 font-medium leading-snug text-foreground mb-4">{section.title}</H3>
                         <Accordion type="multiple" className="w-full">
                           {section.categories?.map((category: EGECategory) => {
                             if (!category) return null;
                             const categoryId = `${section.title}-${category.title}`;
                             return (
                               <AccordionItem value={categoryId} key={categoryId} className="border border-border rounded-lg mb-2 bg-background">
                                 <AccordionTrigger className="font-inter text-app-body font-bold leading-cyr-text no-underline hover:no-underline p-2 sm:p-3 rounded-t-lg data-[state=open]:border-b border-border flex w-full items-center justify-between">
                                    {category.title}
                                 </AccordionTrigger>
                                 <AccordionContent className="p-4">
                                       {category.items?.map((item: TestItem, index: number) => {
                                         if (!item) return null;
                                         return (
                                           <React.Fragment key={item.id}>
                                             {renderItemRow(item, category, "exercises")}
                                             {index < category.items.length - 1 && <Separator className="my-2" />}
                                           </React.Fragment>
                                         );
                                       })}
                                 </AccordionContent>
                               </AccordionItem>
                             );
                           })}
                          </Accordion>
                     </div>
                   );
                 })}
                  </CardContent>
                </Card>
              </TabsContent>
          </Tabs>
        </div>
      </main>

      <ProgressPanelBlock 
        totalSelected={totalSelected} 
        totalLimit={totalLimit} 
        progress={progress} 
        buttonText={buttonText} 
        onCreate={() => {
          console.log("Creating test...");
          // Add test creation logic here
        }}
      />
    </div>
  );
}