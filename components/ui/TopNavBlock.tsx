import { User } from "lucide-react";
import React from "react";

export const TopNavBlock: React.FC = () => (
  <nav className="max-w-6xl bg-[#434343] rounded-2xl flex items-center p-2 mx-auto mt-5 mb-10 relative">
    <span className="text-white text-sm font-medium px-3 py-2">
      Русский<span className="text-teal-400">_100</span>
    </span>
    <div className="hidden lg:flex flex-wrap flex-1 items-center">
      <a href="#" className="text-white text-sm font-medium bg-[#515151] rounded-xl px-4 py-2 mx-1 my-1 text-center hover:bg-[#616161]">Дашборд</a>
      <a href="#" className="text-white text-sm font-medium bg-[#515151] rounded-xl px-4 py-2 mx-1 my-1 text-center hover:bg-[#616161]">Задания</a>
      <a href="#" className="text-white text-sm font-medium bg-[#515151] rounded-xl px-4 py-2 mx-1 my-1 text-center hover:bg-[#616161]">Результаты</a>
    </div>
    <div className="relative ml-auto mx-1 my-1">
      <div className="text-white text-sm font-medium bg-[#515151] rounded-xl px-3 py-2 text-center hover:bg-[#616161] cursor-pointer">
        <User className="inline-block w-5 h-5" />
      </div>
    </div>
  </nav>
); 