import { NextResponse } from 'next/server';
// import { queryCollection } from '@/lib/chroma/client'; // Temporarily disable ChromaDB
import { generateResponse, LLMError } from '@/lib/llm/client';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const RAG_ENABLED = process.env.ENABLE_RAG === 'true';

interface LinkMetadata {
  title: string;
  url: string;
}

// Helper function to extract Mermaid diagram from LLM response
function extractMermaidDiagram(text: string): string | null {
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/;
  const match = text.match(mermaidRegex);
  return match ? match[1].trim() : null;
}

export async function POST(req: Request) {
  try {
    const { message, imageData, generateMermaid = false } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid message format' }), {
        status: 400,
      });
    }

    console.log(`Processing ${generateMermaid ? 'Mermaid diagram' : 'regular'} request:`, {
      messageLength: message.length,
      hasImage: Boolean(imageData)
    });

    // Temporarily disable ChromaDB query and use empty context
    // const results = await queryCollection(message);
    // const context = results.documents
    //   .filter((doc): doc is string => doc !== null)
    //   .slice(0, 3); // Limit to top 3 most relevant documents
    const context: string[] = []; // Use empty context

    // Generate response using the LLM
    const llmResponse = await generateResponse(message, context, imageData, generateMermaid);
    console.log('Raw LLM Response:', llmResponse); // Log the raw response

    if (generateMermaid) {
      const mermaidDiagram = extractMermaidDiagram(llmResponse);
      console.log('[Backend] Extracted Mermaid Diagram:', mermaidDiagram); // Log extracted result

      if (!mermaidDiagram) {
        console.warn('No Mermaid diagram found in LLM response');
        return new Response(JSON.stringify({
          error: 'Failed to generate diagram',
          message: 'The AI was unable to create a diagram for this request.'
        }), { status: 422 });
      }
      return new Response(JSON.stringify({ mermaidDiagram }));
    }

    return new Response(JSON.stringify({ message: llmResponse }));

  } catch (error) {
    console.error('Error processing chat request:', error);
    const statusCode = error instanceof LLMError ? error.statusCode || 500 : 500;
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: statusCode,
    });
  }
} 