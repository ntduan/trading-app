const pairs = [
  {
    symbol: 'BTCUSDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/btc.png',
  },
  {
    symbol: 'ETHUSDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/eth.png',
  },
  {
    symbol: 'SOLUSDT',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/sol.png',
  },
  {
    symbol: 'ETHBTC',
    baseAsset: 'ETH',
    quoteAsset: 'BTC',
    logoUrl: 'https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/128/color/eth.png',
  },
];

export async function getTradingPairs() {
  return pairs;
}
