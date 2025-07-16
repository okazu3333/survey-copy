"use client";

import { usePathname } from "next/navigation";
import { createContext, type ReactNode, useContext, useState } from "react";

type ChatState = {
  [path: string]: boolean;
};

type ChatContextType = {
  isChatCollapsed: boolean;
  setIsChatCollapsed: (collapsed: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

type ChatProviderProps = {
  children: ReactNode;
};

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const pathname = usePathname();
  const [chatStates, setChatStates] = useState<ChatState>({});

  const isChatCollapsed = chatStates[pathname] ?? false;

  const setIsChatCollapsed = (collapsed: boolean) => {
    setChatStates((prev) => ({
      ...prev,
      [pathname]: collapsed,
    }));
  };

  return (
    <ChatContext.Provider value={{ isChatCollapsed, setIsChatCollapsed }}>
      {children}
    </ChatContext.Provider>
  );
};
