import type { ReactNode } from "react";
import { SurveyCardHeader } from "@/components/survey-card-header";

type PageLayoutProps = {
  children: ReactNode;
  title?: string;
  workingTitle?: string;
  currentStep?: number;
  enableDefaultNavigation?: boolean;
  className?: string;
};

export const PageLayout = ({
  children,
  title,
  workingTitle = "",
  currentStep,
  enableDefaultNavigation = false,
  className = "",
}: PageLayoutProps) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {currentStep !== undefined && (
        <SurveyCardHeader
          title={title}
          workingTitle={workingTitle}
          currentStep={currentStep}
          enableDefaultNavigation={enableDefaultNavigation}
        />
      )}
      <div className="flex flex-col w-full items-center gap-6 p-6 bg-bg-overlay rounded-b-lg shadow-main-bg">
        {children}
      </div>
    </div>
  );
};
