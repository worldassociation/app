import { NextResponse } from 'next/server';

export async function GET() {
  const { ZKME_API_KEY } = process.env;

  if (!ZKME_API_KEY) {
    return NextResponse.json(
      { error: 'ZKME_API_KEY is missing' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://nest-api.zk.me/api/token/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: ZKME_API_KEY,
        appId: 'M2024053066119595336406774111128',
        apiModePermission: 1,
        lv: 2
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch zkMe token');
    }

    const data = await response.json();
    return NextResponse.json({ accessToken: data.data.accessToken });
  } catch (error) {
    console.error('Error fetching zkMe token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch zkMe token' },
      { status: 500 }
    );
  }
}
