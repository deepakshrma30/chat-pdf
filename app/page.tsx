import FileUpload from "@/components/fileUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { ArrowRight, BookOpen, LogIn, Upload } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gray-300" />
            <span className="text-lg font-semibold text-white">PDF Chat</span>
          </div>
          <UserButton />
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <BookOpen className="w-8 h-8 text-gray-300" />
              Chat with Your PDF Anytime
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-lg text-gray-300">
              Join millions of students, researchers and professionals to
              instantly answer questions and understand research with AI
            </p>
            {isAuth && firstChat ? (
              <div className="space-y-4">
                <FileUpload />

                <Link href={`/chat/${firstChat.id}`}>
                  <Button className="mt-4">
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            ) : isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button
                  className=" text-lg mt-4 bg-white hover:bg-gray-200 text-gray-900"
                  size="lg"
                >
                  Login to get Started! <LogIn className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
