import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Typography",
};
export default meta;

type Story = StoryObj;

export const BasicTypography: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: "600px" }}>
      {/* Заголовки */}
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Заголовки:</h3>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-800">Заголовок 1 (32px, bold)</div>
          <div className="text-xl font-semibold text-gray-800">Заголовок 2 (24px, semibold)</div>
          <div className="text-lg font-medium text-gray-800">Заголовок 3 (18px, medium)</div>
        </div>
      </div>

      {/* Основной текст */}
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Основной текст:</h3>
        <div className="space-y-2">
          <div className="text-base text-gray-800">Обычный текст (16px)</div>
          <div className="text-base text-gray-600">Обычный текст приглушенный (16px, gray)</div>
          <div className="text-sm text-gray-800">Small text (14px)</div>
          <div className="text-sm text-gray-600">Small text приглушенный (14px, gray)</div>
          <div className="text-xs text-gray-600">Extra small text (12px)</div>
        </div>
      </div>

      {/* Интерактивные элементы */}
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Интерактивные элементы:</h3>
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Label текст (14px, medium)</div>
          <div className="text-sm font-semibold text-teal-600">Акцентный текст (14px, semibold, teal)</div>
          <div className="text-sm font-medium text-white bg-[#515151] rounded-xl px-4 py-2 inline-block">Текст кнопки (14px, medium)</div>
        </div>
      </div>

      {/* Утилитарные стили */}
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Утилитарные стили:</h3>
        <div className="space-y-2">
          <div className="text-sm font-semibold leading-5 tabular-nums">Текст счетчика (14px, semibold, tabular)</div>
          <div className="text-xs text-gray-400 italic">Вспомогательный текст (12px, italic)</div>
          <div className="text-sm text-red-500">Текст ошибки (14px, red)</div>
          <div className="text-sm font-medium text-teal-600">Текст успеха (14px, medium, teal)</div>
        </div>
      </div>

      {/* Комбинации с отступами и выравниванием */}
      <div>
        <h3 className="text-sm text-gray-600 mb-2">Комбинации с отступами и выравниванием:</h3>
        <div className="space-y-2">
          <div className="text-sm font-medium mb-1 block">Label с отступом снизу</div>
          <div className="text-sm text-center">Центрированный текст</div>
          <div className="text-sm text-right">Выравнивание справа</div>
          <div className="text-sm px-3 py-2 bg-gray-50">Текст с паддингами</div>
        </div>
      </div>
    </div>
  ),
}; 