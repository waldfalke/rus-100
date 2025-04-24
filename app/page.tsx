"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Edit2, ArrowLeft, User, FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { tasksData, egeFormatData, exercisesData } from "@/data/test-content"
import SelectableExamText from "@/components/feature/selectable-exam-text"

// Define difficulty types
type DifficultyType = "none" | "easy" | "hard" | "both"
type DifficultyValue = "easy" | "hard" | "both" | null

export default function TestGenerator() {
  // Add state for managing the data
  // Add these state variables at the top of the component:

  const [tasksDataState, setTasksDataState] = useState(tasksData)
  const [egeFormatDataState, setEgeFormatDataState] = useState(egeFormatData)
  const [exercisesDataState, setExercisesDataState] = useState(exercisesData)

  const [selectedTab, setSelectedTab] = useState("tasks")
  const [testName, setTestName] = useState("")
  const [testGroup, setTestGroup] = useState("")
  const [account, setAccount] = useState("")
  const [newGroup, setNewGroup] = useState("")
  const [expandedCategories, setExpandedCategories] = useState({})
  const [buttonText, setButtonText] = useState("Создать тест")

  // Initialize expanded categories state for each tab
  useEffect(() => {
    const initialExpandedState = {}

    // Initialize for tasks tab
    tasksData.forEach((category) => {
      initialExpandedState[category.category] = true
    })

    // Initialize for ege format tab
    egeFormatData.forEach((section) => {
      initialExpandedState[section.title] = true
      section.categories.forEach((category) => {
        initialExpandedState[`${section.title}-${category.title}`] = true
      })
    })

    // Initialize for exercises tab
    exercisesData.forEach((section) => {
      initialExpandedState[section.title] = true
      section.categories.forEach((category) => {
        initialExpandedState[`${section.title}-${category.title}`] = true
      })
    })

    setExpandedCategories(initialExpandedState)
  }, [])

  const totalLimit = 50
  const [totalSelected, setTotalSelected] = useState(0)
  const progress = (totalSelected / totalLimit) * 100

  // Track selections in each tab
  const [tasksSelected, setTasksSelected] = useState(false)
  const [egeSelected, setEgeSelected] = useState(false)
  const [exercisesSelected, setExercisesSelected] = useState(false)

  // Update button text based on selections
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

  const handleCountChange = (id, category, increment, tabType) => {
    // Create a deep copy of the data based on the tab type
    let updatedData
    if (tabType === "tasks") {
      updatedData = JSON.parse(JSON.stringify(tasksDataState))
      // Find the item and update its count
      for (const categoryData of updatedData) {
        const item = categoryData.items.find((item) => item.id === id)
        if (item) {
          const oldCount = item.count || 0
          const newCount = Math.max(0, Math.min(item.maxCount || 10, oldCount + increment))
          item.count = newCount

          // Update total selected count
          setTotalSelected((prev) => Math.max(0, Math.min(totalLimit, prev + (newCount - oldCount))))

          // Update tab selection state if there are any items selected
          const hasSelectedItems = updatedData.some((cat) => cat.items.some((item) => item.count && item.count > 0))
          setTasksSelected(hasSelectedItems)
          setTasksDataState(updatedData)
          break
        }
      }
    } else if (tabType === "ege") {
      updatedData = JSON.parse(JSON.stringify(egeFormatDataState))
      // Find the item and update its count
      let found = false
      for (const section of updatedData) {
        for (const categoryData of section.categories) {
          const item = categoryData.items.find((item) => item.id === id)
          if (item) {
            const oldCount = item.count || 0
            const newCount = Math.max(0, Math.min(item.maxCount || 10, oldCount + increment))
            item.count = newCount

            // Update total selected count
            setTotalSelected((prev) => Math.max(0, Math.min(totalLimit, prev + (newCount - oldCount))))

            // Update tab selection state if there are any items selected
            const hasSelectedItems = updatedData.some((section) =>
              section.categories.some((cat) => cat.items.some((item) => item.count && item.count > 0)),
            )
            setEgeSelected(hasSelectedItems)
            setEgeFormatDataState(updatedData)
            found = true
            break
          }
        }
        if (found) break
      }
    } else if (tabType === "exercises") {
      updatedData = JSON.parse(JSON.stringify(exercisesDataState))
      // Find the item and update its count
      let found = false
      for (const section of updatedData) {
        for (const categoryData of section.categories) {
          const item = categoryData.items.find((item) => item.id === id)
          if (item) {
            const oldCount = item.count || 0
            const newCount = Math.max(0, Math.min(item.maxCount || 10, oldCount + increment))
            item.count = newCount

            // Update total selected count
            setTotalSelected((prev) => Math.max(0, Math.min(totalLimit, prev + (newCount - oldCount))))

            // Update tab selection state if there are any items selected
            const hasSelectedItems = updatedData.some((section) =>
              section.categories.some((cat) => cat.items.some((item) => item.count && item.count > 0)),
            )
            setExercisesSelected(hasSelectedItems)
            setExercisesDataState(updatedData)
            found = true
            break
          }
        }
        if (found) break
      }
    }
  }

  const handleDifficultyChange = (id, category, value) => {
    // Implementation would toggle the difficulty for the specific question
  }

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
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
        </div>

        {/* Selectable Exam Text Component */}
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
            {/* По заданиям Tab */}
            <TabsContent value="tasks" className="w-full max-w-full mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Генерация по заданиям</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Выберите количество вопросов и уровень сложности для каждого задания:
                </p>

                {tasksDataState.map((category) => (
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
                        {category.items.map((item) => (
                          <Card key={item.id} className="border border-gray-200">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                                <div className="flex-grow">
                                  <p className="text-gray-800">{item.title}</p>
                                </div>

                                <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                                  {/* Difficulty controls */}
                                  {item.difficultyType !== "none" && (
                                    <div className="flex items-center gap-2">
                                      {/* Show only one button if only one difficulty type is available */}
                                      {item.difficultyType === "easy" ? (
                                        <button className="difficulty-chip active opacity-70" disabled={true}>
                                          простые
                                        </button>
                                      ) : item.difficultyType === "hard" ? (
                                        <button className="difficulty-chip active opacity-70" disabled={true}>
                                          сложные
                                        </button>
                                      ) : (
                                        <>
                                          <button
                                            className={`difficulty-chip ${
                                              item.difficulty === "easy" || item.difficulty === "both" ? "active" : ""
                                            } ${item.difficultyType === "hard" ? "opacity-70" : ""}`}
                                            onClick={() => {
                                              if (item.difficulty === "both") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "hard",
                                                )
                                              } else if (item.difficulty === "easy") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              } else {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              }
                                            }}
                                            disabled={item.difficultyType === "hard"}
                                          >
                                            простые
                                          </button>

                                          <button
                                            className={`difficulty-chip ${
                                              item.difficulty === "hard" || item.difficulty === "both" ? "active" : ""
                                            } ${item.difficultyType === "easy" ? "opacity-70" : ""}`}
                                            onClick={() => {
                                              if (item.difficulty === "both") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "easy",
                                                )
                                              } else if (item.difficulty === "hard") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              } else {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              }
                                            }}
                                            disabled={item.difficultyType === "easy"}
                                          >
                                            сложные
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}

                                  <Separator orientation="vertical" className="h-8 hidden sm:block" />

                                  {/* Count controls */}
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 font-bold text-gray-700 border-gray-400 hover:bg-gray-100 hover:text-teal-600 hover:border-teal-600"
                                      onClick={() => {
                                        const newCount = Math.max(0, (item.count || 0) - 1)
                                        handleCountChange(item.id, category.category || category.title, -1, selectedTab)
                                      }}
                                      disabled={!item.count || item.count <= 0}
                                    >
                                      <span className="sr-only">Уменьшить количество</span>−
                                    </Button>

                                    <Input
                                      type="number"
                                      min="0"
                                      max={item.maxCount || 10}
                                      value={item.count || 0}
                                      onChange={(e) => {
                                        const newValue = Number.parseInt(e.target.value) || 0
                                        const oldValue = item.count || 0
                                        const diff = newValue - oldValue

                                        // Only update if the new value is valid
                                        if (
                                          newValue >= 0 &&
                                          newValue <= (item.maxCount || 10) &&
                                          totalSelected + diff <= totalLimit
                                        ) {
                                          handleCountChange(
                                            item.id,
                                            category.category || category.title,
                                            diff,
                                            selectedTab,
                                          )
                                        }
                                      }}
                                      className="w-12 h-8 text-center p-0 border-gray-300"
                                    />

                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 font-bold text-gray-700 border-gray-400 hover:bg-gray-100 hover:text-teal-600 hover:border-teal-600"
                                      onClick={() => {
                                        handleCountChange(item.id, category.category || category.title, 1, selectedTab)
                                      }}
                                      disabled={(item.count || 0) >= (item.maxCount || 10) || totalSelected >= totalLimit}
                                    >
                                      <span className="sr-only">Увеличить количество</span>+
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Формат ЕГЭ Tab */}
            <TabsContent value="ege" className="w-full max-w-full mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Формат ЕГЭ</h2>
                <p className="text-sm text-gray-600 mb-6">Выберите параметры для генерации теста в формате ЕГЭ:</p>

                {egeFormatDataState.map((section) => (
                  <div key={section.title} className="mb-5 sm:mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">{section.title}</h3>

                    {section.categories.map((category) => (
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
                            {category.items.map((item) => (
                              <Card key={item.id} className="border border-gray-200">
                                <CardContent className="p-3 sm:p-4">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                                    <div className="flex-grow">
                                      <p className="text-gray-800">{item.title}</p>
                                    </div>

                                    <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                                      {/* Difficulty controls */}
                                      {item.difficultyType !== "none" && (
                                        <div className="flex items-center gap-2">
                                          <button
                                            className={`difficulty-chip ${
                                              item.difficulty === "easy" || item.difficulty === "both" ? "active" : ""
                                            } ${item.difficultyType === "hard" ? "opacity-70" : ""}`}
                                            onClick={() => {
                                              if (item.difficulty === "both") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "hard",
                                                )
                                              } else if (item.difficulty === "easy") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              } else {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              }
                                            }}
                                            disabled={item.difficultyType === "hard"}
                                          >
                                            простые
                                          </button>

                                          <button
                                            className={`difficulty-chip ${
                                              item.difficulty === "hard" || item.difficulty === "both" ? "active" : ""
                                            } ${item.difficultyType === "easy" ? "opacity-70" : ""}`}
                                            onClick={() => {
                                              if (item.difficulty === "both") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "easy",
                                                )
                                              } else if (item.difficulty === "hard") {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              } else {
                                                handleDifficultyChange(
                                                  item.id,
                                                  category.category || category.title,
                                                  "both",
                                                )
                                              }
                                            }}
                                            disabled={item.difficultyType === "easy"}
                                          >
                                            сложные
                                          </button>
                                        </div>
                                      )}

                                      <Separator orientation="vertical" className="h-8 hidden sm:block" />

                                      {/* Count controls */}
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 font-bold text-gray-700 border-gray-400 hover:bg-gray-100 hover:text-teal-600 hover:border-teal-600"
                                          onClick={() => {
                                            const newCount = Math.max(0, (item.count || 0) - 1)
                                            handleCountChange(
                                              item.id,
                                              category.category || category.title,
                                              -1,
                                              selectedTab,
                                            )
                                          }}
                                          disabled={!item.count || item.count <= 0}
                                        >
                                          <span className="sr-only">Уменьшить количество</span>−
                                        </Button>

                                        <Input
                                          type="number"
                                          min="0"
                                          max={item.maxCount || 10}
                                          value={item.count || 0}
                                          onChange={(e) => {
                                            const newValue = Number.parseInt(e.target.value) || 0
                                            const oldValue = item.count || 0
                                            const diff = newValue - oldValue

                                            // Only update if the new value is valid
                                            if (
                                              newValue >= 0 &&
                                              newValue <= (item.maxCount || 10) &&
                                              totalSelected + diff <= totalLimit
                                            ) {
                                              handleCountChange(
                                                item.id,
                                                category.category || category.title,
                                                diff,
                                                selectedTab,
                                              )
                                            }
                                          }}
                                          className="w-12 h-8 text-center p-0 border-gray-300"
                                        />

                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 font-bold text-gray-700 border-gray-400 hover:bg-gray-100 hover:text-teal-600 hover:border-teal-600"
                                          onClick={() => {
                                            handleCountChange(
                                              item.id,
                                              category.category || category.title,
                                              1,
                                              selectedTab,
                                            )
                                          }}
                                          disabled={
                                            (item.count || 0) >= (item.maxCount || 10) || totalSelected >= totalLimit
                                          }
                                        >
                                          <span className="sr-only">Увеличить количество</span>+
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Упражнения Tab */}
            <TabsContent value="exercises" className="w-full max-w-full mt-0">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Упражнения</h2>
                <p className="text-sm text-gray-600 mb-6">Выберите упражнения для включения в тест:</p>

                {exercisesDataState.map((section) => (
                  <div key={section.title} className="mb-5 sm:mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">{section.title}</h3>

                    {section.categories.map((category) => (
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
                            {category.items.map((item) => (
                              <Card key={item.id} className="border border-gray-200">
                                <CardContent className="p-3 sm:p-4">
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                                    <div className="flex-grow">
                                      <p className="text-gray-800">{item.title}</p>
                                    </div>

                                    <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                                      {/* Difficulty controls */}
                                      {item.difficultyType !== "none" && (
                                        <div className="flex items-center gap-2">
                                          {/* Show only one button if only one difficulty type is available */}
                                          {item.difficultyType === "easy" ? (
                                            <button className="difficulty-chip active opacity-70" disabled={true}>
                                              простые
                                            </button>
                                          ) : item.difficultyType === "hard" ? (
                                            <button className="difficulty-chip active opacity-70" disabled={true}>
                                              сложные
                                            </button>
                                          ) : (
                                            <>
                                              <button
                                                className={`difficulty-chip ${
                                                  item.difficulty === "easy" || item.difficulty === "both" ? "active" : ""
                                                } ${item.difficultyType === "hard" ? "opacity-70" : ""}`}
                                                onClick={() => {
                                                  if (item.difficulty === "both") {
                                                    handleDifficultyChange(
                                                      item.id,
                                                      category.category || category.title,
                                                      "hard",
                                                    )
                                                  } else if (item.difficulty === "easy") {
                                                    handleDifficultyChange(
                                                      item.id,
                                                      category.category || category.title,
                                                      "both",
                                                    )
                                                  } else {
                                                    handleDifficultyChange(
                                                      item.id,
                                                      category.category || category.title,
                                                      "both",
                                                    )
                                                  }
                                                }}
                                                disabled={item.difficultyType === "hard"}
                                              >
                                                простые
                                              </button>

                                              <button
                                                className={`difficulty-chip ${
                                                  item.difficulty === "hard" || item.difficulty === "both" ? "active" : ""
                                                } ${item.difficultyType === "easy" ? "opacity-70" : ""}`}
                                                onClick={() => {
                                                  if (item.difficulty === "both") {
                                                    handleDifficultyChange(
                                                      item.id,
                                                      category.category || category.title,
                                                      "easy",
                                                    )
                                                  } else if (item.difficulty === "hard") {
                                                    handleDifficultyChange(
                                                      item.id,
                                                      category.category || category.title,
                                                      "both",
                                                    )
                                                  } else {
                                                    handleDifficultyChange(
                                                      item.id,
                                                      category.category || category.title,
                                                      "both",
                                                    )
                                                  }
                                                }}
                                                disabled={item.difficultyType === "easy"}
                                              >
                                                сложные
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      )}

                                      <Separator orientation="vertical" className="h-8 hidden sm:block" />

                                      {/* Count controls */}
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 font-bold text-gray-700 border-gray-400 hover:bg-gray-100 hover:text-teal-600 hover:border-teal-600"
                                          onClick={() => {
                                            const newCount = Math.max(0, (item.count || 0) - 1)
                                            handleCountChange(
                                              item.id,
                                              category.category || category.title,
                                              -1,
                                              selectedTab,
                                            )
                                          }}
                                          disabled={!item.count || item.count <= 0}
                                        >
                                          <span className="sr-only">Уменьшить количество</span>−
                                        </Button>

                                        <Input
                                          type="number"
                                          min="0"
                                          max={item.maxCount || 10}
                                          value={item.count || 0}
                                          onChange={(e) => {
                                            const newValue = Number.parseInt(e.target.value) || 0
                                            const oldValue = item.count || 0
                                            const diff = newValue - oldValue

                                            // Only update if the new value is valid
                                            if (
                                              newValue >= 0 &&
                                              newValue <= (item.maxCount || 10) &&
                                              totalSelected + diff <= totalLimit
                                            ) {
                                              handleCountChange(
                                                item.id,
                                                category.category || category.title,
                                                diff,
                                                selectedTab,
                                              )
                                            }
                                          }}
                                          className="w-12 h-8 text-center p-0 border-gray-300"
                                        />

                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8 font-bold text-gray-700 border-gray-400 hover:bg-gray-100 hover:text-teal-600 hover:border-teal-600"
                                          onClick={() => {
                                            handleCountChange(
                                              item.id,
                                              category.category || category.title,
                                              1,
                                              selectedTab,
                                            )
                                          }}
                                          disabled={
                                            (item.count || 0) >= (item.maxCount || 10) || totalSelected >= totalLimit
                                          }
                                        >
                                          <span className="sr-only">Увеличить количество</span>+
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
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
