import { NextResponse } from 'next/server';

import { getTradingPairs } from './getTradingPairs';

export async function GET() {
  const pairs = await getTradingPairs();
  return NextResponse.json({
    result: pairs,
  });
}
