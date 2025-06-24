import { ChartContainer } from './chart-container';
import { CoinInfo } from './coin-info';
import { HistoryContainer } from './history-container';

import { OrderContainer } from './order-container';
import { OrderbookContainer } from './orderbook-container';

import { TradeUpdater } from './updater';

export function TradingInterface() {
  return (
    <>
      <TradeUpdater />
      <div className="flex gap-1 mt-0.5 flex-col mb-20">
        <CoinInfo />

        <div className="trading-grid">
          <OrderbookContainer className="row-span-2" />

          <ChartContainer />

          <OrderContainer />
        </div>

        <HistoryContainer className="mx-1" />
      </div>
    </>
  );
}
