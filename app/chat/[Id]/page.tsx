import React from "react";
import ChatSidebar from "@/components/chatSidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import Message from "@/components/Message";
import PDFViewer from "@/components/pdfViewer";
type Props = {
  params: {
    Id: string;
  };
};
const Page = async ({ params: { Id } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === Number(Id))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === Number(Id));

  return (
    <SidebarProvider>
      <ChatSidebar chats={_chats} chatId={Number(Id)} />

      <SidebarInset className="max-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>

        <div className="flex h-[calc(100vh-4rem)]">
          <div className="flex flex-1   flex-col gap-4 p-4 ">
            <div className="flex flex-1 overflow-y-auto  p-2 ">
              <PDFViewer
                pdf_url={
                  currentChat?.pdfUrl ||
                  "https://icseindia.org/document/sample.pdf"
                }
              />
            </div>
          </div>
          <Message chatId={Number(Id)} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;
