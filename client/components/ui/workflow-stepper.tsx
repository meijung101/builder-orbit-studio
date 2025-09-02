import * as React from "react";
import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "current" | "pending" | "rejected";
  completedAt?: Date;
  assignee?: string;
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  className?: string;
}

export function WorkflowStepper({ steps, className }: WorkflowStepperProps) {
  return (
    <div className={cn("flow-root", className)}>
      <ul className="-mb-8">
        {steps.map((step, stepIdx) => (
          <li key={step.id}>
            <div className="relative pb-8">
              {stepIdx !== steps.length - 1 ? (
                <span
                  className={cn(
                    "absolute left-4 top-4 -ml-px h-full w-0.5",
                    step.status === "completed" ? "bg-primary" : "bg-gray-200"
                  )}
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                      {
                        "bg-primary text-primary-foreground": step.status === "completed",
                        "bg-primary text-primary-foreground": step.status === "current",
                        "bg-gray-200 text-gray-500": step.status === "pending",
                        "bg-red-500 text-white": step.status === "rejected",
                      }
                    )}
                  >
                    {step.status === "completed" && <Check className="h-5 w-5" />}
                    {step.status === "current" && <Clock className="h-5 w-5" />}
                    {step.status === "rejected" && <AlertCircle className="h-5 w-5" />}
                    {step.status === "pending" && (
                      <span className="text-sm font-medium">{stepIdx + 1}</span>
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      step.status === "current" ? "text-primary" : "text-gray-900"
                    )}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-sm text-gray-500">{step.description}</p>
                    )}
                    {step.assignee && (
                      <p className="text-xs text-gray-400">Assigned to: {step.assignee}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {step.completedAt && (
                      <time dateTime={step.completedAt.toISOString()}>
                        {step.completedAt.toLocaleDateString()}
                      </time>
                    )}
                    {step.status === "current" && (
                      <span className="text-primary font-medium">In Progress</span>
                    )}
                    {step.status === "pending" && (
                      <span className="text-gray-400">Waiting</span>
                    )}
                    {step.status === "rejected" && (
                      <span className="text-red-600 font-medium">Rejected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
