// Code Contracts: PENDING
// @token-status: COMPLETED (Relies on Dialog, Button, Input, Label)
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string, newEmail: string) => void;
  initialUserName: string;
  initialUserEmail: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUserName,
  initialUserEmail,
}) => {
  const [userName, setUserName] = useState(initialUserName);
  const [userEmail, setUserEmail] = useState(initialUserEmail);

  // Сбрасываем состояние при изменении initial props (если модалка переиспользуется для разных юзеров)
  useEffect(() => {
    setUserName(initialUserName);
    setUserEmail(initialUserEmail);
  }, [initialUserName, initialUserEmail, isOpen]);

  const handleSaveClick = () => {
    // TODO: Добавить валидацию email?
    onSave(userName, userEmail);
  };

  // Предотвращаем закрытие по клику вне модалки, если нужно
  // const handleInteractOutside = (event: Event) => {
  //   event.preventDefault(); 
  // };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* <DialogTrigger asChild> */} 
        {/* Триггер не нужен, открываем через state */} 
      {/* </DialogTrigger> */}
      <DialogContent 
        className="sm:max-w-[425px]"
        // onInteractOutside={handleInteractOutside} // Раскомментировать, если нужно предотвратить закрытие снаружи
      >
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogDescription>
            Внесите изменения в имя и email пользователя.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Имя
            </Label>
            <Input
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>Отмена</Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveClick}>Сохранить изменения</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 