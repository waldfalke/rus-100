// Code Contracts: PENDING
// @token-status: COMPLETED
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tariff, PaymentOption } from '../../types/account';
import Link from 'next/link';

interface TariffPaymentCardProps {
  paidUntilDate: string;
  currentTariff?: Tariff;
  nextTariff?: Tariff;
  paymentOptions: PaymentOption[];
  // TODO: Add isAdmin prop if admin view needs different payment options display
}

export const TariffPaymentCard: React.FC<TariffPaymentCardProps> = ({
  paidUntilDate,
  currentTariff,
  nextTariff,
  paymentOptions,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Тариф и оплата</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Оплачено до */}
        <div>
          <p className="text-sm text-muted-foreground">Оплачено до:</p>
          <p className="font-semibold">{paidUntilDate}</p>
        </div>

        {/* Текущий тариф */}
        {currentTariff && (
          <div>
            <p className="text-sm text-muted-foreground">Текущий тариф:</p>
            <p>
              {currentTariff.name}{' '}
              {currentTariff.periodDescription && (
                <span className="text-foreground">{currentTariff.periodDescription}</span>
              )}
            </p>
          </div>
        )}

        {/* Следующий тариф */}
        {nextTariff && (
          <div>
            <p className="text-sm text-muted-foreground">Следующий тариф:</p>
            <p>
              {nextTariff.name}{' '}
              {nextTariff.periodDescription && (
                <span className="text-foreground">{nextTariff.periodDescription}</span>
              )}
            </p>
          </div>
        )}

        {/* Опции оплаты */}
        {paymentOptions.length > 0 && (
          <div className="space-y-2 pt-2">
            {paymentOptions.map((option) => (
              <Button
                key={option.id}
                variant="link"
                asChild
                className="p-0 h-auto text-primary hover:text-primary/90 hover:underline text-left justify-start block"
              >
                <Link href={option.url || '#'}>
                  {option.label}, стоимость {option.cost}р.
                </Link>
              </Button>
            ))}
          </div>
        )}
        {/* TODO: Render admin-specific payment controls if needed */}
      </CardContent>
    </Card>
  );
}; 