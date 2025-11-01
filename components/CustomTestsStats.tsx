"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ResponsiveStatsTable } from "@/components/ui/responsive-stats-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  Users,
  BookOpen,
  Target
} from "lucide-react"

interface CustomTest {
  id: string
  title: string
  description?: string
  type: 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'writing' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard'
  questionsCount: number
  timeLimit: number // в минутах
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  assignedStudents: number
  completedStudents: number
  averageScore?: number
  tags?: string[]
  isPublic?: boolean
}

interface CustomTestsData {
  totalTests: number
  publishedTests: number
  draftTests: number
  tests: CustomTest[]
}

export interface CustomTestsStatsProps {
  data: CustomTestsData
  className?: string
  onCreateTest?: () => void
  onEditTest?: (testId: string) => void
  onDeleteTest?: (testId: string) => void
  onViewResults?: (testId: string) => void
  onPublishTest?: (testId: string) => void
}

type SortField = keyof Pick<CustomTest, 'title' | 'questionsCount' | 'assignedStudents' | 'completedStudents' | 'averageScore' | 'createdAt'>
type SortDirection = 'asc' | 'desc' | null

const statusConfig = {
  draft: {
    label: "Черновик",
    variant: "secondary" as const,
    className: "bg-gray-50 text-gray-600 border-gray-200"
  },
  published: {
    label: "Опубликован",
    variant: "default" as const,
    className: "bg-green-50 text-green-700 border-green-200"
  },
  archived: {
    label: "Архивирован",
    variant: "outline" as const,
    className: "bg-orange-50 text-orange-700 border-orange-200"
  }
}

const typeConfig = {
  grammar: { label: "Грамматика", icon: BookOpen },
  vocabulary: { label: "Лексика", icon: Target },
  reading: { label: "Чтение", icon: Eye },
  listening: { label: "Аудирование", icon: Users },
  writing: { label: "Письмо", icon: Edit },
  mixed: { label: "Смешанный", icon: Plus }
}

const difficultyConfig = {
  easy: { label: "Легкий", className: "text-green-600" },
  medium: { label: "Средний", className: "text-yellow-600" },
  hard: { label: "Сложный", className: "text-red-600" }
}

export function CustomTestsStats({
  data,
  className,
  onCreateTest,
  onEditTest,
  onDeleteTest,
  onViewResults,
  onPublishTest,
  ...props
}: CustomTestsStatsProps) {
  const [sortField, setSortField] = React.useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc')
      if (sortDirection === 'desc') {
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />
    if (sortDirection === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />
    if (sortDirection === 'desc') return <ArrowDown className="ml-2 h-4 w-4" />
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const sortedTests = React.useMemo(() => {
    if (!sortField || !sortDirection) return data.tests

    return [...data.tests].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data.tests, sortField, sortDirection])

  const completionRate = data.totalTests > 0 ? Math.round((data.publishedTests / data.totalTests) * 100) : 0

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего тестов</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalTests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Опубликовано</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.publishedTests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Черновики</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{data.draftTests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Готовность</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Пользовательские тесты</CardTitle>
            <CardDescription>
              Управление созданными тестами и их статистикой
            </CardDescription>
          </div>
          {onCreateTest && (
            <Button onClick={onCreateTest} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Создать тест
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <ResponsiveStatsTable
            data={{
              students: sortedTests.map(test => ({
                id: test.id,
                name: test.title,
                email: test.description || ''
              })),
              columns: [
                {
                  id: 'type',
                  label: 'Тип',
                  type: 'text',
                  width: 120
                },
                {
                  id: 'difficulty',
                  label: 'Сложность',
                  type: 'text',
                  width: 100
                },
                {
                  id: 'questions',
                  label: 'Вопросы',
                  type: 'number',
                  width: 80
                },
                {
                  id: 'assigned',
                  label: 'Назначено',
                  type: 'number',
                  width: 100
                },
                {
                  id: 'completed',
                  label: 'Выполнено',
                  type: 'number',
                  width: 100
                },
                {
                  id: 'completion_rate',
                  label: 'Прогресс',
                  type: 'percentage',
                  width: 100
                },
                {
                  id: 'average_score',
                  label: 'Средний балл',
                  type: 'percentage',
                  width: 120
                },
                {
                  id: 'status',
                  label: 'Статус',
                  type: 'text',
                  width: 100
                }
              ],
              values: sortedTests.reduce((acc, test) => {
                const completionRate = test.assignedStudents > 0 
                  ? Math.round((test.completedStudents / test.assignedStudents) * 100) 
                  : 0
                
                acc[test.id] = {
                  type: typeConfig[test.type].label,
                  difficulty: difficultyConfig[test.difficulty].label,
                  questions: test.questionsCount,
                  assigned: test.assignedStudents,
                  completed: test.completedStudents,
                  completion_rate: completionRate,
                  average_score: test.averageScore || 0,
                  status: statusConfig[test.status].label
                }
                return acc
              }, {} as Record<string, Record<string, any>>)
            }}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  )
}