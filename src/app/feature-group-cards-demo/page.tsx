"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GroupCard } from "@/components/feature/GroupCard"

const demoGroups = [
  {
    id: "1",
    name: "Группа A1",
    description: "Начальный уровень: базовая грамматика и лексика",
    status: "active" as const,
    participantCount: 18,
    createdAt: "2024-05-12",
  },
  {
    id: "2", 
    name: "Орфография",
    description: "Подготовка к экзамену по орфографии",
    status: "active" as const,
    participantCount: 22,
    createdAt: "2024-07-01",
  },
  {
    id: "3",
    name: "Сочинение",
    description: "Практика написания сочинений разных типов",
    status: "archived" as const,
    participantCount: 15,
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    name: "Демо группа",
    description: "Тестовые данные для демонстрации",
    status: "draft" as const,
    participantCount: 0,
    createdAt: "2025-01-10",
  },
]

export default function FeatureGroupCardsDemoPage() {
  const router = useRouter()
  
  const handleEdit = (id: string) => console.log("Edit:", id)
  const handleArchive = (id: string) => console.log("Archive:", id)
  const handleDelete = (id: string) => console.log("Delete:", id)
  const handleOpen = (id: string) => router.push(`/groups/${id}`)
  const handleInvite = (id: string) => console.log("Invite:", id)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Feature/GroupCard — демо</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoGroups.map((group) => (
          <GroupCard
            key={group.id}
            id={group.id}
            name={group.name}
            description={group.description}
            status={group.status}
            participantCount={group.participantCount}
            createdAt={group.createdAt}
            onEdit={() => handleEdit(group.id)}
            onArchive={() => handleArchive(group.id)}
            onDelete={() => handleDelete(group.id)}
            onOpen={() => handleOpen(group.id)}
            onInvite={() => handleInvite(group.id)}
          />
        ))}
      </div>
    </div>
  )
}