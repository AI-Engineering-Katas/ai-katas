import { ChromaClient, Collection } from 'chromadb';

let client: ChromaClient | null = null;
let collection: Collection | null = null;

export const getChromaClient = () => {
  if (!client) {
    client = new ChromaClient({
      path: process.env.CHROMA_API_URL || 'http://localhost:8000'
    });
  }
  return client;
};

export const getCollection = async () => {
  if (!collection) {
    const client = getChromaClient();
    collection = await client.getOrCreateCollection({
      name: 'building_blocks'
    });
  }
  return collection;
};

export const queryCollection = async (query: string, nResults: number = 3) => {
  const coll = await getCollection();
  const results = await coll.query({
    queryTexts: [query],
    nResults
  });

  return {
    documents: results.documents?.[0] || [],
    metadatas: results.metadatas?.[0] || [],
    ids: results.ids?.[0] || [],
    distances: results.distances?.[0] || []
  };
}; 