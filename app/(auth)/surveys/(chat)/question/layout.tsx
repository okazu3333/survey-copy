import { SurveyCardHeader } from "@/components/survey-card-header";

type QuestionLayoutProps = {
  children: React.ReactNode;
};

const QuestionLayout = ({ children }: QuestionLayoutProps) => {
  return (
    <div className="flex flex-col w-full">
      <SurveyCardHeader
        workingTitle="00008　男性化粧品についての調査"
        currentStep={2}
      />
      {children}
    </div>
  );
};

export default QuestionLayout;
