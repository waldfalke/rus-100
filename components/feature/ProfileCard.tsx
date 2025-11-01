// Code Contracts: PENDING
// @token-status: COMPLETED
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from 'lucide-react'; // Используем иконку карандаша
import type { UserProfileData, Tariff } from '../../types/account';

// Выбираем только те поля из UserProfileData, которые нужны этой карточке
interface ProfileCardProps {
  userName: string;
  userEmail: string;
  registrationDate: string;
  currentStudentCount: number;
  currentTariff?: Tariff;
  onEditClick: () => void; // Callback для открытия модалки
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  userEmail,
  registrationDate,
  currentStudentCount,
  currentTariff,
  onEditClick,
}) => {
  const studentLimit = currentTariff?.studentLimit ?? '-'; // Лимит из тарифа или прочерк

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Профиль пользователя</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEditClick}
          aria-label="Редактировать профиль"
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil size={16} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Имя:</p>
            <p className="text-sm font-semibold">{userName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Email владельца:</p>
            <p className="text-sm font-semibold">{userEmail}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Дата регистрации:</p>
            <p className="text-sm font-semibold">{registrationDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Количество учеников:</p>
            <p className="text-sm font-semibold">
              {currentStudentCount} <span className="font-normal text-muted-foreground">/ {studentLimit}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 