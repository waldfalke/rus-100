import * as React from 'react'
import { cn } from '@/lib/utils'
import { StudentData, StatColumn, StatData } from '../types'
import { StudentInfo } from '../atoms/StudentInfo'
import { TableCell } from '../atoms/TableCell'

interface StudentRowProps {
  student: StudentData
  columns: StatColumn[]
  studentStats: StatData
  stickyStudent?: boolean
  onCellClick?: (studentId: string, columnKey: string, value: any) => void
}

/**
 * Молекула: Строка с данными студента
 */
export function StudentRow({
  student,
  columns,
  studentStats,
  stickyStudent,
  onCellClick
}: StudentRowProps) {
  return (
    <tr>
      <td
        className={cn(
          "student-column bg-background",
          stickyStudent && "sticky left-0 z-20"
        )}
        style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
      >
        <StudentInfo student={student} />
      </td>
      {columns.map((column) => {
        const value = studentStats[column.key]
        return (
          <TableCell
            key={column.key}
            value={value}
            column={column}
            studentEmail={student.email}
            studentName={student.name}
            onClick={() => onCellClick?.(student.id, column.key, value)}
          />
        )
      })}
    </tr>
  )
}
