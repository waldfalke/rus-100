// Code Contracts: PENDING
// @token-status: COMPLETED (Relies on Select)
"use client";
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AccountSelectorDropdownProps {
  users: { id: string; name: string }[];
  selectedUserId: string | undefined;
  onUserSelect: (userId: string) => void;
  className?: string; // Для дополнительной стилизации
}

export const AccountSelectorDropdown: React.FC<AccountSelectorDropdownProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  className = "",
}) => {
  // Находим имя выбранного пользователя для отображения в триггере
  // const selectedUserName = users.find(user => user.id === selectedUserId)?.name;

  return (
    <Select 
      value={selectedUserId} 
      onValueChange={onUserSelect} // Вызываем callback при изменении
    >
      <SelectTrigger className={`w-[280px] ${className}`}> 
        {/* Отображаем плейсхолдер или имя выбранного пользователя */}
        <SelectValue placeholder="Выберите пользователя..." /> 
      </SelectTrigger>
      <SelectContent>
        {users.map(user => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 