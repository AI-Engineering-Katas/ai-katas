interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export class LLMError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly responseBody?: any
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

function formatImageData(base64Data: string): string {
  console.log('Formatting image data:', {
    inputLength: base64Data.length,
    startsWithData: base64Data.startsWith('data:'),
    firstChars: base64Data.slice(0, 50) + '...'
  });

  // If the data is already properly formatted with content type, return as is
  if (base64Data.startsWith('data:image/')) {
    console.log('Image already has content type prefix');
    return base64Data;
  }

  // Otherwise, assume it's a PNG (since that's what Excalidraw exports)
  // and add the proper content type prefix
  console.log('Adding PNG content type prefix to image data');
  return `data:image/png;base64,${base64Data}`;
}

export async function generateResponse(
  userMessage: string, 
  context: string[],
  imageData?: string
): Promise<string> {
  const systemMessage = `You are a helpful AI tutor that assists users in understanding AI and machine learning concepts. 
Use the following context to answer the user's question. If the context doesn't contain relevant information, 
say so and provide a general response based on your knowledge.

If an image is provided, analyze it and incorporate your observations into your response.
If the image shows a diagram, flowchart, or any visual explanation, describe what you see and how it relates to the question.

Context:
${context.join('\n\n')}`;

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: systemMessage
    }
  ];

  // If we have an image, create a multimodal message
  if (imageData) {
    console.log('Preparing multimodal message with image');
    const formattedImageData = formatImageData(imageData);
    
    const multimodalContent = [
      {
        type: 'text' as const,
        text: userMessage
      },
      {
        type: 'image_url' as const,
        image_url: {
          url: formattedImageData
        }
      }
    ];

    console.log('Created multimodal content:', {
      hasText: Boolean(multimodalContent[0]?.text),
      imageUrlLength: multimodalContent[1]?.image_url?.url?.length || 0,
      imageUrlStart: (multimodalContent[1]?.image_url?.url?.slice(0, 50) + '...') || 'N/A'
    });

    messages.push({
      role: 'user',
      content: multimodalContent
    });
  } else {
    console.log('Creating text-only message');
    messages.push({
      role: 'user',
      content: userMessage
    });
  }

  try {
    console.log('Sending request to OpenRouter with model:', 'mistralai/pixtral-12b');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Tutor'
      },
      body: JSON.stringify({
        model: 'mistralai/pixtral-12b',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const responseBody = await response.json();
    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      console.error('OpenRouter API error details:', responseBody);
      throw new LLMError(
        `OpenRouter API error: ${response.statusText}`,
        response.status,
        responseBody
      );
    }

    return responseBody.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    if (error instanceof LLMError) {
      throw error;
    }
    console.error('Error calling LLM:', error);
    throw new LLMError('Failed to generate response from LLM');
  }
} 