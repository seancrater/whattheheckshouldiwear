import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { weatherByDay } = await request.json();

  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
  }

  try {
  const prompt = `
    Given the following array of daily weather data: ${JSON.stringify(weatherByDay)}
    For each day, suggest a sensible outfit based on the weather.
    Do not repeat the date in your response, we already show it in the UI.
  `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'outfit_suggestions',
            schema: {
              type: 'object',
              properties: {
                outfits: {
                  type: 'array',
                  items: {
                    type: 'string',
                    description: 'A description (min 10 words, max 25 words) of an appropriate outfit for the day.'
                  },
                  minItems: 7,
                  maxItems: 7,
                  description: 'An array of 7 strings, each describing an outfit for a day.'
                }
              },
              required: ['outfits'],
              additionalProperties: false
            }
          }
        }
      }),
    });

    const data = await response.json();

    // Try to parse the response content as JSON array of strings
    const outfits = JSON.parse(data.choices?.[0]?.message?.content ?? '[]');

    return NextResponse.json(outfits);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
