import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";

export const TabsPanelBlock: React.FC = () => (
  <Tabs defaultValue="tasks" className="w-full max-w-full flex flex-col">
    <div className="border-b border-gray-200 sticky top-0 z-30 bg-white shadow-sm overflow-hidden rounded-t-xl">
      <TabsList className="grid w-full grid-cols-3 bg-transparent shadow-none border-0 h-auto p-0 m-0">
        <TabsTrigger value="tasks" className="py-3 px-4 text-gray-500 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-none hover:text-gray-700 transition-colors">По заданиям</TabsTrigger>
        <TabsTrigger value="ege" className="py-3 px-4 text-gray-500 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-none hover:text-gray-700 transition-colors">Формат ЕГЭ</TabsTrigger>
        <TabsTrigger value="exercises" className="py-3 px-4 text-gray-500 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-none hover:text-gray-700 transition-colors">Упражнения</TabsTrigger>
      </TabsList>
    </div>
    <div className="pt-6">
      <TabsContent value="tasks" className="w-full max-w-full mt-0">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">Генерация по заданиям (мок)</div>
      </TabsContent>
      <TabsContent value="ege" className="w-full max-w-full mt-0">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">Формат ЕГЭ (мок)</div>
      </TabsContent>
      <TabsContent value="exercises" className="w-full max-w-full mt-0">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">Упражнения (мок)</div>
      </TabsContent>
    </div>
  </Tabs>
); 