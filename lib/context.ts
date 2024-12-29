import "dotenv/config";

import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

type MetaData = {
  text: string;
  pageNumber: number;
};
export async function getMatchingEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_APIKEY!,
  });

  const index = await pinecone.Index("chatpdf");

  try {
    const nameSpace = index.namespace(convertToAscii(fileKey));
    const qryResult = await nameSpace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return qryResult.matches || [];
  } catch (error) {
    console.log(error);
  }
}

export async function getMatches(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchingEmbeddings(queryEmbeddings || [], fileKey);

  const requiredDocs = matches?.filter(
    (match) => match.score && match.score > 0.7
  );
  const docs = requiredDocs?.map((item) => (item.metadata as MetaData).text);

  return docs?.join("\n").substring(0, 2500);
}
