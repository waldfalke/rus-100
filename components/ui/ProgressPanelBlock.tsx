// Code Contracts: COMPLETED
// @token-status: COMPLETED (Using tokens via component-overrides.css)
import { Progress } from "@/components/ui/progress";
import React from "react";
import { cn } from "@/lib/utils";

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
  <div className="fixed bottom-0 left-0 right-0 progress-panel-block py-3 px-4 z-50">
    <div className="container max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm sm:text-base font-normal text-muted-foreground">Выбрано заданий:</span>
          <span className="text-sm sm:text-base font-semibold text-primary">
            {totalSelected} / {totalLimit}
          </span>
        </div>
        <div className="w-full sm:w-1/3 flex-grow">
          <Progress value={progress} className="h-2" />
        </div>
        <button
          className={cn(
            "w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90",
            "px-8 font-medium rounded-md py-2 text-sm sm:text-base"
          )}
          onClick={onCreate}
        >
          {buttonText}
        </button>
      </div>
    </div>
  </div>
);