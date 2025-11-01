// Code Contracts: PENDING
// @token-status: COMPLETED
'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Tariff, PaymentOption } from '../../types/account';
import { CreditCard, Check, ArrowRight } from 'lucide-react';

interface TariffPaymentCardProps {
  paidUntilDate: string;
  currentTariff?: Tariff;
  nextTariff?: Tariff;
  paymentOptions: PaymentOption[];
}

// Calculate payment options based on selected tariff
const calculatePaymentOptions = (tariff: Tariff): PaymentOption[] => {
  const baseDate = new Date();
  const monthLater = new Date(baseDate);
  monthLater.setMonth(monthLater.getMonth() + 1);

  const yearEnd = new Date(baseDate.getFullYear(), 11, 31);

  return [
    {
      id: `pay_month_${tariff.id}`,
      label: `Оплатить на месяц`,
      description: `до ${monthLater.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
      cost: tariff.costPerPeriod,
      url: '#',
      period: 'month',
    },
    {
      id: `pay_year_${tariff.id}`,
      label: `Оплатить до конца года`,
      description: `до ${yearEnd.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
      cost: Math.round(tariff.costPerPeriod * 1.5),
      url: '#',
      period: 'year',
    },
  ];
};

export const TariffPaymentCard: React.FC<TariffPaymentCardProps> = ({
  paidUntilDate,
  currentTariff,
  nextTariff,
}) => {
  // State for selected tariff (defaults to current)
  const [selectedTariffId, setSelectedTariffId] = useState<string | undefined>(
    currentTariff?.id
  );

  // Find the selected tariff object
  const selectedTariff = useMemo(() => {
    if (selectedTariffId === currentTariff?.id) return currentTariff;
    if (selectedTariffId === nextTariff?.id) return nextTariff;
    return currentTariff;
  }, [selectedTariffId, currentTariff, nextTariff]);

  // Calculate payment options for selected tariff
  const dynamicPaymentOptions = useMemo(() => {
    return selectedTariff ? calculatePaymentOptions(selectedTariff) : [];
  }, [selectedTariff]);

  // Check if we have both tariffs available
  const hasTariffOptions = currentTariff && nextTariff;
  const isUpgrade = selectedTariffId === nextTariff?.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-source-serif-pro text-xl font-semibold">Тариф и оплата</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Paid until status bar */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <p className="text-sm">
            <span className="text-muted-foreground">Оплачено до </span>
            <span className="font-semibold">{paidUntilDate}</span>
          </p>
          <Badge variant="outline" className="text-xs bg-background">
            Активен
          </Badge>
        </div>

        {/* Tariff Selection Grid */}
        <div>
          <h3 className="text-base font-semibold mb-3">Выберите тариф</h3>

        {hasTariffOptions ? (
          <RadioGroup
            value={selectedTariffId}
            onValueChange={setSelectedTariffId}
            className="grid gap-3 sm:grid-cols-2"
          >
            {/* Current Tariff Card */}
            {currentTariff && (
              <div className="relative">
                <RadioGroupItem
                  value={currentTariff.id}
                  id={currentTariff.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={currentTariff.id}
                  className="flex flex-col h-full cursor-pointer"
                >
                  <Card className={`h-full border-2 transition-all hover:border-primary ${selectedTariffId === currentTariff.id ? 'border-green-600 bg-green-50 dark:bg-green-950/20' : ''}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 flex-shrink-0 ${selectedTariffId === currentTariff.id ? 'border-green-600' : 'border-muted-foreground'}`}>
                            {selectedTariffId === currentTariff.id && (
                              <div className="w-3 h-3 rounded-full bg-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm mb-1.5">{currentTariff.name}</p>
                            <p className="text-lg font-semibold">{currentTariff.costPerPeriod}₽<span className="text-xs font-normal text-muted-foreground">/мес</span></p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0 bg-background">Текущий</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            )}

            {/* Next Tariff Card */}
            {nextTariff && (
              <div className="relative">
                <RadioGroupItem
                  value={nextTariff.id}
                  id={nextTariff.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={nextTariff.id}
                  className="flex flex-col h-full cursor-pointer"
                >
                  <Card className={`h-full border-2 transition-all hover:border-primary ${selectedTariffId === nextTariff.id ? 'border-green-600 bg-green-50 dark:bg-green-950/20' : ''}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 flex-shrink-0 ${selectedTariffId === nextTariff.id ? 'border-green-600' : 'border-muted-foreground'}`}>
                            {selectedTariffId === nextTariff.id && (
                              <div className="w-3 h-3 rounded-full bg-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm mb-1.5">{nextTariff.name}</p>
                            <p className="text-lg font-semibold">{nextTariff.costPerPeriod}₽<span className="text-xs font-normal text-muted-foreground">/мес</span></p>
                          </div>
                        </div>
                        <Badge className="text-white text-xs flex-shrink-0" style={{ backgroundColor: '#a73afd' }}>Расширенный</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            )}
          </RadioGroup>
        ) : (
          currentTariff && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">Текущий</Badge>
                </div>
                <p className="text-sm mb-1">{currentTariff.name}</p>
                <p className="text-lg font-semibold">{currentTariff.costPerPeriod}₽<span className="text-xs font-normal text-muted-foreground">/мес</span></p>
              </CardContent>
            </Card>
          )
        )}
        </div>

        {/* Payment Options Grid */}
        <div>
          <h3 className="text-base font-semibold mb-3">Варианты оплаты</h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {dynamicPaymentOptions.map((option) => (
              <Card
                key={option.id}
                className="border transition-all hover:border-primary hover:shadow-sm"
              >
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-1.5">{option.label}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{option.cost}₽</p>
                      <p className="text-sm text-muted-foreground -mt-0.5">
                        {option.description}
                      </p>
                    </div>
                    <Button size="sm" asChild>
                      <a href={option.url || '#'}>Оплатить</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upgrade notice */}
          {isUpgrade && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Вы переходите на расширенный тариф. Оплата будет рассчитана с учётом оставшегося периода.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 