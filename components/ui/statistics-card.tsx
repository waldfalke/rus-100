"use client"

import * as React from "react"
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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
  const [isExpanded, setIsExpanded] = React.useState(false)

  const isPositiveChange = data.changePercent > 0
  const isNegativeChange = data.changePercent < 0

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer bg-white border-gray-200">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardContent className="p-4">
          <div 
            className="space-y-3"
            onClick={() => onCardClick?.(data.id)}
          >
            {/* Заголовок */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{data.questionNumber}</h3>
                <Badge variant="outline" className="text-xs">
                  Уровень {data.level}
                </Badge>
              </div>
              
              {/* Индикатор изменения */}
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ml-auto",
                isPositiveChange && "bg-green-100 text-green-700",
                isNegativeChange && "bg-red-100 text-red-700",
                data.changePercent === 0 && "bg-gray-100 text-gray-700"
              )}>
                {isPositiveChange && <TrendingUp className="h-3 w-3" />}
                {isNegativeChange && <TrendingDown className="h-3 w-3" />}
                {data.changePercent > 0 ? '+' : ''}{data.changePercent}%
              </div>
            </div>

            {/* Основная статистика */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Выполнено отработок: <span className="font-semibold text-foreground">{data.completedWorkouts}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Средний балл: <span className="font-semibold text-foreground">{data.averageScore}%</span>
              </div>
              
              {/* Прогресс-бар */}
              <div className="space-y-1">
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-300 rounded-full",
                      getProgressColor(data.averageScore)
                    )}
                    style={{ width: `${data.averageScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Кнопка раскрытия */}
            {data.details && (
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-center pt-2 border-t border-current/20">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        Скрыть детали
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        Показать детали
                      </>
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
            )}
          </div>

          {/* Детальная статистика */}
          {data.details && (
            <CollapsibleContent className="space-y-4 pt-4 border-t border-current/20 mt-4">
              {/* Последние результаты */}
              {data.details.recentStats && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">{data.details.recentStats.title}</h4>
                  <div className="space-y-2">
                    {data.details.recentStats.items.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            <span className="font-medium">{item.correct}/{item.total}</span> {item.name}
                          </span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-300 rounded-full",
                              getProgressColor(item.percentage)
                            )}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Общая статистика */}
              {data.details.totalStats && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">{data.details.totalStats.title}</h4>
                  <div className="space-y-2">
                    {data.details.totalStats.items.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            <span className="font-medium">{item.correct}/{item.total}</span> {item.name}
                          </span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-300 rounded-full",
                              getProgressColor(item.percentage)
                            )}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CollapsibleContent>
          )}
        </CardContent>
      </Collapsible>
    </Card>
  )
}

export default StatisticsCard