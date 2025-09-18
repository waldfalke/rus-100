'use client'; // Добавляем директиву для использования useState

import React, { useState, useEffect } from 'react';
import type { UserProfileData } from '../../types/account';
import { ProfileCard } from '@/components/feature/ProfileCard';
import { TariffPaymentCard } from '@/components/feature/TariffPaymentCard';
import { EditProfileModal } from '@/components/feature/EditProfileModal'; // Импортируем модальное окно
import { AccountSelectorDropdown } from '@/components/feature/AccountSelectorDropdown'; // Импорт дропдауна
import { mockUserData, mockAdminViewingUserData, mockAdminOwnData } from '@/data/mockAccountData'; // Импорт mock данных
import { TopNavBlock } from "@/components/ui/TopNavBlock"; // Импорт хедера
import { BreadcrumbsBlock } from "@/components/ui/BreadcrumbsBlock"; // Импорт хлебных крошек
// Импорты для других компонентов (AccountSelectorDropdown) будут добавлены позже

// Define NavLink type mirroring the one in TopNavBlock
interface NavLink {
  label: string;
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  hidden?: 'lg' | 'always';
}

export default function Page() {
  // Состояния компонента
  const [isMounted, setIsMounted] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  // Эффект для монтирования и загрузки данных
  useEffect(() => {
    setIsMounted(true);
    
    // Имитация загрузки данных профиля
    const timer = setTimeout(() => {
      setProfileData(mockUserData);
      console.log("AccountPage: Mock data loaded.");
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Эффект для обновления selectedUserId при изменении profileData
  useEffect(() => {
    if (profileData?.isCurrentUserAdmin && profileData?.isAdminView && profileData?.selectedUserId) {
      setSelectedUserId(profileData.selectedUserId);
    } else if (!profileData?.isAdminView) {
      setSelectedUserId(undefined);
    }
  }, [profileData]);

  // Обработчик выбора пользователя админом
  const handleUserSelect = (userId: string) => {
    console.log("Admin selected user:", userId);
    setSelectedUserId(userId);
    
    // Имитация загрузки данных выбранного пользователя
    let newProfileData: UserProfileData;
    if (userId === 'user-123') {
      newProfileData = mockAdminViewingUserData;
    } else if (userId === 'user-456') {
      newProfileData = { 
        ...mockAdminViewingUserData,
        profileUserId: 'user-456',
        profileUserName: 'Иван Петрович Б', 
        profileUserEmail: 'ivan@example.com',
        currentStudentCount: 5,
        selectedUserId: userId,
      };
    } else if (userId === 'user-789') {
      newProfileData = { 
        ...mockAdminViewingUserData,
        profileUserId: 'user-789',
        profileUserName: 'Ольга Васильевна В', 
        profileUserEmail: 'olga@example.com',
        currentStudentCount: 25,
        currentTariff: {
          id: 'advanced',
          name: 'от 16 до 30 учеников',
          costPerPeriod: 3500,
          periodDescription: 'за 3500р.',
          studentLimit: 30,
        },
        paymentOptions: [],
        selectedUserId: userId,
      };
    } else if (userId === 'admin-001') {
      newProfileData = mockAdminOwnData;
    } else {
      newProfileData = mockAdminViewingUserData; 
    }
    setProfileData(newProfileData);
  };

  // Открытие модального окна редактирования
  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  // Сохранение данных профиля
  const handleSaveProfile = (updatedName: string, updatedEmail: string) => {
    setProfileData(prevData => {
      if (!prevData) {
        console.error("handleSaveProfile called when prevData is undefined");
        return undefined;
      }
      return {
        ...prevData,
        profileUserName: updatedName,
        profileUserEmail: updatedEmail,
      }
    });
    setIsModalOpen(false);
    console.log('Profile updated (mock):', { updatedName, updatedEmail });
  };

  // Если компонент еще не смонтирован
  if (!isMounted) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[300px]">
        <p>Загрузка страницы...</p>
      </div>
    );
  }

  // Если данные еще не загружены
  if (!profileData) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[300px]">
        <p>Загрузка данных профиля...</p>
      </div>
    );
  }

  // Определяем заголовок и хлебные крошки
  const pageTitle = profileData.isAdminView ? 'Профили пользователей' : 'Мой профиль';
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: pageTitle }
  ];

  // Define navLinks for TopNavBlock
  const navLinks: NavLink[] = [
    // { label: "Главная", href: "/" }, // Logo links to main page
    { label: "Дашборд", href: "/dashboard" },
    { label: "Задания", href: "/tasks" },
    { label: "Результаты", href: "/results" },
    { label: "Тесты", href: "/tests" },
    { label: "Демо", href: "/demo" },
  ];

  // Define a handler for the user icon click (optional, can be null)
  const handleUserIconClick = () => {
    console.log("User icon clicked");
    // Implement navigation to profile or dropdown logic here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBlock 
        userName={profileData.profileUserName || null} // Pass userName from profileData
        userEmail={profileData.profileUserEmail || null} // Pass userEmail from profileData
        navLinks={navLinks} // Pass defined navLinks
        onUserClick={handleUserIconClick} // Pass the click handler (or null if not interactive)
      />
      <main className="flex-grow">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <BreadcrumbsBlock items={breadcrumbItems} />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-source-serif-pro text-2xl font-bold">{pageTitle}</h1>
            {profileData.isCurrentUserAdmin && profileData.isAdminView && profileData.availableUsers && profileData.availableUsers.length > 0 && (
              <AccountSelectorDropdown 
                users={profileData.availableUsers}
                selectedUserId={selectedUserId}
                onUserSelect={handleUserSelect}
                className="w-auto min-w-[200px]"
              />
            )}
          </div>

          <div className="space-y-6">
            <ProfileCard
              userName={profileData.profileUserName}
              userEmail={profileData.profileUserEmail}
              registrationDate={profileData.registrationDate}
              currentStudentCount={profileData.currentStudentCount}
              currentTariff={profileData.currentTariff}
              onEditClick={handleEditClick}
            />

            <TariffPaymentCard
              paidUntilDate={profileData.paidUntilDate}
              currentTariff={profileData.currentTariff}
              nextTariff={profileData.nextTariff}
              paymentOptions={profileData.paymentOptions}
            />

            <EditProfileModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveProfile}
              initialUserName={profileData.profileUserName}
              initialUserEmail={profileData.profileUserEmail}
            />
          </div>
        </div>
      </main>
    </div>
  );
}