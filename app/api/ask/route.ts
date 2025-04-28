import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { countryName, question } = await req.json();
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://world-map-tracker-885k7j490-malid0s-projects.vercel.app',//
      'X-Title': 'world-map-tracker',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'You are a tourist guide. Give short answers in english, responce under 6 sentences and 100 words' },
        { role: 'user', content: `Tell about a country ${countryName}. Question: ${question}` },
      ],
    }),
  });

  const data = await response.json();
  console.log(`Bearer ${apiKey}`);
  console.log('Ответ от OpenRouter:', JSON.stringify(data, null, 2));

  return NextResponse.json(data);
}
