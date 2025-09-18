// Code Contracts: PENDING
// @token-status: NA (Legacy/Unused?)
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import React from "react";

interface TestFormBlockProps {
  testName: string;
  onTestNameChange: (v: string) => void;
  testGroup: string | undefined;
  onTestGroupChange: (v: string) => void;
  account: string | undefined;
  onAccountChange: (v: string) => void;
}

export const TestFormBlock: React.FC<TestFormBlockProps> = ({
  testName,
  onTestNameChange,
  testGroup,
  onTestGroupChange,
  account,
  onAccountChange,
}) => (
  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="test-name" className="block text-sm font-medium text-gray-700 mb-1">
            Название теста <span className="text-red-500">*</span>
          </label>
          <Input
            id="test-name"
            value={testName}
            onChange={(e) => onTestNameChange(e.target.value)}
            placeholder="Введите название теста"
            className="w-full"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="test-group" className="block text-sm font-medium text-gray-700 mb-1">
            Группа тестов
          </label>
          <div className="flex items-center gap-2">
            <Select value={testGroup} onValueChange={onTestGroupChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Выберите --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Тесты-25</SelectItem>
                <SelectItem value="4">Пунктуация</SelectItem>
                <SelectItem value="5">Пунктуация. Контроль.</SelectItem>
                <SelectItem value="6">Чекапы</SelectItem>
                <SelectItem value="7">Сочинение</SelectItem>
                <SelectItem value="8">Сочинение. Контроль.</SelectItem>
                <SelectItem value="9">Грамматика</SelectItem>
                <SelectItem value="10">Грамматика контроль</SelectItem>
                <SelectItem value="29">Сгенерированные тесты</SelectItem>
                <SelectItem value="60">ЕГКР (от ФИПИ)</SelectItem>
                <SelectItem value="127">Орфография</SelectItem>
                <SelectItem value="128">Орфография. Контроль</SelectItem>
                <SelectItem value="255">Орфография (тексты с пропущенными буквами)</SelectItem>
                <SelectItem value="333">Речь</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <FolderPlus className="h-5 w-5 text-teal-600" />
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="account-select" className="block text-sm font-medium text-gray-700 mb-1">
            Аккаунт
          </label>
          <Select value={account} onValueChange={onAccountChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Выберите аккаунт --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Аккаунт 1</SelectItem>
              <SelectItem value="2">Аккаунт 2</SelectItem>
              <SelectItem value="3">Аккаунт 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
); 