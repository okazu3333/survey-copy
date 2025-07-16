import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumberInput } from "./number-input";

const meta: Meta<typeof NumberInput> = {
  title: "Form/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["preview", "edit"],
    },
    min: {
      control: "number",
    },
    max: {
      control: "number",
    },
    step: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Preview: Story = {
  args: {
    type: "preview",
    title: "あなたの年齢を教えてください。",
    suffix: "歳",
    defaultValue: 25,
  },
  render: (args) => {
    const { control } = useForm({
      defaultValues: {
        age: 25,
      },
    });
    return (
      <div className="w-[600px] p-4 bg-white">
        <NumberInput {...args} control={control} questionId="age" />
      </div>
    );
  },
};

export const Edit: Story = {
  args: {
    type: "edit",
    title: "あなたの年齢を教えてください。",
    suffix: "歳",
    min: 0,
    max: 120,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>();
    return (
      <div className="w-[600px] p-4 bg-white">
        <NumberInput {...args} onChange={setValue} />
        <div className="mt-4 text-sm text-gray-600">
          Current value: {value !== undefined ? value : "未入力"}
        </div>
      </div>
    );
  },
};

export const MonthlySpending: Story = {
  args: {
    type: "preview",
    title: "化粧品に月にどの程度の金額を使いますか？",
    suffix: "円",
    step: 100,
    defaultValue: 5000,
  },
  render: (args) => {
    const { control } = useForm({
      defaultValues: {
        spending: 5000,
      },
    });
    return (
      <div className="w-[600px] p-4 bg-white">
        <NumberInput {...args} control={control} questionId="spending" />
      </div>
    );
  },
};

export const HeightMeasurement: Story = {
  args: {
    type: "preview",
    title: "あなたの身長を教えてください。",
    suffix: "cm",
    min: 100,
    max: 250,
    step: 0.1,
    defaultValue: 170.5,
  },
  render: (args) => {
    const { control } = useForm({
      defaultValues: {
        height: 170.5,
      },
    });
    return (
      <div className="w-[600px] p-4 bg-white">
        <NumberInput {...args} control={control} questionId="height" />
      </div>
    );
  },
};

export const WithoutSuffix: Story = {
  args: {
    type: "preview",
    title: "家族の人数を教えてください。",
    min: 1,
    max: 20,
    defaultValue: 4,
  },
  render: (args) => {
    const { control } = useForm({
      defaultValues: {
        familySize: 4,
      },
    });
    return (
      <div className="w-[600px] p-4 bg-white">
        <NumberInput {...args} control={control} questionId="familySize" />
      </div>
    );
  },
};

export const Interactive: Story = {
  args: {
    type: "edit",
    title: "商品の満足度を100点満点で評価してください。",
    suffix: "点",
    min: 0,
    max: 100,
    step: 5,
  },
  render: (args) => {
    const [currentType, setCurrentType] = useState<"preview" | "edit">(
      args.type,
    );
    const [value, setValue] = useState<number | undefined>(75);
    const { control } = useForm({
      defaultValues: {
        satisfaction: 75,
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
        <div className="w-[600px] p-4 bg-white border rounded-lg">
          <NumberInput
            {...args}
            type={currentType}
            defaultValue={value}
            onChange={setValue}
            control={control}
            questionId="satisfaction"
          />
        </div>
        <div className="text-sm text-gray-600">
          Current value: {value !== undefined ? `${value}点` : "未入力"}
        </div>
      </div>
    );
  },
};
