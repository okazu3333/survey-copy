import { useForm } from "react-hook-form";

type QuestionFormData = {
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

export const useSurveyForm = (defaultValues?: Partial<QuestionFormData>) => {
  const form = useForm<QuestionFormData>({
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
    questionId: keyof QuestionFormData,
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

  return {
    ...form,
    handleCheckboxChange,
  };
};
