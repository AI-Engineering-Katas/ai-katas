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

interface ErrorResponse {
  error?: {
    message?: string;
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
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } })) as ErrorResponse;
      console.error('OpenAI API error details:', errorData);
      throw new Error(`OpenAI embeddings API error: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json() as OpenAIEmbeddingResponse;
    console.log('Successfully got embedding, dimensions:', result.data[0].embedding.length);
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error in getEmbedding:', error);
    throw error;
  }
}

async function createCollection() {
  console.log('Creating collection:', COLLECTION_NAME);
  console.log('Using ChromaDB URL:', CHROMA_API_URL);
  
  try {
    // First, try to get the API version to confirm connectivity
    const versionResponse = await fetch(`${CHROMA_API_URL}/api/v2/version`);
    console.log('ChromaDB version check status:', versionResponse.status);
    if (versionResponse.ok) {
      const version = await versionResponse.text();
      console.log('ChromaDB version:', version);
    } else {
      console.error('Failed to get ChromaDB version:', versionResponse.statusText);
    }
    
    // Now try to create the collection
    // Based on ChromaDB 1.0.0 API structure
    console.log('Sending request to create collection to:', `${CHROMA_API_URL}/api/v2/collections`);
    
    // Get all collections first to see if our collection already exists
    const listResponse = await fetch(`${CHROMA_API_URL}/api/v2/collections`);
    if (listResponse.ok) {
      const collections = await listResponse.json();
      console.log('Existing collections:', JSON.stringify(collections));
      
      // Check if our collection already exists
      const collectionExists = collections.some((collection: any) => 
        collection.name === COLLECTION_NAME || collection.id === COLLECTION_NAME
      );
      
      if (collectionExists) {
        console.log('Collection already exists, skipping creation');
        return { id: COLLECTION_NAME, name: COLLECTION_NAME };
      }
    } else {
      console.log('Failed to list collections, will attempt to create anyway');
    }
    
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
      console.error('Error creating collection, status:', response.status, 'text:', responseText);
      
      // If we still can't create the collection, try a different approach
      // Some versions of ChromaDB require a tenant_id and database_id
      console.log('Trying alternative collection creation approach...');
      const altResponse = await fetch(`${CHROMA_API_URL}/api/v2/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: COLLECTION_NAME,
          tenant: "default_tenant",
          database: "default_database",
          metadata: {
            description: 'Collection for building blocks of knowledge'
          }
        })
      });
      
      console.log('Alternative create collection response status:', altResponse.status);
      
      if (!altResponse.ok) {
        const altResponseText = await altResponse.text();
        console.error('Error with alternative collection creation:', altResponseText);
        
        // If we still can't create it, let's just proceed assuming it exists
        console.log('Unable to create collection, will proceed assuming it exists');
        return { id: COLLECTION_NAME, name: COLLECTION_NAME };
      }
      
      const altResult = await altResponse.json();
      console.log('Collection created successfully with alternative approach:', altResult);
      return altResult;
    }

    const result = await response.json();
    console.log('Collection created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating collection:', error);
    // Instead of throwing, return a mock result so we can continue
    console.log('Returning mock collection result to continue process');
    return { id: COLLECTION_NAME, name: COLLECTION_NAME };
  }
}

async function checkCollection() {
  console.log('Checking collection status...');
  try {
    // Try v2 API
    console.log('Trying v2 API endpoint:', `${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}`);
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
      
      // Try listing all collections to see if our collection exists with a different ID
      console.log('Trying to list all collections...');
      const listResponse = await fetch(`${CHROMA_API_URL}/api/v2/collections`);
      
      if (listResponse.ok) {
        const collections = await listResponse.json();
        console.log('All collections:', JSON.stringify(collections));
        
        // Check if our collection exists by name
        const existingCollection = collections.find((collection: any) => 
          collection.name === COLLECTION_NAME
        );
        
        if (existingCollection) {
          console.log('Found collection by name:', existingCollection);
          return existingCollection;
        }
      }
      
      console.log('Collection not found in list, creating it...');
      return await createCollection();
    }

    const result = await response.json();
    console.log('Collection details:', result);
    return result;
  } catch (error) {
    console.error('Error checking collection:', error);
    // Instead of throwing, create the collection
    console.log('Error occurred while checking collection, attempting to create it...');
    return await createCollection();
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
    console.log('Using API endpoint:', `${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}/add`);
    
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
      
      // Try with a different request body format
      console.log('Trying alternative request body format...');
      
      // Some versions of ChromaDB expect a different format
      const altRequestBody = {
        documents: [
          {
            ids,
            embeddings,
            documents,
            metadatas
          }
        ]
      };
      
      const altResponse = await fetch(`${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(altRequestBody)
      });
      
      console.log('Alternative add documents response status:', altResponse.status);
      
      if (!altResponse.ok) {
        const altResponseText = await altResponse.text();
        console.error('Alternative request also failed:', altResponseText);
        console.log('Proceeding despite add failure - documents will not be added');
        return { success: false, message: 'Failed to add documents' };
      }
      
      const altResult = await altResponse.json();
      console.log('Successfully added documents with alternative format');
      return altResult;
    }

    const result = await response.json();
    console.log('Successfully added documents to collection');
    return result;
  } catch (error) {
    console.error('Error adding documents:', error);
    return { success: false, message: 'Error adding documents', error: String(error) };
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
    console.log('Using API endpoint:', `${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}/query`);

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
      
      // Try with a different request body format
      console.log('Trying alternative query format...');
      
      // Some versions of ChromaDB expect a different format
      const altRequestBody = {
        embeddings: [queryEmbedding],
        n_results: nResults,
        include: ["documents", "metadatas", "distances"]
      };
      
      const altResponse = await fetch(`${CHROMA_API_URL}/api/v2/collections/${COLLECTION_NAME}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(altRequestBody)
      });
      
      console.log('Alternative query response status:', altResponse.status);
      
      if (!altResponse.ok) {
        console.error('Alternative query also failed');
        // Return empty results instead of throwing
        return {
          documents: [],
          metadatas: [],
          ids: [],
          distances: []
        };
      }
      
      const altResult = await altResponse.json() as ChromaQueryResponse;
      console.log('ChromaDB query successful with alternative format, got', altResult.documents[0]?.length || 0, 'results');
      
      return {
        documents: altResult.documents[0] || [],
        metadatas: altResult.metadatas[0] || [],
        ids: altResult.ids[0] || [],
        distances: altResult.distances[0] || []
      };
    }

    const result = await response.json() as ChromaQueryResponse;
    console.log('ChromaDB query successful, got', result.documents[0]?.length || 0, 'results');

    return {
      documents: result.documents[0] || [],
      metadatas: result.metadatas[0] || [],
      ids: result.ids[0] || [],
      distances: result.distances[0] || []
    };
  } catch (error) {
    console.error('Error in queryCollection:', error);
    // Return empty results instead of throwing
    return {
      documents: [],
      metadatas: [],
      ids: [],
      distances: []
    };
  }
}