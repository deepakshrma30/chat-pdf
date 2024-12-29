import { db } from "@/lib/db";
import { getS3Url } from "@/lib/db/s3";

import { chats } from "@/lib/db/schema";
import { loadIntoPineCone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json(); // Parse the JSON body
    console.log(body, "body");
    await loadIntoPineCone(body.file_key);

    const chatId = await db
      .insert(chats)
      .values({
        fileKey: body.file_key,
        pdfUrl: getS3Url(body.file_key),
        pdfName: body.fileName,
        userId: userId,
        // createdAt:Date.now()
      })
      .returning({
        chat_id: chats.id,
      });
    return NextResponse.json(
      {
        messages: "Success",
        chatId: chatId[0]?.chat_id,
        status: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      messages: "Request failed",
      status: 500,
    });
  }
}
