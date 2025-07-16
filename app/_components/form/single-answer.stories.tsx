import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SingleAnswer } from "./single-answer";

const meta: Meta<typeof SingleAnswer> = {
  title: "Form/SingleAnswer",
  component: SingleAnswer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["preview", "edit"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { label: "男性", value: "1" },
  { label: "女性", value: "2" },
];

export const Preview: Story = {
  args: {
    type: "preview",
    title: "あなたの性別を教えてください。",
    options: defaultOptions,
  },
  render: (args) => {
    const { control } = useForm({
      defaultValues: {
        question: "1",
      },
    });
    return (
      <div className="w-[600px] p-4 bg-white">
        <SingleAnswer {...args} control={control} questionId="question" />
      </div>
    );
  },
};

export const Edit: Story = {
  args: {
    type: "edit",
    title: "あなたの性別を教えてください。",
    options: defaultOptions,
  },
  render: (args) => {
    const [options, setOptions] = useState(args.options);
    return (
      <div className="w-[800px] bg-white border rounded-lg">
        <SingleAnswer
          {...args}
          options={options}
          onOptionsChange={setOptions}
        />
      </div>
    );
  },
};

export const PreviewWithMultipleOptions: Story = {
  args: {
    type: "preview",
    title: "あなたの年齢層を教えてください。",
    options: [
      { label: "18歳未満", value: "1" },
      { label: "18-24歳", value: "2" },
      { label: "25-34歳", value: "3" },
      { label: "35-44歳", value: "4" },
      { label: "45-54歳", value: "5" },
      { label: "55-64歳", value: "6" },
      { label: "65歳以上", value: "7" },
    ],
  },
  render: (args) => {
    const { control } = useForm({
      defaultValues: {
        ageGroup: "3",
      },
    });
    return (
      <div className="w-[600px] p-4 bg-white">
        <SingleAnswer {...args} control={control} questionId="ageGroup" />
      </div>
    );
  },
};

export const EditWithEmptyOptions: Story = {
  args: {
    type: "edit",
    title: "新しい質問",
    options: [
      { label: "", value: "1" },
      { label: "", value: "2" },
    ],
  },
  render: (args) => {
    const [options, setOptions] = useState(args.options);
    return (
      <div className="w-[800px] bg-white border rounded-lg">
        <SingleAnswer
          {...args}
          options={options}
          onOptionsChange={setOptions}
        />
      </div>
    );
  },
};

export const Interactive: Story = {
  args: {
    type: "edit",
    title: "好きな色を選んでください。",
    options: [
      { label: "赤", value: "1" },
      { label: "青", value: "2" },
      { label: "緑", value: "3" },
      { label: "黄色", value: "4" },
    ],
  },
  render: (args) => {
    const [options, setOptions] = useState(args.options);
    const [currentType, setCurrentType] = useState<"preview" | "edit">(
      args.type,
    );
    const { control } = useForm({
      defaultValues: {
        color: "2",
      },
    });

    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setCurrentType("preview")}
            className={`px-4 py-2 rounded ${
              currentType === "preview"
                ? "bg-[#138FB5] text-white"
                : "bg-gray-200"
            }`}
          >
            Preview Mode
          </button>
          <button
            type="button"
            onClick={() => setCurrentType("edit")}
            className={`px-4 py-2 rounded ${
              currentType === "edit" ? "bg-[#138FB5] text-white" : "bg-gray-200"
            }`}
          >
            Edit Mode
          </button>
        </div>
        <div className="w-[800px] bg-white border rounded-lg">
          <SingleAnswer
            {...args}
            type={currentType}
            options={options}
            onOptionsChange={setOptions}
            control={control}
            questionId="color"
          />
        </div>
      </div>
    );
  },
};
