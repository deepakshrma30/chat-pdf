"use client";
import React, { useState } from "react";

import { Delete, MessageCircle, Plus, Settings, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ChatSchema } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { QueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  chats?: ChatSchema[];
  chatId?: number;
};
const queryClient = new QueryClient();
const ChatSidebar = ({ chatId, chats }: Props) => {
  const router = useRouter();
  const [chats1, setChats1] = useState<ChatSchema[] | undefined>(chats);
  const mutate = useMutation({
    mutationFn: async (id: any) => {
      const data = await axios.delete(`/api/get-chats/${id}`);
      return data.data;
    },
    // onSuccess: () => {
    //   setChats1((prev) => prev?.filter((chat) => chat.id !== id));
    // },
    onSuccess(data, variables, context) {
      setChats1((prev) => prev?.filter((chat) => chat.id !== variables));
    },
  });

  return (
    // <SidebarProvider>
    <Sidebar className="hidden border-r  lg:block ">
      <SidebarHeader className="border-b  px-4 py-2">
        <h2 className="text-lg font-semibold ">Chat History</h2>
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        {chats1?.map((chat) => (
          <>
            <Button
              variant="ghost"
              className={cn("w-full justify-start group", {
                "bg-red-500": chat.id === chatId,
              })}
              key={chat.id}
              onClick={() => router.push(`/chat/${chat.id}`)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span className="flex-1 truncate text-left">{chat.pdfName}</span>
            </Button>
          </>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/")}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only ">New Chat</span>
          </Button>
          {/* <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button> */}
        </div>
      </SidebarFooter>
    </Sidebar>
    // </SidebarProvider>
  );
};

export default ChatSidebar;
