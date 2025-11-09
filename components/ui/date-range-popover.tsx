"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronDown } from "lucide-react";

type Props = {
  label?: string;
  startDate?: Date;
  endDate?: Date;
  onChange: (start?: Date, end?: Date) => void;
  triggerClassName?: string;
};

const monthsRu = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

function formatShort(d?: Date) {
  if (!d) return "";
  const day = d.getDate();
  const m = monthsRu[d.getMonth()];
  return `${day} ${m}`;
}

function getSummary(start?: Date, end?: Date) {
  if (!start && !end) return "Период · все";
  if (start && !end) return `С ${formatShort(start)}`;
  if (!start && end) return `До ${formatShort(end)}`;
  const sameMonth = start!.getMonth() === end!.getMonth() && start!.getFullYear() === end!.getFullYear();
  if (sameMonth) return `${start!.getDate()}–${end!.getDate()} ${monthsRu[start!.getMonth()]}`;
  return `${formatShort(start!)} – ${formatShort(end!)}`;
}

function toInputDate(d?: Date) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseIsoInput(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  const next = new Date(y, (m ?? 1) - 1, d ?? 1);
  return isNaN(next.getTime()) ? undefined : next;
}

export function DateRangePopover({ label, startDate, endDate, onChange, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [localStart, setLocalStart] = useState<Date | undefined>(startDate);
  const [localEnd, setLocalEnd] = useState<Date | undefined>(endDate);

  const summary = useMemo(() => getSummary(localStart, localEnd), [localStart, localEnd]);

  const apply = () => {
    onChange(localStart, localEnd);
    setOpen(false);
  };

  const clear = () => {
    setLocalStart(undefined);
    setLocalEnd(undefined);
    onChange(undefined, undefined);
    setOpen(false);
  };

  const setPreset = (type: "today" | "yesterday" | "week" | "last7" | "month" | "last30") => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    if (type === "today") {
      // today
    } else if (type === "yesterday") {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else if (type === "week") {
      // current week (Mon–Sun)
      const day = now.getDay(); // Sun=0
      const diffToMonday = ((day + 6) % 7);
      start.setDate(now.getDate() - diffToMonday);
      end.setDate(start.getDate() + 6);
    } else if (type === "last7") {
      start.setDate(now.getDate() - 6);
    } else if (type === "month") {
      start.setDate(1);
      end.setMonth(now.getMonth() + 1);
      end.setDate(0); // last day of previous month
    } else if (type === "last30") {
      start.setDate(now.getDate() - 29);
    }
    setLocalStart(new Date(start.getFullYear(), start.getMonth(), start.getDate()));
    setLocalEnd(new Date(end.getFullYear(), end.getMonth(), end.getDate()));
  };

  return (
    <div className="space-y-2">
      {label ? <Label>{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("w-auto justify-between whitespace-nowrap", triggerClassName)}
            aria-expanded={open}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {summary}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-[var(--radix-popover-trigger-width)] min-w-[320px]">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPreset("today")}>Сегодня</Button>
              <Button variant="secondary" size="sm" onClick={() => setPreset("yesterday")}>Вчера</Button>
              <Button variant="secondary" size="sm" onClick={() => setPreset("week")}>Неделя</Button>
              <Button variant="secondary" size="sm" onClick={() => setPreset("last7")}>7 дней</Button>
              <Button variant="secondary" size="sm" onClick={() => setPreset("month")}>Месяц</Button>
              <Button variant="secondary" size="sm" onClick={() => setPreset("last30")}>30 дней</Button>
            </div>
            <div className="grid grid-cols-2 gap-2 items-end">
              <div>
                <Label className="block mb-1">Дата от</Label>
                <input
                  type="date"
                  lang="ru"
                  value={toInputDate(localStart)}
                  onChange={(e) => setLocalStart(parseIsoInput(e.target.value))}
                  className="border rounded px-2 py-1 h-9 w-full"
                />
              </div>
              <div>
                <Label className="block mb-1">Дата до</Label>
                <input
                  type="date"
                  lang="ru"
                  value={toInputDate(localEnd)}
                  onChange={(e) => setLocalEnd(parseIsoInput(e.target.value))}
                  className="border rounded px-2 py-1 h-9 w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={clear}>Сброс</Button>
              <Button onClick={apply}>Применить</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}