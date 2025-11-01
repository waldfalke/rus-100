"use client"

import React from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose
} from './dialog'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from './button'
import { BarChart3, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatisticsItem {
  name: string
  correct: number
  total: number
  percentage: number
}

interface StatisticsSection {
  title: string
  items: StatisticsItem[]
}

interface StatisticsModalProps {
  taskTitle: string
  completedWorkouts?: number
  averageScore?: number
  recentStats?: StatisticsSection
  totalStats?: StatisticsSection
  children?: React.ReactNode
  overlayColor?: string
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 60) return 'bg-yellow-500'
  if (percentage >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

const StatisticsModal = ({
  taskTitle,
  completedWorkouts,
  averageScore,
  recentStats,
  totalStats,
  children,
  overlayColor
}: StatisticsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Подробная статистика
          </Button>
        )}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay 
          className="fixed inset-0 z-50 backdrop-blur-sm"
          style={{ backgroundColor: overlayColor || 'rgba(0, 0, 0, 0.8)' }}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4",
            "border bg-background p-0 shadow-lg",
            "duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "sm:rounded-lg max-h-[90vh] flex flex-col"
          )}
        >
          {/* Фиксированный заголовок */}
          <DialogHeader 
            className="flex-shrink-0 border-b bg-background px-6 py-4"
          >
            <DialogTitle 
              className="text-left text-2xl font-medium"
            >
              Детальная статистика {taskTitle.split('.')[0]}
            </DialogTitle>
          </DialogHeader>
          
          {/* Кнопка закрытия */}
          <DialogClose 
            className={cn(
              "absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity",
              "hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none",
              "data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
              "h-8 w-8 flex items-center justify-center"
            )}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          {/* Скроллируемый контент */}
          <div 
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            {/* Общая статистика */}
            {(completedWorkouts !== undefined || averageScore !== undefined) && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                {completedWorkouts !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Выполнено отработок:</span>
                    <span className="text-base font-bold text-foreground">{completedWorkouts}</span>
                  </div>
                )}
                {averageScore !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Средний балл:</span>
                    <span className="text-base font-bold text-foreground">{averageScore.toFixed(1)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Детальная статистика */}
            {(recentStats || totalStats) && (
              <div className="space-y-6 mt-6">
                {recentStats && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{recentStats.title}</h3>
                    <div className="space-y-3">
                      {recentStats.items.map((item, index) => {
                        const percentage = item.total > 0 ? (item.correct / item.total) * 100 : 0
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-sm font-medium flex-1 min-w-0">{item.name}</span>
                              <span className="text-base font-bold text-foreground flex-shrink-0 whitespace-nowrap">
                                {item.correct}/{item.total}  {percentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={cn("h-2 rounded-full transition-all", getProgressColor(percentage))}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {totalStats && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{totalStats.title}</h3>
                    <div className="space-y-3">
                      {totalStats.items.map((item, index) => {
                        const percentage = item.total > 0 ? (item.correct / item.total) * 100 : 0
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-sm font-medium flex-1 min-w-0">{item.name}</span>
                              <span className="text-base font-bold text-foreground flex-shrink-0 whitespace-nowrap">
                                {item.correct}/{item.total}  {percentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={cn("h-2 rounded-full transition-all", getProgressColor(percentage))}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

export default StatisticsModal