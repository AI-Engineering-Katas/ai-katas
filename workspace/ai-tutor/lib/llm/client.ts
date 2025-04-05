interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateResponse(userMessage: string, context: string[]): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are a helpful AI tutor that assists users in understanding AI and machine learning concepts. 
Use the following context to answer the user's question. If the context doesn't contain relevant information, 
say so and provide a general response based on your knowledge.

Context:
${context.join('\n\n')}`
    },
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AI Tutor'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';
  } catch (error) {
    console.error('Error calling LLM:', error);
    throw new Error('Failed to generate response from LLM');
  }
} 