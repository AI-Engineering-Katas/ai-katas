const CHROMA_API_URL = process.env.CHROMA_API_URL || 'http://localhost:8000';
const COLLECTION_NAME = 'building_blocks';

interface ChromaQueryResponse {
  ids: string[][];
  embeddings: number[][] | null;
  documents: (string | null)[][];
  metadatas: (Record<string, any> | null)[][];
  distances: number[][];
}

interface OpenAIEmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
    object: string;
  }>;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

async function getEmbedding(text: string): Promise<number[]> {
  console.log('Getting embedding for text:', text.substring(0, 50) + '...');
  
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text
      })
    });

    console.log('OpenAI API response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      console.error('OpenAI API error details:', error);
      throw new Error(`OpenAI embeddings API error: ${error.error?.message || response.statusText}`);
    }

    const result: OpenAIEmbeddingResponse = await response.json();
    console.log('Successfully got embedding, dimensions:', result.data[0].embedding.length);
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error in getEmbedding:', error);
    throw error;
  }
}

async function createCollection() {
  console.log('Creating collection:', COLLECTION_NAME);
  try {
    const response = await fetch(`${CHROMA_API_URL}/api/v2/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: COLLECTION_NAME,
        metadata: {
          description: 'Collection for building blocks of knowledge'
        }
      })
    });

    console.log('Create collection response status:', response.status);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error creating collection:', responseText);
      throw new Error(`Failed to create collection: ${responseText}`);
    }

    const result = await response.json();
    console.log('Collection created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
}

async function checkCollection() {
  console.log('Checking collection status...');
  try {
    const response = await fetch(`${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Collection check response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Collection does not exist, creating it...');
        return await createCollection();
      }
      const responseText = await response.text();
      console.error('Error checking collection:', responseText);
      throw new Error(`Failed to check collection: ${responseText}`);
    }

    const result = await response.json();
    console.log('Collection details:', result);
    return result;
  } catch (error) {
    console.error('Error checking collection:', error);
    throw error;
  }
}

export async function addDocuments(documents: string[], metadatas: Record<string, any>[]) {
  console.log('Adding documents to collection:', documents.length);
  
  try {
    // First ensure collection exists
    await checkCollection();
    
    // Get embeddings for all documents
    const embeddings = await Promise.all(documents.map(doc => getEmbedding(doc)));
    
    // Generate unique IDs for documents
    const ids = documents.map((_, i) => `doc_${Date.now()}_${i}`);
    
    const requestBody = {
      ids,
      embeddings,
      documents,
      metadatas
    };
    
    console.log('Sending add request to ChromaDB...');
    const response = await fetch(`${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Add documents response status:', response.status);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('ChromaDB error response:', responseText);
      throw new Error(`Failed to add documents: ${responseText}`);
    }

    const result = await response.json();
    console.log('Successfully added documents to collection');
    return result;
  } catch (error) {
    console.error('Error adding documents:', error);
    throw error;
  }
}

export async function queryCollection(query: string, nResults: number = 3) {
  // First check if collection exists
  await checkCollection();
  
  console.log('Querying collection with:', query);
  console.log('ChromaDB URL:', CHROMA_API_URL);
  
  try {
    // Get embedding for the query
    const queryEmbedding = await getEmbedding(query);
    
    const requestBody = {
      query_embeddings: [queryEmbedding],
      n_results: nResults,
      include: ["documents", "metadatas", "distances"]
    };
    
    console.log('Sending request to ChromaDB with body:', JSON.stringify(requestBody).substring(0, 100) + '...');

    // Query ChromaDB using the embedding
    const response = await fetch(`${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('ChromaDB response status:', response.status);
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error('ChromaDB error response:', responseText);
      const error = JSON.parse(responseText).catch(() => ({ error: responseText }));
      throw new Error(`ChromaDB API error: ${error.error || responseText}`);
    }

    const result: ChromaQueryResponse = await response.json();
    console.log('ChromaDB query successful, got', result.documents[0]?.length || 0, 'results');

    return {
      documents: result.documents[0] || [],
      metadatas: result.metadatas[0] || [],
      ids: result.ids[0] || [],
      distances: result.distances[0] || []
    };
  } catch (error) {
    console.error('Error in queryCollection:', error);
    throw error;
  }
} 