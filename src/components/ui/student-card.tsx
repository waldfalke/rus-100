"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { 
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

export interface StudentTestResult {
  testId: string
  testName: string
  score: number
  maxScore: number
  completedAt: Date
  status: "completed" | "in_progress" | "not_started"
  timeSpent?: number // в минутах
}

export interface StudentCardProps {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  joinedAt?: Date
  lastActivity?: Date
  mode?: "compact" | "expanded"
  overallProgress?: number
  testResults?: StudentTestResult[]
  className?: string
  onEmailClick?: (email: string) => void
  onPhoneClick?: (phone: string) => void
  onTestClick?: (testId: string) => void
}

const getScoreVariant = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100
  if (percentage >= 80) return "success"
  if (percentage >= 60) return "warning" 
  return "destructive"
}

const getScoreIcon = (score: number, maxScore: number) => {
  const percentage = (score / maxScore) * 100
  if (percentage >= 80) return <TrendingUp className="h-3 w-3" />
  if (percentage >= 60) return <Minus className="h-3 w-3" />
  return <TrendingDown className="h-3 w-3" />
}

const getStatusIcon = (status: StudentTestResult["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "in_progress":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "not_started":
      return <XCircle className="h-4 w-4 text-gray-400" />
  }
}

const getStatusLabel = (status: StudentTestResult["status"]) => {
  switch (status) {
    case "completed":
      return "Завершен"
    case "in_progress":
      return "В процессе"
    case "not_started":
      return "Не начат"
  }
}

export function StudentCard({
  id,
  name,
  email,
  phone,
  avatar,
  joinedAt,
  lastActivity,
  mode = "compact",
  overallProgress,
  testResults = [],
  className,
  onEmailClick,
  onPhoneClick,
  onTestClick,
  ...props
}: StudentCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(mode === "expanded")
  
  const formatDate = (date?: Date) => {
    if (!date) return "Неизвестно"
    return date.toLocaleDateString('ru-RU')
  }

  const formatLastActivity = (date?: Date) => {
    if (!date) return "Нет активности"
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Только что"
    if (diffInHours < 24) return `${diffInHours} ч. назад`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} дн. назад`
    return date.toLocaleDateString('ru-RU')
  }

  const formatTimeSpent = (minutes?: number) => {
    if (!minutes) return "—"
    if (minutes < 60) return `${minutes} мин`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}ч ${remainingMinutes}м`
  }

  const completedTests = testResults.filter(t => t.status === "completed")
  const averageScore = completedTests.length > 0 
    ? completedTests.reduce((sum, test) => sum + (test.score / test.maxScore) * 100, 0) / completedTests.length
    : 0

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-sm font-medium">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base leading-tight truncate">
                {name}
              </h3>
              
              {testResults.length > 0 && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isExpanded ? "Свернуть" : "Развернуть"}
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}
            </div>
            
            {/* Контактная информация */}
            <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
              {email && (
                <button
                  onClick={() => onEmailClick?.(email)}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{email}</span>
                </button>
              )}
              {phone && (
                <button
                  onClick={() => onPhoneClick?.(phone)}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  <span>{phone}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Основная статистика */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Присоединился:</span>
            </div>
            <div className="font-medium">{formatDate(joinedAt)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Последняя активность:</span>
            </div>
            <div className="font-medium">{formatLastActivity(lastActivity)}</div>
          </div>
        </div>

        {/* Общий прогресс */}
        {overallProgress !== undefined && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Общий прогресс</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}

        {/* Краткая статистика по тестам */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{completedTests.length}</div>
              <div className="text-xs text-muted-foreground">Завершено</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{Math.round(averageScore)}%</div>
              <div className="text-xs text-muted-foreground">Средний балл</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{testResults.length}</div>
              <div className="text-xs text-muted-foreground">Всего тестов</div>
            </div>
          </div>
        )}

        {/* Развернутая информация о тестах */}
        {testResults.length > 0 && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleContent className="space-y-3">
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Результаты тестов
                </h4>
                
                <div className="space-y-2">
                  {testResults.map((test) => (
                    <div
                      key={test.testId}
                      className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => onTestClick?.(test.testId)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(test.status)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {test.testName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getStatusLabel(test.status)}
                            {test.status === "completed" && test.completedAt && (
                              <> • {formatDate(test.completedAt)}</>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {test.status === "completed" && (
                          <>
                            <Badge
                              variant={getScoreVariant(test.score, test.maxScore) as any}
                              className="text-xs"
                            >
                              <span className="flex items-center gap-1">
                                {getScoreIcon(test.score, test.maxScore)}
                                {test.score}/{test.maxScore}
                              </span>
                            </Badge>
                            {test.timeSpent && (
                              <span className="text-xs text-muted-foreground">
                                {formatTimeSpent(test.timeSpent)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}