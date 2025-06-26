import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.url.split('?')[1] || '';
  const binanceUrl = `https://api.binance.com/api/v3/klines?${query}`;

  const response = await fetch(binanceUrl);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    status: 200,
  });
}
