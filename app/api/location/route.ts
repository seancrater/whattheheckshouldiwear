import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { locationDescription } = await request.json();

  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
  }

  try {
    const prompt = `
      First, analyze the location reference carefully.
      If it's an explicit location (e.g. "New York City"), use that to determine the ZIP code.

      If it's a vague or humorous description (e.g. "a casual day at the beach midway up the east coast"),
      interpret it to find the most relevant real-world location.

      If it's a clue (e.g. "home of a famous tea party"), use that to begin to determine the location.
      Use any additional clues to refine your understanding of the location.

      Before you respond, please verify that your suggested ZIP code matches any clues provided.
      If any clues don't match, please reconsider your suggestion.

      Then, suggest a valid 5 digit US ZIP code for that location.
      Please also provide longitude and latitude coordinates for the center of that ZIP code.
      The location information provided is: ${locationDescription}
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
        max_tokens: 30,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "zip_lookup",
            schema: {
              type: "object",
              properties: {
                title: { type: "string", description: "Name of the location corresponding to the ZIP code" },
                zip: { type: "string", description: "5-digit US ZIP code" },
                latitude: { type: "number", description: "Latitude of the center of the ZIP code" },
                longitude: { type: "number", description: "Longitude of the center of the ZIP code" }
              },
              required: ["zip", "latitude", "longitude"],
              additionalProperties: false
            }
          }
        }
      }),
    });

    const data = await response.json();

    if (data.error && data.error) {
      throw new Error(data.error.message || 'Oops! Something went wrong. Please try again.');
    }

    const location = data.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ location: location ? JSON.parse(location) : undefined });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
