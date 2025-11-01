"use client"

import * as React from "react"
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import StatisticsModal from "./statistics-modal"

// Code Contracts: PENDING
// @token-status: COMPLETED (Uses tokenized Card, Badge, Progress components)

export interface StatisticsCardData {
  id: string
  questionNumber: string
  title: string
  completedWorkouts: number
  averageScore: number
  changePercent: number
  level: 1 | 2 | 3 // уровень сложности
  details?: {
    recentStats?: {
      title: string
      items: Array<{
        name: string
        correct: number
        total: number
        percentage: number
      }>
    }
    totalStats?: {
      title: string
      items: Array<{
        name: string
        correct: number
        total: number
        percentage: number
      }>
    }
  }
}

interface StatisticsCardProps {
  data: StatisticsCardData
  className?: string
  onCardClick?: (id: string) => void
}

export function StatisticsCard({ 
  data, 
  className,
  onCardClick 
}: StatisticsCardProps) {
  const isPositiveChange = data.changePercent > 0
  const isNegativeChange = data.changePercent < 0

  // Функция для определения цвета фона карточки на основе успехов
  const getCardBackgroundColor = () => {
    // Если нет отработок - стандартный фон (белый в светлой теме, темный в темной)
    if (data.completedWorkouts === 0) {
      return 'bg-white dark:bg-gray-800'
    }
    
    // Определяем цвет на основе среднего балла с поддержкой темной темы
    if (data.averageScore >= 85) {
      return 'bg-green-50 dark:bg-green-900/20' // нежно-зеленый для отличных результатов
    } else if (data.averageScore >= 70) {
      return 'bg-yellow-50 dark:bg-yellow-900/20' // нежно-желтый для хороших результатов
    } else {
      return 'bg-pink-50 dark:bg-pink-900/20' // нежно-розовый для результатов требующих улучшения
    }
  }

  // Функция для определения цвета фона модалки (мягкие цвета, адаптированные под тему)
  const getModalOverlayColor = () => {
    // Если нет отработок - стандартный фон с учетом темы
    if (data.completedWorkouts === 0) {
      // В светлой теме - более темный фон, в темной - более светлый
      return 'rgba(0, 0, 0, 0.6)' // Более мягкий черный фон
    }
    
    // Определяем мягкие цвета на основе среднего балла с учетом темы
    if (data.averageScore >= 85) {
      // Зеленый: в светлой теме темнее, в темной светлее
      return 'rgba(16, 185, 129, 0.15)' // Более мягкий зеленый (emerald-500 с низкой прозрачностью)
    } else if (data.averageScore >= 70) {
      // Желтый: более мягкий оттенок
      return 'rgba(245, 158, 11, 0.12)' // Более мягкий желтый (amber-500 с низкой прозрачностью)
    } else {
      // Розовый: более мягкий оттенок
      return 'rgba(236, 72, 153, 0.12)' // Более мягкий розовый (pink-500 с низкой прозрачностью)
    }
  }

  const getTextColor = (percentage: number) => {
    // Для низких значений используем темный текст, для высоких - белый
    if (percentage < 30) return 'text-gray-800'
    return 'text-white'
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:border-green-600 hover:shadow-md cursor-pointer relative group",
      getCardBackgroundColor(),
      className
    )}>
      <CardContent className="p-4">
        {/* Обертка для модалки - делает всю карточку кликабельной */}
        {data.details && (data.details.recentStats || data.details.totalStats) ? (
          <StatisticsModal
            taskTitle={`${data.questionNumber}. ${data.title}`}
            completedWorkouts={data.completedWorkouts}
            averageScore={data.averageScore}
            recentStats={data.details.recentStats}
            totalStats={data.details.totalStats}
            overlayColor={getModalOverlayColor()}
          >
            <div className="space-y-3 w-full">
              {/* Заголовок */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{data.questionNumber}</h3>
                </div>
                
                {/* Индикатор изменения */}
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md text-base font-semibold ml-auto",
                  isPositiveChange && "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                  isNegativeChange && "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                  data.changePercent === 0 && "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                )}>
                  {isPositiveChange && <TrendingUp className="h-4 w-4" />}
                  {isNegativeChange && <TrendingDown className="h-4 w-4" />}
                  {data.completedWorkouts === 0 ? '0' : `${data.changePercent > 0 ? '+' : ''}${data.changePercent}%`}
                </div>
              </div>

              {/* Основная статистика */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {data.completedWorkouts > 0 ? (
                    <>Выполнено отработок  <span className="font-semibold text-foreground">{data.completedWorkouts}</span></>
                  ) : (
                    <>Без отработок</>
                  )}
                </div>
                
                {/* Средний балл как обычный текст */}
                <div className="text-sm text-muted-foreground">
                  {data.completedWorkouts > 0 ? (
                    <>Средний балл  <span className="font-semibold text-foreground">{data.averageScore}%</span></>
                  ) : (
                    <>Нет среднего балла</>
                  )}
                </div>
              </div>
            </div>
          </StatisticsModal>
        ) : (
          <div 
            className="space-y-3"
            onClick={() => onCardClick?.(data.id)}
          >
            {/* Заголовок */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{data.questionNumber}</h3>
              </div>
              
              {/* Индикатор изменения */}
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-base font-semibold ml-auto",
                isPositiveChange && "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                isNegativeChange && "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                data.changePercent === 0 && "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              )}>
                {isPositiveChange && <TrendingUp className="h-4 w-4" />}
                {isNegativeChange && <TrendingDown className="h-4 w-4" />}
                {data.completedWorkouts === 0 ? '0' : `${data.changePercent > 0 ? '+' : ''}${data.changePercent}%`}
              </div>
            </div>

            {/* Основная статистика */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {data.completedWorkouts > 0 ? (
                  <>Выполнено отработок  <span className="font-semibold text-foreground">{data.completedWorkouts}</span></>
                ) : (
                  <>Без отработок</>
                )}
              </div>
              
              {/* Средний балл как обычный текст */}
              <div className="text-sm text-muted-foreground">
                {data.completedWorkouts > 0 ? (
                  <>Средний балл  <span className="font-semibold text-foreground">{data.averageScore}%</span></>
                ) : (
                  <>Нет среднего балла</>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Кнопка-иконка со стрелочкой в правом нижнем углу с hover эффектом */}
        {data.details && (data.details.recentStats || data.details.totalStats) && (
          <div className="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-md transition-all duration-200 group-hover:bg-muted/50 pointer-events-none">
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        )}

        </CardContent>
      </Card>
    )
  }

export default StatisticsCard