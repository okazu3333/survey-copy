import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type SurveyCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary";
};

export const SurveyCard = ({
  children,
  className = "",
  variant = "default",
}: SurveyCardProps) => {
  const variantClasses = {
    default: "bg-bg-card border-border-light",
    primary: "bg-brand-primary text-white",
    secondary: "bg-bg-overlay border-border-light",
  };

  return (
    <Card
      className={`flex flex-col items-start gap-4 p-4 relative self-stretch w-full rounded-lg ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Card>
  );
};
