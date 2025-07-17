"use client";

import { ChatProvider } from "./chat-context";

const SurveysLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-100">
        <main className="w-full py-6 px-4">
          <div className="flex gap-4 max-w-[1440px] mx-auto">
            <div className="flex flex-col w-full">{children}</div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
};

export default SurveysLayout;
