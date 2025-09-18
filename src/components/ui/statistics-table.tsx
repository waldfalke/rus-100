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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"

export interface StatisticsRow {
  id: string
  student: {
    name: string
    email?: string
    avatar?: string
  }
  testsCompleted: number
  totalTests: number
  averageScore: number
  lastActivity?: Date
  timeSpent: number // в минутах
  status: "active" | "inactive" | "completed"
  progress: number
}

export interface StatisticsTableProps {
  data: StatisticsRow[]
  className?: string
  onRowClick?: (row: StatisticsRow) => void
  onExport?: () => void
  onViewDetails?: (studentId: string) => void
  onEditStudent?: (studentId: string) => void
  onDeleteStudent?: (studentId: string) => void
}

type SortField = keyof Pick<StatisticsRow, 'testsCompleted' | 'averageScore' | 'timeSpent' | 'progress'> | 'student.name'
type SortDirection = 'asc' | 'desc' | null

const statusConfig = {
  active: {
    label: "Активен",
    variant: "default" as const,
    className: "bg-green-50 text-green-700 border-green-200"
  },
  inactive: {
    label: "Неактивен",
    variant: "secondary" as const,
    className: "bg-gray-50 text-gray-600 border-gray-200"
  },
  completed: {
    label: "Завершил",
    variant: "outline" as const,
    className: "bg-blue-50 text-blue-700 border-blue-200"
  }
}

export function StatisticsTable({
  data,
  className,
  onRowClick,
  onExport,
  onViewDetails,
  onEditStudent,
  onDeleteStudent,
  ...props
}: StatisticsTableProps) {
  const [sortField, setSortField] = React.useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc'
      )
      if (sortDirection === 'desc') {
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />
    }
    if (sortDirection === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />
  }

  const sortedData = React.useMemo(() => {
    if (!sortField || !sortDirection) return data

    return [...data].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortField === 'student.name') {
        aValue = a.student.name.toLowerCase()
        bValue = b.student.name.toLowerCase()
      } else {
        aValue = a[sortField as keyof StatisticsRow]
        bValue = b[sortField as keyof StatisticsRow]
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortField, sortDirection])

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${minutes} мин`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}ч ${remainingMinutes}м`
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

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (score >= 60) return <Minus className="h-3 w-3 text-yellow-600" />
    return <TrendingDown className="h-3 w-3 text-red-600" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Заголовок с действиями */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Статистика учеников</h3>
          <p className="text-sm text-muted-foreground">
            Показано {sortedData.length} из {data.length} учеников
          </p>
        </div>
        
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт
          </Button>
        )}
      </div>

      {/* Таблица */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('student.name')}
                  className="h-auto p-0 font-medium"
                >
                  Ученик
                  {getSortIcon('student.name')}
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('testsCompleted')}
                  className="h-auto p-0 font-medium"
                >
                  Тесты
                  {getSortIcon('testsCompleted')}
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('averageScore')}
                  className="h-auto p-0 font-medium"
                >
                  Средний балл
                  {getSortIcon('averageScore')}
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('progress')}
                  className="h-auto p-0 font-medium"
                >
                  Прогресс
                  {getSortIcon('progress')}
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('timeSpent')}
                  className="h-auto p-0 font-medium"
                >
                  Время
                  {getSortIcon('timeSpent')}
                </Button>
              </TableHead>
              <TableHead>Последняя активность</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => {
              const statusInfo = statusConfig[row.status]
              
              return (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick?.(row)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={row.student.avatar} alt={row.student.name} />
                        <AvatarFallback className="text-xs">
                          {row.student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{row.student.name}</div>
                        {row.student.email && (
                          <div className="text-sm text-muted-foreground truncate">
                            {row.student.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {row.testsCompleted}/{row.totalTests}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((row.testsCompleted / row.totalTests) * 100)}%
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className={cn("font-medium flex items-center justify-center gap-1", getScoreColor(row.averageScore))}>
                      {getScoreIcon(row.averageScore)}
                      {Math.round(row.averageScore)}%
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="space-y-1">
                      <div className="font-medium">{row.progress}%</div>
                      <Progress value={row.progress} className="h-1" />
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-center font-medium">
                    {formatTimeSpent(row.timeSpent)}
                  </TableCell>
                  
                  <TableCell className="text-sm text-muted-foreground">
                    {formatLastActivity(row.lastActivity)}
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant={statusInfo.variant}
                      className={cn("text-xs", statusInfo.className)}
                    >
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Открыть меню</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onViewDetails?.(row.id)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          Подробности
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onEditStudent?.(row.id)
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteStudent?.(row.id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Пустое состояние */}
      {sortedData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Нет данных для отображения</p>
        </div>
      )}
    </div>
  )
}