export interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  logoUrl: string;
  description: string;
}

const pairs: TradingPair[] = [
  {
    symbol: 'BTCUSDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/btc.png',
    description: 'Bitcoin / Tether',
  },
  {
    symbol: 'ETHUSDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/eth.png',
    description: 'Ethereum / Tether',
  },
  {
    symbol: 'SOLUSDT',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/sol.png',
    description: 'Solana / Tether',
  },
];

export async function getTradingPairs() {
  return pairs;
}
