"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GroupCard } from "@/src/components/ui/group-card"

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
    name: "Новая группа 2025",
    description: "Группа создана, но еще не запущена",
    studentsCount: 0,
    testsCount: 0,
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 час назад
    status: "draft" as const,
    progress: 0,
    teacher: {
      name: "Елена Сидорова"
    }
  },
  {
    id: "4",
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

export default function GroupCardsDemoPage() {
  const [selectedCards, setSelectedCards] = React.useState<string[]>([])
  const router = useRouter()

  const handleCardSelect = (id: string) => {
    setSelectedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    )
  }

  const handleEdit = (id: string) => {
    console.log('Edit group:', id)
  }

  const handleArchive = (id: string) => {
    console.log('Archive group:', id)
  }

  const handleDuplicate = (id: string) => {
    console.log('Duplicate group:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Delete group:', id)
  }

  const handleOpen = (id: string) => {
    router.push(`/groups/${id}`)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Демо карточек групп</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoGroups.map((group) => (
          <GroupCard
            key={group.id}
            id={group.id}
            name={group.name}
            description={group.description}
            studentsCount={group.studentsCount}
            testsCount={group.testsCount}
            lastActivity={group.lastActivity}
            status={group.status}
            progress={group.progress}
            teacher={group.teacher}
            showTeacher={false} // Не показываем преподавателя (так как это сам пользователь)
            isSelected={selectedCards.includes(group.id)}
            onSelect={() => handleCardSelect(group.id)}
            onEdit={() => handleEdit(group.id)}
            onArchive={() => handleArchive(group.id)}
            onDuplicate={() => handleDuplicate(group.id)}
            onDelete={() => handleDelete(group.id)}
            onOpen={() => handleOpen(group.id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Компактный вариант</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoGroups.map((group) => (
            <GroupCard
              key={`compact-${group.id}`}
              id={group.id}
              name={group.name}
              description={group.description}
              studentsCount={group.studentsCount}
              testsCount={group.testsCount}
              lastActivity={group.lastActivity}
              status={group.status}
              progress={group.progress}
              teacher={group.teacher}
              variant="compact"
              showTeacher={false} // Не показываем преподавателя
              isSelected={selectedCards.includes(`compact-${group.id}`)}
              onSelect={() => handleCardSelect(`compact-${group.id}`)}
              onEdit={() => handleEdit(group.id)}
              onArchive={() => handleArchive(group.id)}
              onDuplicate={() => handleDuplicate(group.id)}
              onDelete={() => handleDelete(group.id)}
              onOpen={() => handleOpen(group.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">С информацией о преподавателе (для сравнения)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoGroups.slice(0, 2).map((group) => (
            <GroupCard
              key={`teacher-${group.id}`}
              id={group.id}
              name={group.name}
              description={group.description}
              studentsCount={group.studentsCount}
              testsCount={group.testsCount}
              lastActivity={group.lastActivity}
              status={group.status}
              progress={group.progress}
              teacher={group.teacher}
              showTeacher={true} // Показываем преподавателя для сравнения
              isSelected={selectedCards.includes(`teacher-${group.id}`)}
              onSelect={() => handleCardSelect(`teacher-${group.id}`)}
              onEdit={() => handleEdit(group.id)}
              onArchive={() => handleArchive(group.id)}
              onDuplicate={() => handleDuplicate(group.id)}
              onDelete={() => handleDelete(group.id)}
              onOpen={() => handleOpen(group.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}