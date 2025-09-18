"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { 
  MoreHorizontal, 
  Users, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  Edit,
  Archive,
  Copy,
  Trash2
} from "lucide-react"

export interface GroupCardProps {
  id: string
  name: string
  description?: string
  studentsCount: number
  testsCount: number
  lastActivity?: Date
  status: "active" | "archived" | "draft"
  progress?: number
  teacher?: {
    name: string
    avatar?: string
  }
  className?: string
  variant?: "default" | "compact"
  isSelected?: boolean
  onSelect?: (id: string) => void
  onEdit?: (id: string) => void
  onArchive?: (id: string) => void
  onDuplicate?: (id: string) => void
  onDelete?: (id: string) => void
}

const statusConfig = {
  active: {
    label: "Активная",
    variant: "default" as const,
    className: "bg-green-50 text-green-700 border-green-200"
  },
  archived: {
    label: "Архивная", 
    variant: "secondary" as const,
    className: "bg-gray-50 text-gray-600 border-gray-200"
  },
  draft: {
    label: "Черновик",
    variant: "outline" as const,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200"
  }
}

export function GroupCard({
  id,
  name,
  description,
  studentsCount,
  testsCount,
  lastActivity,
  status,
  progress,
  teacher,
  className,
  variant = "default",
  isSelected,
  onSelect,
  onEdit,
  onArchive,
  onDuplicate,
  onDelete,
  ...props
}: GroupCardProps) {
  const statusInfo = statusConfig[status]
  
  const formatLastActivity = (date?: Date) => {
    if (!date) return "Нет активности"
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Только что"
    if (diffInHours < 24) return `${diffInHours} ч. назад`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} дн. назад`
    return date.toLocaleDateString('ru-RU')
  }

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 hover:shadow-md cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-2",
        status === "archived" && "opacity-75",
        variant === "compact" && "p-3",
        className
      )}
      onClick={() => onSelect?.(id)}
      {...props}
    >
      <CardHeader className={cn(
        "pb-3",
        variant === "compact" && "pb-2 pt-0"
      )}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-base leading-tight truncate">
                {name}
              </h3>
              <Badge 
                variant={statusInfo.variant}
                className={cn("text-xs", statusInfo.className)}
              >
                {statusInfo.label}
              </Badge>
            </div>
            
            {description && variant !== "compact" && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onEdit?.(id)
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onDuplicate?.(id)
              }}>
                <Copy className="mr-2 h-4 w-4" />
                Дублировать
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onArchive?.(id)
              }}>
                <Archive className="mr-2 h-4 w-4" />
                {status === "archived" ? "Восстановить" : "Архивировать"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(id)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className={cn(
        "pt-0",
        variant === "compact" && "py-0"
      )}>
        <div className="space-y-3">
          {/* Статистика */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Учеников:</span>
              <span className="font-medium">{studentsCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Тестов:</span>
              <span className="font-medium">{testsCount}</span>
            </div>
          </div>

          {/* Прогресс (если есть) */}
          {progress !== undefined && variant !== "compact" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Прогресс</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Нижняя секция */}
          <div className="flex items-center justify-between pt-2 border-t">
            {/* Преподаватель */}
            {teacher && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={teacher.avatar} alt={teacher.name} />
                  <AvatarFallback className="text-xs">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground truncate">
                  {teacher.name}
                </span>
              </div>
            )}

            {/* Последняя активность */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatLastActivity(lastActivity)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}