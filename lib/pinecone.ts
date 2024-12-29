// v1.0.0 initialization
import "dotenv/config";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./db/s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import md5 from "md5";
import { getEmbeddings } from "./embeddings";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";
import { convertToAscii } from "./utils";
console.log(process.env.PINCONE_APIKEY, "api-key");
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_APIKEY!,
});
type PDF = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadIntoPineCone(file_Key: string) {
  console.log("Downloading");
  const fileName = await downloadFromS3(file_Key);
  console.log(fileName,"fileName")
  if (!fileName) {
    throw new Error("Not able to download");
  }
  const sanitizedPath = fileName.replace(/\\/g, '/');
  const loader = new PDFLoader(sanitizedPath);
  console.log(loader.load(),"loaded")
  const pages = (await loader.load()) as PDF[];


  const documents = await Promise.all(
    pages.map((page) => prepareDocuments(page))
  );

  const vectors = (
    await Promise.all(documents.flat().map(embedDocuments))
  ).filter((vector): vector is PineconeRecord => vector !== undefined);
  const pineConeIndex = pinecone.Index("chatpdf");

  console.log("inserting into pinecone");
  const namespace = pineConeIndex.namespace(convertToAscii(file_Key));
  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocuments(docs: Document) {
  try {
    const embedding = await getEmbeddings(docs.pageContent);
    const hash = md5(docs.pageContent);

    return {
      id: hash,
      values: embedding,
      metadata: {
        text: docs.metadata.text,
        pageNumber: docs.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.error(error);
  }
}

export const truncateString = (text: string, byte: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(encoder.encode(text).slice(0, byte));
};

async function prepareDocuments(page: PDF) {
  let { metadata, pageContent } = page;
  pageContent = pageContent.replace(/\n/g, "");

  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateString(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
