import { db } from "@/lib/db";
import { deleteFromS3 } from "@/lib/db/s3";
import { chats, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, Number(id)));
  console.log(_messages, "history");

  if (!id) {
    return NextResponse.json({ error: "ID not provided" }, { status: 400 });
  }

  return NextResponse.json({ _messages });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID not provided" }, { status: 400 });
  }

  try {
    const fileKey = await db
      .select({
        fileKey: chats.fileKey,
      })
      .from(chats)
      .where(eq(chats.id, Number(id)));
    if (fileKey) {
      const deletedMessage = await db
        .delete(messages)
        .where(eq(messages.chatId, Number(id)));
      await deleteFromS3(fileKey?.[0]?.fileKey);
      console.log(deletedMessage, "Deletee");
      console.log(deletedMessage, "Deletee");
      const deletedChat = await db
        .delete(chats)
        .where(eq(chats.id, Number(id)));
      return NextResponse.json({
        message: "Messages deleted successfully",
        deletedMessage,
      });
    }
    return NextResponse.json(
      {
        message: "Unable to delete",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting messages:", error);
    return NextResponse.json(
      { error: "Failed to delete messages" },
      { status: 500 }
    );
  }
}
