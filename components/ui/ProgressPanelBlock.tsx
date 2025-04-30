import { Progress } from "@/components/ui/progress";
import React from "react";

interface ProgressPanelBlockProps {
  totalSelected: number;
  totalLimit: number;
  progress: number;
  buttonText: string;
  onCreate: () => void;
}

export const ProgressPanelBlock: React.FC<ProgressPanelBlockProps> = ({
  totalSelected,
  totalLimit,
  progress,
  buttonText,
  onCreate,
}) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-3 px-4 z-50">
    <div className="container max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-700">Выбрано заданий:</span>
          <span className="text-lg font-bold text-teal-600">
            {totalSelected} / {totalLimit}
          </span>
        </div>
        <div className="w-full sm:w-1/3 flex-grow">
          <Progress value={progress} className="h-2" />
        </div>
        <button
          className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 font-medium rounded-md py-2"
          style={{ opacity: 1 }}
          onClick={onCreate}
        >
          {buttonText}
        </button>
      </div>
    </div>
  </div>
); 