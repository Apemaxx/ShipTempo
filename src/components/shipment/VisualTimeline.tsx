import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ShipmentStatus =
  | "quote"
  | "booking"
  | "documentation"
  | "customs"
  | "in-transit"
  | "delivered";

export interface TimelineStage {
  id: ShipmentStatus;
  label: string;
  completed: boolean;
  current: boolean;
  estimatedDate?: string;
  completedDate?: string;
}

export interface VisualTimelineProps {
  stages?: TimelineStage[];
  currentStage?: ShipmentStatus;
}

const defaultStages: TimelineStage[] = [
  {
    id: "quote",
    label: "Quote",
    completed: true,
    current: false,
    completedDate: "Mar 15, 2023",
    estimatedDate: "Mar 15, 2023",
  },
  {
    id: "booking",
    label: "Booking",
    completed: true,
    current: false,
    completedDate: "Mar 20, 2023",
    estimatedDate: "Mar 22, 2023",
  },
  {
    id: "documentation",
    label: "Documentation",
    completed: false,
    current: true,
    estimatedDate: "Apr 5, 2023",
  },
  {
    id: "customs",
    label: "Customs",
    completed: false,
    current: false,
    estimatedDate: "Apr 12, 2023",
  },
  {
    id: "in-transit",
    label: "In Transit",
    completed: false,
    current: false,
    estimatedDate: "Apr 15, 2023",
  },
  {
    id: "delivered",
    label: "Delivered",
    completed: false,
    current: false,
    estimatedDate: "Apr 30, 2023",
  },
];

const VisualTimeline = ({
  stages = defaultStages,
  currentStage = "documentation",
}: VisualTimelineProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Shipment Timeline
        </h3>

        <div className="relative">
          {/* Timeline track */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>

          {/* Timeline stages */}
          <div className="relative flex justify-between z-10">
            {stages.map((stage, index) => (
              <TooltipProvider key={stage.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      {/* Stage icon */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          stage.completed
                            ? "bg-green-100"
                            : stage.current
                              ? "bg-blue-100"
                              : "bg-gray-100",
                        )}
                      >
                        {stage.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Circle
                            className={cn(
                              "h-6 w-6",
                              stage.current ? "text-blue-600" : "text-gray-400",
                            )}
                          />
                        )}
                      </div>

                      {/* Stage label */}
                      <span
                        className={cn(
                          "mt-2 text-sm font-medium",
                          stage.completed
                            ? "text-green-600"
                            : stage.current
                              ? "text-blue-600"
                              : "text-gray-500",
                        )}
                      >
                        {stage.label}
                      </span>

                      {/* Date display */}
                      <span className="text-xs text-gray-500 mt-1">
                        {stage.completed
                          ? `Completed: ${stage.completedDate}`
                          : `Est: ${stage.estimatedDate}`}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="p-1">
                      <p className="font-medium">{stage.label}</p>
                      {stage.completed ? (
                        <p className="text-xs text-green-600">
                          Completed on {stage.completedDate}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Estimated: {stage.estimatedDate}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="absolute top-5 left-0 h-1 bg-green-500 z-0"
            style={{
              width: `${calculateProgress(stages)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate progress percentage
const calculateProgress = (stages: TimelineStage[]) => {
  if (stages.length === 0) return 0;

  const completedStages = stages.filter((stage) => stage.completed).length;
  const currentStageIndex = stages.findIndex((stage) => stage.current);

  // If there's a current stage, add half a stage worth of progress
  const progress =
    currentStageIndex >= 0
      ? ((completedStages + 0.5) / stages.length) * 100
      : (completedStages / stages.length) * 100;

  return Math.min(progress, 100);
};

export default VisualTimeline;
