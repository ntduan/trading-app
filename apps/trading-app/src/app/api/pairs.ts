import { NextResponse } from 'next/server';

const pairs = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT' },
  { symbol: 'ETHBTC', baseAsset: 'ETH', quoteAsset: 'BTC' },
];

export async function GET() {
  return NextResponse.json(pairs);
}
