import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const userEnum = pgEnum("userEnum", ["system", "user"]);

export const chats = pgTable("chat", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  // createdAt:timestamp("createdAt").defaultNow().notNull(),
  userId: varchar("user_id", { length: 250 }).notNull(),
  fileKey: text("file_key").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  role: userEnum("role").notNull(),
});

export type ChatSchema = typeof chats.$inferSelect;
