import { NextResponse } from 'next/server';
import { queryCollection } from '@/lib/chroma/client';
import { generateResponse } from '@/lib/llm/client';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('Processing chat request...');
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      console.error('Invalid message format:', message);
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Querying ChromaDB for context...');
    // Query Chroma for relevant documents
    let results;
    try {
      results = await queryCollection(message);
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

    console.log('Found relevant documents:', results.documents.length);
    // Get relevant documents for context
    const relevantDocs = results.documents
      .filter((doc): doc is NonNullable<typeof doc> => doc !== null);

    console.log('Generating LLM response...');
    // Generate response using LLM with context
    const llmResponse = await generateResponse(message, relevantDocs);

    // Format the response with relevant links
    const links = results.metadatas
      .filter((metadata): metadata is NonNullable<typeof metadata> => metadata !== null)
      .map((metadata) => ({
        title: metadata.title || 'Untitled',
        url: metadata.path || '#'
      }));

    console.log('Successfully generated response');
    return NextResponse.json({
      message: llmResponse,
      links
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    
    // Determine the appropriate error message and status code
    let status = 500;
    let message = 'An unexpected error occurred. Please try again.';
    
    if (error instanceof Error) {
      if (error.message.includes('OpenAI')) {
        status = 502;
        message = 'Failed to generate embeddings. Please try again.';
      } else if (error.message.includes('ChromaDB')) {
        status = 502;
        message = 'Failed to query knowledge base. Please try again.';
      }
    }
    
    return NextResponse.json({ error: message }, { status });
  }
} 