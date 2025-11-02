import * as React from 'react'
import { StudentData } from '../types'

interface StudentInfoProps {
  student: StudentData
  className?: string
}

/**
 * Атом: Информация о студенте (имя + email)
 */
export function StudentInfo({ student, className = '' }: StudentInfoProps) {
  return (
    <div className={`student-info ${className}`}>
      <div className="student-name">{student.name}</div>
      <div className="student-email">{student.email}</div>
    </div>
  )
}
