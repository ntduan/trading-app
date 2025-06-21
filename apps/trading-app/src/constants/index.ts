export const STORAGE_KEYS = {
  ACTIVE_TRADING_PAIR: 'active_trading_pair',
  AMOUNT: 'amount',
  ORDERS: 'orders',
};

export const QUERY_KEYS = {
  TRADING_PAIR: 'trading_pair',
  USER_BALANCE: 'user-balance',
};

export const DEFAULT_TRADING_PAIR = 'BTC/USDT';

export const SUPPORTED_TRADING_PAIRS = [
  {
    symbol: 'BTC/USDT',
    full_name: 'BINANCE:BTCUSDT',
    description: 'Bitcoin / Tether',
    exchange: 'BINANCE',
    type: 'crypto',
  },
  {
    symbol: 'ETH/USDT',
    full_name: 'BINANCE:ETHUSDT',
    description: 'Ethereum / Tether',
    exchange: 'BINANCE',
    type: 'crypto',
  },
  {
    symbol: 'SOL/USDT',
    full_name: 'BINANCE:SOLUSDT',
    description: 'Solana / Tether',
    exchange: 'BINANCE',
    type: 'crypto',
  },
];
