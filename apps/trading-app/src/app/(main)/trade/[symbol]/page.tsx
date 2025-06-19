import { getTradingPairs } from '@/app/api/pairs/getTradingPairs';

// Generate static params at build time using trading pairs data
export async function generateStaticParams() {
  try {
    // Fetch trading pairs data during build time
    const pairs = await getTradingPairs();

    // Generate params for each trading pair
    return pairs.map((pair: { symbol: string }) => ({
      symbol: pair.symbol,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function TradePage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  return (
    <div>
      <h1>Trade Page</h1>
      <p>Trading pair: {symbol}</p>
    </div>
  );
}
