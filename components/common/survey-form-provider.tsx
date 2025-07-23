"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";

type SurveyFormData = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string[];
  q8?: string;
  q9?: string[];
  q10?: string;
  q11?: string;
  q12?: string;
  q13?: string;
  q14?: string;
  q15?: string;
};

type SurveyFormContextType = UseFormReturn<SurveyFormData> & {
  handleCheckboxChange: (
    questionId: keyof SurveyFormData,
    optionId: string,
    checked: boolean,
  ) => void;
};

const SurveyFormContext = createContext<SurveyFormContextType | null>(null);

type SurveyFormProviderProps = {
  children: ReactNode;
  defaultValues?: Partial<SurveyFormData>;
};

export const SurveyFormProvider = ({
  children,
  defaultValues,
}: SurveyFormProviderProps) => {
  const form = useForm<SurveyFormData>({
    defaultValues: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: [],
      q8: "",
      q9: [],
      q10: "",
      q11: "",
      q12: "",
      q13: "",
      q14: "",
      q15: "",
      ...defaultValues,
    },
  });

  const handleCheckboxChange = (
    questionId: keyof SurveyFormData,
    optionId: string,
    checked: boolean,
  ) => {
    const currentValues = (form.getValues(questionId) as string[]) || [];
    let newValues: string[];

    if (checked) {
      newValues = [...currentValues, optionId];
    } else {
      newValues = currentValues.filter((id) => id !== optionId);
    }

    form.setValue(questionId, newValues);
  };

  const contextValue: SurveyFormContextType = {
    ...form,
    handleCheckboxChange,
  };

  return (
    <SurveyFormContext.Provider value={contextValue}>
      {children}
    </SurveyFormContext.Provider>
  );
};

export const useSurveyForm = () => {
  const context = useContext(SurveyFormContext);
  if (!context) {
    throw new Error("useSurveyForm must be used within SurveyFormProvider");
  }
  return context;
};
