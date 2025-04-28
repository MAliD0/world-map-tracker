import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { countryName, question } = await req.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://world-map-tracker-vj1p-d9wh3nndp-malid0s-projects.vercel.app/',//
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
  return NextResponse.json(data);
}
