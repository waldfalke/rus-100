"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// Card wrapper removed to keep content simple and consistent
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Save, Trash2, X } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { H1 } from "@/components/ui/typography";

type Option = { value: string; label: string };

function toInputDate(d?: Date): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD
}

// Tokenized multi-select (Shadcn: Popover + Command + Badges)
function MultiTagPicker({
  label,
  options,
  value,
  onChange,
  placeholder = "Выберите...",
}: {
  label: string;
  options: Option[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = new Set(value);

  const toggle = (v: string) => {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange(Array.from(next));
  };

  const remove = (v: string) => {
    const next = value.filter((x) => x !== v);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {value.length === 0 && (
          <span className="text-sm text-muted-foreground">Нет выбранных значений</span>
        )}
        {value.map((v) => {
          const opt = options.find((o) => o.value === v);
          return (
            <Badge key={v} variant="secondary" className="flex items-center gap-1">
              {opt?.label ?? v}
              <button
                aria-label="Убрать"
                className="ml-1 inline-flex"
                onClick={() => remove(v)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[320px]">
          <Command>
            <CommandInput placeholder="Поиск..." />
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem key={opt.value} onSelect={() => toggle(opt.value)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.has(opt.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
}) {
  const onNativeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const iso = e.target.value; // YYYY-MM-DD
    if (!iso) return onChange(undefined);
    const [y, m, d] = iso.split("-").map(Number);
    const next = new Date(y, (m ?? 1) - 1, d ?? 1);
    onChange(isNaN(next.getTime()) ? undefined : next);
  };

  return (
    <div>
      <Label className="block mb-2">{label}</Label>
      <input
        type="date"
        lang="ru"
        value={toInputDate(value)}
        onChange={onNativeChange}
        className="border rounded px-2 py-1 h-9"
      />
    </div>
  );
}

export default function GroupEditPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.id as string;

  // Initial values (mock). In real app, fetch by groupId
  const [name, setName] = useState<string>(`Группа ${groupId}`);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 8, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2025, 5, 1));
  const [completed, setCompleted] = useState<boolean>(false);
  const [archived, setArchived] = useState<boolean>(false);

  const folderOptions: Option[] = useMemo(
    () => [
      { value: "Тренировочные варианты (задание 22)", label: "Тренировочные варианты (задание 22)" },
      { value: "Тренировочные варианты (задание 21)", label: "Тренировочные варианты (задание 21)" },
      { value: "Орфография (тексты с пропущенными буквами)", label: "Орфография (тексты с пропущенными буквами)" },
      { value: "Тесты в формате ЕГЭ", label: "Тесты в формате ЕГЭ" },
      { value: "Сложные слова для блока \"Орфография\"", label: "Сложные слова для блока \"Орфография\"" },
      { value: "Задание 9", label: "Задание 9" },
      { value: "Наречия (задание 14)", label: "Наречия (задание 14)" },
      { value: "Задание 4", label: "Задание 4" },
      { value: "Школа, 11 класс", label: "Школа, 11 класс" },
      { value: "Тестовая группа", label: "Тестовая группа" },
      { value: "Пунктуация", label: "Пунктуация" },
      { value: "Пунктуация. Контроль", label: "Пунктуация. Контроль" },
      { value: "Повторение \"Пунктуация\"", label: "Повторение \"Пунктуация\"" },
      { value: "Чекапы", label: "Чекапы" },
      { value: "ЕГКР (от ФИПИ)", label: "ЕГКР (от ФИПИ)" },
      { value: "Тесты-25, черновик", label: "Тесты-25, черновик" },
      { value: "Сочинение. Контроль.", label: "Сочинение. Контроль." },
      { value: "Грамматика", label: "Грамматика" },
      { value: "Грамматика контроль", label: "Грамматика контроль" },
      { value: "Сгенерированные тесты", label: "Сгенерированные тесты" },
      { value: "Орфография", label: "Орфография" },
      { value: "Орфография. Контроль", label: "Орфография. Контроль" },
      { value: "Речь", label: "Речь" },
      { value: "Повторение", label: "Повторение" },
      { value: "Маркетинговые тесты", label: "Маркетинговые тесты" },
      { value: "Для гостей", label: "Для гостей" },
      { value: "8 задание", label: "8 задание" },
    ],
    []
  );

  const [dashboardFolders, setDashboardFolders] = useState<string[]>(["Тесты в формате ЕГЭ", "Грамматика"]);
  const [studentMenuFolders, setStudentMenuFolders] = useState<string[]>(["Пунктуация", "Орфография"]);

  const navigationLinks = [
    { href: '/', label: 'Главная' },
    { href: '/create-test', label: 'Тесты' },
    { href: '/dashboard', label: 'Дашборд' },
    { href: '/account', label: 'Профиль' },
  ];

  const headerProps = {
    userName: "Анна Петрова",
    userEmail: "anna.petrova@example.com",
    navLinks: navigationLinks,
    breadcrumbItems: [
      { label: 'Главная', href: '/' },
      { label: 'Дашборд', href: '/dashboard' },
      { label: `Группа ${groupId}`, href: `/dashboard/${groupId}` },
      { label: 'Редактирование' },
    ],
  } as const;

  const onSave = () => {
    const payload = {
      id: groupId,
      name,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      completed,
      archived,
      dashboardFolders,
      studentMenuFolders,
    };
    console.log("Сохранение группы", payload);
    alert("Группа сохранена (демо)");
    router.push(`/dashboard/${groupId}`);
  };

  const onDelete = () => {
    if (!confirm("Удалить группу?")) return;
    console.log("Удаление группы", groupId);
    alert("Группа удалена (демо)");
    router.push("/dashboard");
  };

  return (
    <PageLayout header={headerProps} className="py-6 space-y-6">
      <H1 className="font-source-serif-pro text-app-h1-mobile md:text-app-h1 leading-tight font-semibold text-foreground">
        Редактирование группы
      </H1>
      <div className="space-y-6">
          {/* 1-2. Название группы */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Название группы</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Русский язык 10А"
            />
          </div>

          {/* 3. Поле-группа: дата начала + дата окончания */}
          <div className="flex flex-col md:flex-row md:items-start gap-y-4 md:gap-y-0 md:gap-x-6">
            <DateField label="Дата начала" value={startDate} onChange={setStartDate} />
            <DateField label="Дата окончания" value={endDate} onChange={setEndDate} />
          </div>

          {/* 4. Папки (списки) тестов на дашборде */}
          <MultiTagPicker
            label="Папки тестов на дашборде"
            options={folderOptions}
            value={dashboardFolders}
            onChange={setDashboardFolders}
            placeholder="Выбрать папки для дашборда"
          />

          {/* 5. Папки (списки) тестов в меню "Тесты" ученика */}
          <MultiTagPicker
            label="Папки тестов в меню ученика"
            options={folderOptions}
            value={studentMenuFolders}
            onChange={setStudentMenuFolders}
            placeholder="Выбрать папки для меню ученика"
          />

          {/* 6. Свичи: Завершена, В архиве */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Завершена</Label>
                <p className="text-sm text-muted-foreground">Пометить группу как завершённую</p>
              </div>
              <Switch checked={completed} onCheckedChange={setCompleted} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">В архиве</Label>
                <p className="text-sm text-muted-foreground">Скрыть из активного списка</p>
              </div>
              <Switch checked={archived} onCheckedChange={setArchived} />
            </div>
          </div>

          {/* 7. Действия */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button onClick={onSave} className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" />
              Сохранить
            </Button>
            <Button variant="destructive" onClick={onDelete} className="inline-flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Удалить
            </Button>
          </div>
      </div>
    </PageLayout>
  );
}