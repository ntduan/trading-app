// src/data/BinanceDataFeed.ts
import {
  type DatafeedConfiguration,
  //   IExternalDatafeed,
  //   IDatafeedChartApi,
  type IBasicDataFeed,
  type ResolutionString,
  type Timezone,
  type SeriesFormat,
} from 'tv-charting-library';

import { getHistory, subscribe, unsubscribe } from './binanceAPI';

const supportedSymbols = [
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

export const datafeed: IBasicDataFeed = {
  onReady: (callback) => {
    const config: DatafeedConfiguration = {
      supported_resolutions: ['1', '5', '60', '240', '1D'] as ResolutionString[],
      exchanges: [{ value: 'Binance', name: 'Binance', desc: 'Binance Exchange' }],
    };
    setTimeout(() => callback(config), 0);
  },

  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    const symbol = supportedSymbols.find((s) => s.symbol === symbolName);
    if (symbol) {
      const symbolInfo = {
        name: symbolName,
        ticker: symbolName,
        description: symbolName,
        type: 'crypto',
        session: '24x7',
        exchange: 'Binance',
        listed_exchange: 'Binance',
        timezone: 'Pacific/Auckland' as Timezone,
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        has_daily: true,
        supported_resolutions: ['1', '5', '60', '240', '1D'] as ResolutionString[],
        volume_precision: 2,
        data_status: 'streaming' as const,
        format: 'price' as SeriesFormat,
      };
      setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
    } else {
      onResolveErrorCallback('Symbol not found');
    }
  },

  getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onError) => {
    const { from, to } = periodParams;
    try {
      const bars = await getHistory(symbolInfo.name, resolution, from, to);
      onHistoryCallback(bars, { noData: bars.length === 0 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      onError(e);
    }
  },

  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID) => {
    subscribe(symbolInfo.name, resolution, onRealtimeCallback, subscriberUID);
  },

  unsubscribeBars: (subscriberUID: string) => {
    unsubscribe(subscriberUID);
  },

  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    const results = supportedSymbols.filter((s) => s.symbol.toLowerCase().includes(userInput.toLowerCase()));
    onResultReadyCallback(results);
  },
};
