import React, { useState } from 'react';
import './AirtableStyleTable.css';

const AirtableStyleTable = () => {
  // Тестовые данные учеников
  const [students] = useState([
    {
      id: 1,
      name: 'Грета Цатурян',
      email: 'tsaturyan3003@mail.ru',
      totalStats: { score: 228, maxScore: 460 },
      testResults: [
        { testId: 1, score: 149, maxScore: 182 },
        { testId: 2, score: 137, maxScore: 186 },
        { testId: 3, score: 140, maxScore: 185 },
        { testId: 4, score: 0, maxScore: 0 },
        { testId: 5, score: 0, maxScore: 0 },
        { testId: 6, score: 0, maxScore: 0 },
        { testId: 7, score: 0, maxScore: 0 },
        { testId: 8, score: 0, maxScore: 0 },
      ]
    },
    {
      id: 2,
      name: 'Козлова Вера',
      email: 'vera30995@gmail.com',
      totalStats: { score: 0, maxScore: 0 },
      testResults: [
        { testId: 1, score: 0, maxScore: 0 },
        { testId: 2, score: 0, maxScore: 0 },
        { testId: 3, score: 0, maxScore: 0 },
        { testId: 4, score: 0, maxScore: 0 },
        { testId: 5, score: 0, maxScore: 0 },
        { testId: 6, score: 0, maxScore: 0 },
        { testId: 7, score: 0, maxScore: 0 },
        { testId: 8, score: 0, maxScore: 0 },
      ]
    },
    {
      id: 3,
      name: 'Маша',
      email: 'maria2107kaplina@gmail.com',
      totalStats: { score: 0, maxScore: 0 },
      testResults: [
        { testId: 1, score: 0, maxScore: 0 },
        { testId: 2, score: 0, maxScore: 0 },
        { testId: 3, score: 0, maxScore: 0 },
        { testId: 4, score: 0, maxScore: 0 },
        { testId: 5, score: 0, maxScore: 0 },
        { testId: 6, score: 0, maxScore: 0 },
        { testId: 7, score: 0, maxScore: 0 },
        { testId: 8, score: 0, maxScore: 0 },
      ]
    },
    {
      id: 4,
      name: 'Sofia Korshunova',
      email: 'sofya89606299084@mail.ru',
      totalStats: { score: 0, maxScore: 0 },
      testResults: [
        { testId: 1, score: 0, maxScore: 0 },
        { testId: 2, score: 0, maxScore: 0 },
        { testId: 3, score: 0, maxScore: 0 },
        { testId: 4, score: 0, maxScore: 0 },
        { testId: 5, score: 0, maxScore: 0 },
        { testId: 6, score: 0, maxScore: 0 },
        { testId: 7, score: 0, maxScore: 0 },
        { testId: 8, score: 0, maxScore: 0 },
      ]
    },
    {
      id: 5,
      name: 'Инна',
      email: 'gorbat.i@icloud.com',
      totalStats: { score: 0, maxScore: 0 },
      testResults: [
        { testId: 1, score: 0, maxScore: 0 },
        { testId: 2, score: 0, maxScore: 0 },
        { testId: 3, score: 0, maxScore: 0 },
        { testId: 4, score: 0, maxScore: 0 },
        { testId: 5, score: 0, maxScore: 0 },
        { testId: 6, score: 0, maxScore: 0 },
        { testId: 7, score: 0, maxScore: 0 },
        { testId: 8, score: 0, maxScore: 0 },
      ]
    },
    {
      id: 6,
      name: 'Вячеслав',
      email: 'nastaromanov666@gmail.com',
      totalStats: { score: 0, maxScore: 0 },
      testResults: [
        { testId: 1, score: 0, maxScore: 0 },
        { testId: 2, score: 0, maxScore: 0 },
        { testId: 3, score: 0, maxScore: 0 },
        { testId: 4, score: 0, maxScore: 0 },
        { testId: 5, score: 0, maxScore: 0 },
        { testId: 6, score: 0, maxScore: 0 },
        { testId: 7, score: 0, maxScore: 0 },
        { testId: 8, score: 0, maxScore: 0 },
      ]
    }
  ]);

  // Заголовки тестов
  const testHeaders = [
    'Пунктуация. Контроль',
    'Задание 16. Точка контроля',
    'Задание 17. Точка контроля',
    'Задание 18. Точка контроля',
    'Задание 19. Точка контроля',
    'Задание 20. Точка контроля',
    'Задание 21. Точка контроля',
    'Задание 22. Точка контроля'
  ];

  return (
    <div className="airtable-container">
      <h1>Статистика группы Тесты, Русский-Годовой, 2025 по списку тестов Пунктуация. Контроль</h1>
      
      <div className="table-wrapper">
        {/* Заголовки таблицы */}
        <div className="table-header">
          <div className="header-cell student-header">Ученик и условия</div>
          <div className="header-cell total-header">Всего</div>
          {testHeaders.map((header, index) => (
            <div key={index} className="header-cell test-header">
              {header}
            </div>
          ))}
        </div>

        {/* Строки с данными учеников */}
        <div className="table-body">
          {students.map((student) => (
            <div key={student.id} className="student-row">
              {/* Фиксированная часть с именем ученика */}
              <div className="student-info-sticky">
                <div className="student-name">{student.name}</div>
                <div className="student-email">{student.email}</div>
              </div>
              
              {/* Скроллируемая часть с результатами */}
              <div className="student-results">
                <div className="total-stats">
                  {student.totalStats.score} / {student.totalStats.maxScore}
                </div>
                {student.testResults.map((result, index) => (
                  <div key={index} className="test-result">
                    {result.score}/{result.maxScore}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirtableStyleTable;