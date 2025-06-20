import {
  type Bar,
  type DatafeedConfiguration,
  type IBasicDataFeed,
  type LibrarySymbolInfo,
  type ResolutionString,
  type SearchSymbolResultItem,
  type SeriesFormat,
  type Timezone,
} from 'tv-charting-library';

import { type IExchangeAdapter } from '@/adapters/createExchangeAdapter';

const supported_resolutions = ['1', '5', '60', '240', '1D'] as ResolutionString[];

export class Datafeed implements IBasicDataFeed {
  public adapter: IExchangeAdapter;
  constructor(adapter: IExchangeAdapter) {
    this.adapter = adapter;
  }
  onReady(callback: (config: DatafeedConfiguration) => void): void {
    const config: DatafeedConfiguration = {
      supported_resolutions: supported_resolutions,
      exchanges: [{ value: this.adapter.name, name: this.adapter.name, desc: this.adapter.name }],
    };
    setTimeout(() => callback(config), 0);
  }

  resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void,
    onResolveErrorCallback: (reason: string) => void
  ): void {
    const symbolInfo = {
      name: symbolName,
      ticker: symbolName,
      description: symbolName,
      supported_resolutions: supported_resolutions,
      exchange: this.adapter.name,
      listed_exchange: this.adapter.name,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC' as Timezone,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_daily: true,
      volume_precision: 2,
      data_status: 'streaming' as const,
      format: 'price' as SeriesFormat,
    };
    setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: { from: number; to: number },
    onHistoryCallback: (bars: Bar[], meta: { noData: boolean }) => void,
    onError: (error: string) => void
  ): Promise<void> {
    const { from, to } = periodParams;
    try {
      const bars = await this.adapter.getHistory(symbolInfo.name, resolution, from, to);
      onHistoryCallback(bars, { noData: bars.length === 0 });
    } catch (e: unknown) {
      onError(typeof e === 'string' ? e : (e as Error).message || 'Unknown error');
    }
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: (bar: Bar) => void,
    listenerGuid: string
  ): void {
    this.adapter.subscribeKlines(symbolInfo.name, resolution, onRealtimeCallback, listenerGuid);
  }

  unsubscribeBars(listenerGuid: string): void {
    this.adapter.unsubscribeKlines(listenerGuid);
  }

  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: (symbols: SearchSymbolResultItem[]) => void
  ): void {
    const results = this.adapter
      .getSupportedTradingPairs()
      .filter((p) => p.symbol.toLowerCase().includes(userInput.toLowerCase()))
      .map((pair) => ({
        ...pair,
        name: pair.symbol,
        full_name: `${this.adapter.name.toUpperCase()}:${pair.symbol}`,
        exchange: this.adapter.name.toUpperCase(),
        type: 'crypto',
      }));

    onResultReadyCallback(results);
  }
}
