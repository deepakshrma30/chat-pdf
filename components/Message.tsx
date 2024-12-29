"use client";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useChat } from "ai/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type props = {
  chatId: number;
};

const Message = ({ chatId }: props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.get(`/api/get-chats/${chatId}`);
      console.log(response, "ressssss");
      return response.data;
    },
    enabled: !!chatId,
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data?._messages || [],
  });

  console.log(data?._messages, "dddkkj");

  return (
    <aside className="w-96 border-l flex max-h-screen flex-col">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-2 max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </aside>
  );
};

export default Message;
