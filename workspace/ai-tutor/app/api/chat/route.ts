import { NextResponse } from 'next/server';
import { queryCollection } from '@/lib/chroma/client';
import { generateResponse, LLMError } from '@/lib/llm/client';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const RAG_ENABLED = process.env.ENABLE_RAG === 'true';

interface LinkMetadata {
  title: string;
  url: string;
}

export async function POST(request: Request) {
  try {
    console.log('Processing chat request...');
    const { message, imageData } = await request.json();

    if (!message || typeof message !== 'string') {
      console.error('Invalid message format:', message);
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    let relevantDocs: string[] = [];
    let links: LinkMetadata[] = [];

    if (RAG_ENABLED) {
      console.log('Querying ChromaDB for context...');
      // Query Chroma for relevant documents
      try {
        const results = await queryCollection(message);
        console.log('Found relevant documents:', results.documents.length);
        
        // Get relevant documents for context
        relevantDocs = results.documents
          .filter((doc): doc is NonNullable<typeof doc> => doc !== null);

        // Format the response with relevant links
        links = results.metadatas
          .filter((metadata): metadata is NonNullable<typeof metadata> => metadata !== null)
          .map((metadata) => ({
            title: metadata.title || 'Untitled',
            url: metadata.path || '#'
          }));
      } catch (error) {
        console.error('ChromaDB query failed:', error);
        if (error instanceof Error && error.message.includes('Collection does not exist')) {
          return NextResponse.json(
            { error: 'Knowledge base not initialized. Please add some documents first.' },
            { status: 503 }
          );
        }
        throw error; // Re-throw for general error handling
      }
    }

    console.log('Generating LLM response...');
    // Generate response using LLM with context and image data if available
    const llmResponse = await generateResponse(message, relevantDocs, imageData);

    console.log('Successfully generated response');
    return NextResponse.json({
      message: llmResponse,
      links
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    
    // Determine the appropriate error message and status code
    let status = 500;
    let errorResponse: any = {
      error: 'An unexpected error occurred. Please try again.'
    };
    
    if (error instanceof LLMError) {
      status = error.statusCode || 502;
      errorResponse = {
        error: error.message,
        details: error.responseBody
      };
    } else if (error instanceof Error) {
      if (error.message.includes('OpenAI')) {
        status = 502;
        errorResponse.error = 'Failed to generate embeddings. Please try again.';
      } else if (error.message.includes('ChromaDB')) {
        status = 502;
        errorResponse.error = 'Failed to query knowledge base. Please try again.';
      }
    }
    
    return NextResponse.json(errorResponse, { status });
  }
} 