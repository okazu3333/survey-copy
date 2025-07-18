import { AnimatePresence, motion } from "framer-motion";
import { Maximize, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SurveyContent } from "./survey-content";

type QuestionFormData = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string[];
};

export const LogicCheckSection = () => {
  const router = useRouter();
  const { handleSubmit } = useForm<QuestionFormData>({
    defaultValues: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: [],
    },
  });

  const onSubmit = (data: QuestionFormData) => {
    console.log("Form submitted:", data);
  };

  const handleGoToReview = () => {
    router.push("/surveys/review/preview");
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col items-start relative self-stretch w-full">
      <div className="flex items-center justify-between w-full">
        <div></div>
        <Button
          onClick={handleGoToReview}
          className="h-10 px-8 py-2 bg-[#556064] text-white hover:bg-[#4B5563] font-medium text-base"
        >
          レビューへ進む
        </Button>
      </div>
      <motion.div
        layoutId="survey-card"
        className="flex flex-col items-start relative self-stretch w-full"
      >
        <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full bg-[#138FB5] rounded-lg">
          {/* Maximize Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10 transition-colors"
          >
            <Maximize size={16} className="text-[#138FB5]" />
          </button>

          <ScrollArea className="w-full ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-start gap-4 relative"
            >
              <SurveyContent />
            </form>
          </ScrollArea>
        </Card>
      </motion.div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              layoutId="survey-card"
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Expanded Content */}
              <div className="overflow-auto max-h-[calc(100vh-200px)]">
                <div className="p-6">
                  <SurveyContent />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
