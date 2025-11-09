'use client';

import { useState } from 'react';
import { ActionPanel } from '@/components/ui/action-panel';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MultiTagPicker, Option as MultiOption } from '@/components/ui/multi-tag-picker';
import { DateRangePopover } from '@/components/ui/date-range-popover';
import { Option } from '@/components/ui/searchable-select';
import { TestFormInline, TestFormData } from '@/components/ui/test-form-inline';
import {
  BookOpen,
  UserPlus,
  ArrowRightLeft,
  MoreHorizontal,
  FileText,
  Sparkles,
  Users
} from 'lucide-react';

export default function ActionPanelDemoPage() {
  const [testsSource, setTestsSource] = useState<'all' | 'platform' | 'mine'>('platform');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [groupsOwners, setGroupsOwners] = useState<string[]>([]);
  const [showArchivedGroups, setShowArchivedGroups] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');

  // Фильтры для секции "Фильтры"
  const [selectedStudentIdsFilters, setSelectedStudentIdsFilters] = useState<string[]>([]);
  const [selectedTestIdsFilters, setSelectedTestIdsFilters] = useState<string[]>([]);
  const [startDateFilters, setStartDateFilters] = useState<Date | undefined>(undefined);
  const [endDateFilters, setEndDateFilters] = useState<Date | undefined>(undefined);

  // Форма создания теста
  const [testFormData, setTestFormData] = useState<TestFormData>({
    testName: '',
    account: undefined,
    testGroup: undefined,
  });

  const students = [
    { id: '1', name: 'Иванов Алексей' },
    { id: '2', name: 'Петрова Мария' },
    { id: '3', name: 'Сидоров Дмитрий' },
  ];

  const accountOptions: Option[] = [
    { value: '1', label: 'Аккаунт 1' },
    { value: '2', label: 'Аккаунт 2' },
    { value: '3', label: 'Аккаунт 3' },
  ];

  const testGroupOptions: Option[] = [
    { value: '3', label: 'Тесты-25' },
    { value: '4', label: 'Пунктуация' },
    { value: '5', label: 'Пунктуация. Контроль.' },
    { value: '6', label: 'Чекапы' },
    { value: '7', label: 'Сочинение' },
    { value: '8', label: 'Сочинение. Контроль.' },
    { value: '9', label: 'Грамматика' },
    { value: '10', label: 'Грамматика контроль' },
    { value: '29', label: 'Сгенерированные тесты' },
    { value: '60', label: 'ЕГКР (от ФИПИ)' },
    { value: '127', label: 'Орфография' },
    { value: '128', label: 'Орфография. Контроль' },
    { value: '255', label: 'Орфография (тексты с пропущенными буквами)' },
    { value: '333', label: 'Речь' },
    { value: '9', label: 'Задание 9' },
    { value: '14', label: 'Наречия (задание 14)' },
    { value: '4-2', label: 'Задание 4' },
    { value: '22', label: 'Тренировочные варианты (задание 22)' },
    { value: '21', label: 'Тренировочные варианты (задание 21)' },
    { value: 'school', label: 'Школа, 11 класс' },
    { value: 'test-group', label: 'Тестовая группа' },
    { value: 'marketing', label: 'Маркетинговые тесты' },
    { value: 'repeat', label: 'Повторение' },
    { value: 'hard-words', label: 'Сложные слова для блока "Орфография"' },
    { value: 'ege', label: 'Тесты в формате ЕГЭ' },
    { value: 'guests', label: 'Для гостей' },
  ];

  const handleCreateGroup = (groupName: string) => {
    alert(`Создана группа: ${groupName}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-16 space-y-24">
        <div>
          <h1 className="text-2xl font-semibold">ActionPanel</h1>
        </div>

        {/* Тесты */}
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-muted-foreground">Тесты</h2>
          <ActionPanel
            filterGroups={[
              {
                id: 'source',
                controls: [
                  { type: 'chip', id: 'all', label: 'Все', selected: testsSource === 'all', onToggle: () => setTestsSource('all') },
                  { type: 'chip', id: 'platform', label: 'Тесты платформы', selected: testsSource === 'platform', onToggle: () => setTestsSource('platform') },
                  { type: 'chip', id: 'mine', label: 'Мои тесты', selected: testsSource === 'mine', onToggle: () => setTestsSource('mine') },
                ],
              },
            ]}
            primaryAction={{
              label: 'Создать тест',
              icon: BookOpen,
              onClick: () => alert('Создать тест'),
            }}
            density="compact"
          />
        </section>

        {/* Ученики */}
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-muted-foreground">Ученики</h2>
          <ActionPanel
            filterGroups={[]}
            selectAll={{
              label: 'Выбрать всех',
              checked: students.length > 0 && selectedStudents.length === students.length,
              onToggle: (checked) => {
                if (checked) {
                  setSelectedStudents(students.map(s => s.id));
                } else {
                  setSelectedStudents([]);
                }
              },
            }}
            secondaryActions={selectedStudents.length > 0 ? [
              {
                id: 'transfer',
                label: 'Перенести',
                icon: ArrowRightLeft,
                onClick: () => alert('Перенести'),
              },
            ] : []}
            primaryAction={{
              label: 'Добавить учеников',
              icon: UserPlus,
              onClick: () => alert('Добавить учеников'),
            }}
            density="compact"
          />
        </section>

        {/* Группы */}
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-muted-foreground">Группы</h2>
          <ActionPanel
            filterGroups={[
              {
                id: 'filters',
                controls: [
                  {
                    type: 'multiselect',
                    id: 'owner',
                    label: 'Аккаунты',
                    values: groupsOwners,
                    options: [
                      { label: 'Курсы Марьям', value: 'maryam' },
                      { label: 'Аккаунт Аллы', value: 'alla' },
                      { label: 'Аккаунт Марины', value: 'marina' },
                    ],
                    onChange: (values) => setGroupsOwners(values),
                    footer: (
                      <div className="px-2 py-1.5 flex items-center gap-2">
                        <Switch checked={showArchivedGroups} onCheckedChange={setShowArchivedGroups} />
                        <span className="text-sm">Показать архивные</span>
                      </div>
                    ),
                  },
                ],
              },
            ]}
            search={{
              placeholder: 'Поиск по группам...',
              query: '',
              onQueryChange: (q) => console.log('Search:', q),
            }}
            primaryAction={{
              label: 'Действия',
              icon: MoreHorizontal,
              items: [
                {
                  id: 'my-tests',
                  label: 'Мои тесты',
                  icon: FileText,
                  onClick: () => alert('Мои тесты'),
                },
                {
                  id: 'generate',
                  label: 'Сгенерировать тест',
                  icon: Sparkles,
                  onClick: () => alert('Сгенерировать тест'),
                },
                {
                  id: 'team',
                  label: 'Наша команда',
                  icon: Users,
                  onClick: () => alert('Наша команда'),
                },
                {
                  id: 'create',
                  label: 'Создать группу',
                  icon: UserPlus,
                  onClick: () => alert('Создать группу'),
                },
              ],
            }}
            density="compact"
          />
        </section>

        {/* Фильтры */}
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-muted-foreground">Фильтры</h2>
          {(() => {
            const studentOptions: MultiOption[] = students.map((s) => ({ value: s.id, label: s.name }));
            const testOptions: MultiOption[] = [
              { value: 'test-1', label: 'Падежи существительных' },
              { value: 'test-2', label: 'Синонимы и антонимы' },
              { value: 'test-3', label: 'Анализ текста Пушкина' },
            ];

            const getSummary = (title: string, ids: string[], options: MultiOption[]) => {
              if (!ids || ids.length === 0) return `${title} · все`;
              const labels = ids
                .map((id) => options.find((o) => o.value === id)?.label || id)
                .filter(Boolean);
              if (labels.length === 1) return `${title} · ${labels[0]}`;
              return `${title} · ${labels[0]} +${labels.length - 1}`;
            };
            const studentSummary = getSummary('Ученики', selectedStudentIdsFilters, studentOptions);
            const testSummary = getSummary('Тесты', selectedTestIdsFilters, testOptions);

            return (
              <div className="flex flex-wrap items-center gap-2">
                <MultiTagPicker
                  options={studentOptions}
                  value={selectedStudentIdsFilters}
                  onChange={setSelectedStudentIdsFilters}
                  showChips={false}
                  placeholder={studentSummary}
                  triggerClassName="h-9 px-3"
                />
                <MultiTagPicker
                  options={testOptions}
                  value={selectedTestIdsFilters}
                  onChange={setSelectedTestIdsFilters}
                  showChips={false}
                  placeholder={testSummary}
                  triggerClassName="h-9 px-3"
                />
                <DateRangePopover
                  onChange={(start, end) => {
                    setStartDateFilters(start);
                    setEndDateFilters(end);
                  }}
                  startDate={startDateFilters}
                  endDate={endDateFilters}
                  triggerClassName="h-9 px-3"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedStudentIdsFilters([]);
                    setSelectedTestIdsFilters([]);
                    setStartDateFilters(undefined);
                    setEndDateFilters(undefined);
                  }}
                >
                  Сброс
                </Button>
              </div>
            );
          })()}
        </section>

        {/* Создание теста */}
        <section className="space-y-6">
          <h2 className="text-lg font-medium text-muted-foreground">Создание теста</h2>
          <TestFormInline
            value={testFormData}
            onChange={setTestFormData}
            accountOptions={accountOptions}
            testGroupOptions={testGroupOptions}
            onCreateGroup={handleCreateGroup}
          />
        </section>
      </div>
    </div>
  );
}
