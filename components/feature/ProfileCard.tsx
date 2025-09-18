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
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Имя:</p>
          <p className="font-medium">{userName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email владельца:</p>
          <p className="font-medium">{userEmail}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Дата регистрации:</p>
          <p className="text-app-small leading-normal">{registrationDate}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Количество учеников:</p>
          <p>
            <span className="text-app-body font-semibold">{currentStudentCount}</span>
            <span className="text-sm text-muted-foreground"> / {studentLimit}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 