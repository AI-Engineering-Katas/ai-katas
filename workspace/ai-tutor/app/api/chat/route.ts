import { streamText, tool, type CoreMessage, type Tool, generateText } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { LLMError } from '@/lib/llm/client';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const LLM_MODEL = process.env.OPENAI_MODEL || 'gpt-4o'; // Or your preferred model
const ENABLE_RAG = process.env.ENABLE_RAG === 'true';

// Define a type for the expected request body structure
interface RequestBody {
  messages: CoreMessage[];
  isDrawingAllowed?: boolean;
}

// Moved from llm/client.ts - Helper to format base64 image data
function formatImageData(base64Data: string): string {
  // If the data is already properly formatted with content type, return as is
  if (base64Data.startsWith('data:image/')) {
    return base64Data;
  }
  // Otherwise, assume it's a PNG and add the proper content type prefix
  return `data:image/png;base64,${base64Data}`;
}

// Helper function to extract Mermaid diagram from LLM response
function extractMermaidDiagram(text: string): string | null {
  const mermaidRegex = /```(?:mermaid)?\n([\s\S]*?)```/;
  const match = text.match(mermaidRegex);
  return match ? match[1].trim() : null;
}

// Assume queryCollection exists and has a signature like:
// import { queryCollection } from '@/lib/chroma/client'; 
// Dummy function for now if RAG is enabled
const queryCollection = async (query: string): Promise<string[]> => {
  console.log(`[queryCollection - DUMMY] Querying for: ${query}`);
  // In a real scenario, this would query ChromaDB/VectorDB
  // based on the query and return relevant text chunks.
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async work
  return [
    `Context about \'${query}\' 1: System design involves...`,
    `Context about \'${query}\' 2: Trade-offs between consistency and availability...`
  ];
};

export async function POST(req: Request) {
  try {
    // Extract messages and isDrawingAllowed directly from the body
    const { messages, isDrawingAllowed: isDrawingAllowedFromRequest }: RequestBody = await req.json();

    // --- Extract data --- 
    const isDrawingAllowed = isDrawingAllowedFromRequest === true; // Default to false if undefined/null
    console.log(`[API Route] Received isDrawingAllowed: ${isDrawingAllowed}`);
    // --- End Extraction --- 

    // --- Prepare messages for LLM --- 
    // Filter out any non-user/assistant/tool messages initially if needed, 
    // but the CoreMessage type should generally align.
    const initialMessages = messages.filter(
      m => m.role === 'user' || m.role === 'assistant' || m.role === 'tool'
    );
    console.log(`[API Route] Using ${initialMessages.length} initial messages for LLM.`);
    // --- End Preparation ---

    // --- Define Tools (Conditionally) --- 
    const tools: Record<string, Tool<any, any>> = {};

    // Only add the drawing tool if permission is granted
    if (isDrawingAllowed) {
      console.log('[API Route] Drawing allowed, adding generate_drawing tool.');
      tools.generate_drawing = tool({
        description: 'Generate Mermaid code for the user\'s diagram request.',
        parameters: z.object({
          drawing_request_details: z.string().describe('The user\'s original request for a diagram.'),
        }),
        execute: async ({ drawing_request_details }) => {
          // Permission check is now done *before* adding the tool.
          console.log(`[Tool generate_drawing] Requesting Mermaid code for: "${drawing_request_details}"`);
          try {
            const llmResponse = await generateText({
              model: openai(LLM_MODEL), // Use the same model
              prompt: `Generate only the raw Mermaid code (no explanations, no markdown fences) for the following request: ${drawing_request_details}`,
              // Consider adding temperature or other parameters if needed
            });

            console.log(`[Tool generate_drawing] LLM Raw Response: ${llmResponse.text}`);

            // 3. Extract Mermaid Code from LLM response
            //    We attempt extraction *even if* the prompt asked for raw code, as LLMs can be inconsistent.
            const mermaidCode = extractMermaidDiagram(llmResponse.text) || llmResponse.text.trim(); // Fallback to trimmed text

            if (mermaidCode && mermaidCode.length > 5) { // Basic validation: check if non-empty/trivial
              console.log(`[Tool generate_drawing] Extracted Mermaid Code:\n${mermaidCode}`);
              // Return the Mermaid code directly - *this* is what the frontend expects now
              return mermaidCode;
            } else {
              console.error('[Tool generate_drawing] Failed to extract valid Mermaid code from LLM response.');
              // Return an error status the frontend understands
              return { status: 'error', message: 'Failed to generate the diagram code.' };
            }

          } catch (error: any) {
            console.error('[Tool generate_drawing] Error calling LLM for Mermaid generation:', error);
            // Return error status the frontend understands
            return { status: 'error', message: `Failed to generate diagram: ${error.message}` };
          }
        },
      });
    } else {
      console.log('[API Route] Drawing not allowed, generate_drawing tool omitted.');
    }

    if (ENABLE_RAG) {
      tools.query_rag = tool({
        description: 'Query external knowledge base for information relevant to the user\'s question about system design.',
        parameters: z.object({
          query: z.string().describe('The user query to search for in the knowledge base.'),
        }),
        execute: async ({ query }) => {
          try {
            console.log(`[Tool query_rag] Executing with query: ${query}`);
            const results = await queryCollection(query);
            console.log(`[Tool query_rag] Found ${results.length} results.`);
            // Return the results as a structured object or simple string
            return { searchResults: results }; 
            // Or potentially: return results.join('\n---\n');
          } catch (error: any) {
            console.error('[Tool query_rag] Error:', error);
            return { error: `Failed to query knowledge base: ${error.message}` };
          }
        },
      });
      console.log('[API Route] RAG tool enabled.');
    } else {
      console.log('[API Route] RAG tool disabled.');
    }
    // --- End Define Tools --- 

    const result = await streamText({
      // Use the specific model configured for Vercel AI SDK/OpenAI
      model: openai(LLM_MODEL),
      // System prompt updated - remove instruction for LLM to generate mermaid code after tool call
      system: `You are an expert system design tutor. Be concise.

RULES:
- If the user asks you to draw, visualize, or create a diagram, you MUST call the 'generate_drawing' tool.
- The tool will handle permission checks and attempt to generate the Mermaid code internally.
- If the tool call is successful, it will return the raw Mermaid code. The UI will handle rendering it. Do NOT mention the diagram in your text response or try to generate it yourself. Simply respond to the user's original request textually, ignoring the drawing part if the tool handles it.
- If the tool call returns an error object (e.g., { status: 'error', message: '...' }), you MUST relay the error message clearly to the user in your text response and stop.
- Example successful flow: User asks "Draw X and explain Y" -> You call generate_drawing -> Tool returns Mermaid code -> Your text response ONLY explains Y.${ENABLE_RAG ? "\n- If the query requires external knowledge, use the 'query_rag' tool." : ""}`,
      messages: initialMessages, // Use the filtered initial messages
      tools: tools, // Pass the dynamically constructed tools object
      toolChoice: 'auto',
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('Error processing chat request:', error);
    const statusCode = error instanceof LLMError ? (error as LLMError).statusCode || 500 : 500;
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: statusCode,
    });
  }
} 