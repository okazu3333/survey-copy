"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Option = { label: string; value: string };

type SingleAnswerProps = {
  type: "preview" | "edit";
  title: string;
  options: Option[];
  // biome-ignore lint/suspicious/noExplicitAny: <>
  control?: Control<any>;
  questionId?: string;
  onOptionsChange?: (options: Option[]) => void;
};

export const SingleAnswer = ({
  type,
  title,
  options: initialOptions,
  control,
  questionId = "question",
  onOptionsChange,
}: SingleAnswerProps) => {
  const [options, setOptions] = useState(initialOptions);
  const [displayMode, setDisplayMode] = useState<"radio" | "select">("radio");

  const handleOptionChange = (index: number, newLabel: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], label: newLabel };
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const handleAddOption = (afterIndex: number) => {
    const newOptions = [...options];
    const newValue = `${newOptions.length + 1}`;
    newOptions.splice(afterIndex + 1, 0, { label: "", value: newValue });
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Keep at least 2 options
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  return (
    <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
      <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-center relative flex-1 grow">
          <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
            {title}
          </div>
        </div>
        {type === "preview" && (
          <Select
            value={displayMode}
            onValueChange={(value: "radio" | "select") => setDisplayMode(value)}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radio">Radio</SelectItem>
              <SelectItem value="select">Select</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {type === "edit" ? (
        <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <RadioGroup className="w-full flex flex-col gap-2">
            {options.map((option, index) => (
              <div key={`option-${index}`}>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <RadioGroupItem
                      value={option.value}
                      id={`${questionId}-${option.value}`}
                      className="w-4 h-4"
                    />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <Input
                      value={option.label}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                    />
                  </div>

                  <button
                    type="button"
                    className="w-6 h-6 cursor-pointer flex items-center justify-center bg-transparent border-none p-0"
                    onClick={() => handleRemoveOption(index)}
                    aria-label="Remove option"
                  >
                    <X className="w-4 h-4 text-[#556064]" />
                  </button>
                </div>

                {index < options.length - 1 && (
                  <div className="flex flex-col items-center flex-[0_0_auto] relative self-stretch w-full mt-2">
                    <Separator className="h-px relative self-stretch w-full" />
                    <button
                      type="button"
                      className="absolute w-4 h-4 top-[-8px] left-[calc(50%-8px)] cursor-pointer flex items-center justify-center bg-[#979BA2] rounded-full shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)] border-none p-0"
                      onClick={() => handleAddOption(index)}
                      aria-label="Add option"
                    >
                      <Plus className="w-2 h-2 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>
        </div>
      ) : control ? (
        <Controller
          name={questionId}
          control={control}
          render={({ field }) =>
            displayMode === "radio" ? (
              <RadioGroup
                value={field.value as string}
                onValueChange={field.onChange}
                className="flex flex-col items-start gap-2 relative self-stretch w-full"
              >
                {options.map((option, index) => (
                  <div
                    key={option.value}
                    className="flex items-center gap-2 relative self-stretch w-full"
                  >
                    <div className="flex w-10 items-center justify-end relative">
                      <RadioGroupItem
                        value={option.value}
                        id={`${questionId}-${option.value}`}
                        className="relative w-4 h-4"
                      />
                      <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                        <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center leading-6 whitespace-nowrap">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="rounded flex items-center px-2 py-0 relative flex-1 grow">
                      <Label
                        htmlFor={`${questionId}-${option.value}`}
                        className="flex items-start gap-2.5 relative flex-1 grow cursor-pointer"
                      >
                        <div className="flex-1 mt-[-1.00px] font-normal text-[#333333] text-sm leading-6">
                          {option.label}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Select
                value={field.value as string}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
        />
      ) : displayMode === "radio" ? (
        <RadioGroup className="flex flex-col items-start gap-2 relative self-stretch w-full">
          {options.map((option, index) => (
            <div
              key={option.value}
              className="flex items-center gap-2 relative self-stretch w-full"
            >
              <div className="flex w-10 items-center justify-end relative">
                <RadioGroupItem
                  value={option.value}
                  id={`${questionId}-${option.value}`}
                  className="relative w-4 h-4"
                />
                <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                  <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center leading-6 whitespace-nowrap">
                    {index + 1}
                  </div>
                </div>
              </div>
              <div className="rounded flex items-center px-2 py-0 relative flex-1 grow">
                <Label
                  htmlFor={`${questionId}-${option.value}`}
                  className="flex items-start gap-2.5 relative flex-1 grow cursor-pointer"
                >
                  <div className="flex-1 mt-[-1.00px] font-normal text-[#333333] text-sm leading-6">
                    {option.label}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
