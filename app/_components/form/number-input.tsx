"use client";

import { useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";

type NumberInputProps = {
  type: "preview" | "edit";
  title: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  control?: Control<any>;
  questionId?: string;
  onChange?: (value: number | undefined) => void;
};

export const NumberInput = ({
  type,
  title,
  suffix,
  min,
  max,
  step = 1,
  defaultValue,
  control,
  questionId = "number",
  onChange,
}: NumberInputProps) => {
  const [value, setValue] = useState<number | undefined>(defaultValue);

  const handleValueChange = (newValue: string) => {
    const numValue = newValue === "" ? undefined : Number(newValue);
    setValue(numValue);
    onChange?.(numValue);
  };

  return (
    <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
      <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-center relative flex-1 grow">
          <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
            {title}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start relative self-stretch w-full">
        <div className="flex items-center gap-2 relative self-stretch w-full">
          <div className="flex w-10 items-center justify-end relative">
            <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center leading-6 whitespace-nowrap">
                1
              </div>
            </div>
          </div>

          <div className="gap-2 flex items-center px-2 py-0 relative flex-1 grow">
            {control ? (
              <Controller
                name={questionId}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    className="relative w-[104px] h-6 rounded border border-solid border-[#dcdcdc] text-sm"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (type === "edit") {
                        handleValueChange(e.target.value);
                      }
                    }}
                  />
                )}
              />
            ) : (
              <Input
                type="number"
                value={value ?? ""}
                onChange={(e) => handleValueChange(e.target.value)}
                min={min}
                max={max}
                step={step}
                className="relative w-[104px] h-6 rounded border border-solid border-[#dcdcdc] text-sm"
              />
            )}

            {suffix && (
              <div className="w-fit mt-[-1.00px] font-normal text-[#333333] text-xs whitespace-nowrap leading-6">
                {suffix}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
