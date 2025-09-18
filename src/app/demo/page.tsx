"use client"

import * as React from "react"
import { GroupCard } from "@/components/ui/group-card"
import { StudentCard } from "@/components/ui/student-card"
import { StatisticsTable, type StatisticsRow } from "@/components/ui/statistics-table"
import AirtableStyleTable from "@/components/AirtableStyleTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Демо данные для GroupCard
const demoGroups = [
  {
    id: "1",
    name: "Русский-Годовой, 2025",
    description: "Основной курс русского языка для подготовки к экзаменам",
    studentsCount: 24,
    testsCount: 12,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
    status: "active" as const,
    progress: 75,
    teacher: {
      name: "Анна Петрова",
      avatar: undefined
    }
  },
  {
    id: "2", 
    name: "Подготовка к ЕГЭ",
    description: "Интенсивный курс подготовки к единому государственному экзамену",
    studentsCount: 18,
    testsCount: 8,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 день назад
    status: "active" as const,
    progress: 45,
    teacher: {
      name: "Михаил Иванов"
    }
  },
  {
    id: "3",
    name: "Архивная группа 2024",
    description: "Завершенный курс прошлого года",
    studentsCount: 30,
    testsCount: 15,
    lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 дней назад
    status: "archived" as const,
    progress: 100,
    teacher: {
      name: "Елена Сидорова"
    }
  }
]

// Демо данные для StudentCard
const demoStudents = [
  {
    id: "1",
    name: "Алексей Смирнов",
    email: "alexey.smirnov@example.com",
    phone: "+7 (999) 123-45-67",
    avatar: undefined,
    joinedAt: new Date(2024, 8, 1), // 1 сентября 2024
    lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
    overallProgress: 85,
    testResults: [
      {
        testId: "1",
        testName: "Орфография и пунктуация",
        score: 18,
        maxScore: 20,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "completed" as const,
        timeSpent: 45
      },
      {
        testId: "2", 
        testName: "Синтаксис",
        score: 15,
        maxScore: 20,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "completed" as const,
        timeSpent: 60
      },
      {
        testId: "3",
        testName: "Лексика",
        score: 0,
        maxScore: 20,
        completedAt: new Date(),
        status: "in_progress" as const
      }
    ]
  },
  {
    id: "2",
    name: "Мария Козлова", 
    email: "maria.kozlova@example.com",
    joinedAt: new Date(2024, 8, 15),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
    overallProgress: 60,
    testResults: [
      {
        testId: "1",
        testName: "Орфография и пунктуация",
        score: 16,
        maxScore: 20,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: "completed" as const,
        timeSpent: 50
      }
    ]
  }
]

// Демо данные для StatisticsTable
const demoStatistics: StatisticsRow[] = [
  {
    id: "1",
    student: {
      name: "Алексей Смирнов",
      email: "alexey.smirnov@example.com",
      avatar: undefined
    },
    testsCompleted: 8,
    totalTests: 10,
    averageScore: 85,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    timeSpent: 420, // 7 часов
    status: "active",
    progress: 80
  },
  {
    id: "2",
    student: {
      name: "Мария Козлова",
      email: "maria.kozlova@example.com"
    },
    testsCompleted: 6,
    totalTests: 10,
    averageScore: 72,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    timeSpent: 315, // 5.25 часов
    status: "active",
    progress: 60
  },
  {
    id: "3",
    student: {
      name: "Дмитрий Петров",
      email: "dmitry.petrov@example.com"
    },
    testsCompleted: 10,
    totalTests: 10,
    averageScore: 95,
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    timeSpent: 480, // 8 часов
    status: "completed",
    progress: 100
  },
  {
    id: "4",
    student: {
      name: "Анна Волкова",
      email: "anna.volkova@example.com"
    },
    testsCompleted: 3,
    totalTests: 10,
    averageScore: 58,
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    timeSpent: 180, // 3 часа
    status: "inactive",
    progress: 30
  }
]

export default function DemoPage() {
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null)

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Заголовок */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Демонстрация компонентов</h1>
        <p className="text-muted-foreground">
          Прототипы ключевых компонентов для редизайна платформы "Русский на 100"
        </p>
      </div>

      {/* GroupCard */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">GroupCard</h2>
          <p className="text-muted-foreground">
            Карточки групп с различными состояниями и функциональностью
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoGroups.map((group) => (
            <GroupCard
              key={group.id}
              {...group}
              isSelected={selectedGroup === group.id}
              onSelect={setSelectedGroup}
              onEdit={(id) => console.log("Edit group:", id)}
              onArchive={(id) => console.log("Archive group:", id)}
              onDuplicate={(id) => console.log("Duplicate group:", id)}
              onDelete={(id) => console.log("Delete group:", id)}
            />
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Компактный вариант</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoGroups.slice(0, 2).map((group) => (
              <GroupCard
                key={`compact-${group.id}`}
                {...group}
                variant="compact"
                onSelect={setSelectedGroup}
              />
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* StudentCard */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">StudentCard</h2>
          <p className="text-muted-foreground">
            Карточки учеников с детальной информацией о прогрессе
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {demoStudents.map((student) => (
            <StudentCard
              key={student.id}
              {...student}
              onEmailClick={(email) => console.log("Email clicked:", email)}
              onPhoneClick={(phone) => console.log("Phone clicked:", phone)}
              onTestClick={(testId) => console.log("Test clicked:", testId)}
            />
          ))}
        </div>
      </section>

      <Separator />

      {/* Airtable Style Table */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Таблица в стиле Airtable</h2>
          <p className="text-muted-foreground">
            Таблица с фиксированными строками имен учеников при горизонтальном скролле
          </p>
        </div>
        
        <AirtableStyleTable />
      </section>

      <Separator />

      {/* StatisticsTable */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">StatisticsTable</h2>
          <p className="text-muted-foreground">
            Таблица статистики с сортировкой и действиями
          </p>
        </div>
        
        <StatisticsTable
          data={demoStatistics}
          onRowClick={(row) => console.log("Row clicked:", row)}
          onExport={() => console.log("Export clicked")}
          onViewDetails={(id) => console.log("View details:", id)}
          onEditStudent={(id) => console.log("Edit student:", id)}
          onDeleteStudent={(id) => console.log("Delete student:", id)}
        />
      </section>

      {/* Информация о компонентах */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Технические детали</h2>
          <p className="text-muted-foreground">
            Информация о реализации компонентов
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 p-4 border rounded-lg">
            <h3 className="font-semibold">GroupCard</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Card</Badge>
                <Badge variant="outline">Badge</Badge>
                <Badge variant="outline">Button</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">DropdownMenu</Badge>
                <Badge variant="outline">Avatar</Badge>
              </div>
              <p className="text-muted-foreground">
                Состояния: Default, Hover, Selected, Archived
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <h3 className="font-semibold">StudentCard</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Card</Badge>
                <Badge variant="outline">Avatar</Badge>
                <Badge variant="outline">Badge</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Collapsible</Badge>
                <Badge variant="outline">Progress</Badge>
              </div>
              <p className="text-muted-foreground">
                Режимы: Compact, Expanded
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4 border rounded-lg">
            <h3 className="font-semibold">StatisticsTable</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Table</Badge>
                <Badge variant="outline">Button</Badge>
                <Badge variant="outline">Badge</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">DropdownMenu</Badge>
                <Badge variant="outline">Progress</Badge>
              </div>
              <p className="text-muted-foreground">
                Функции: Сортировка, экспорт, действия
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}