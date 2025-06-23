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

        <div className="grid gap-1 [grid-template-columns:minmax(253px,360px)_minmax(510px,1fr)] [grid-template-rows:minmax(420px,1fr)_minmax(360px,auto)] px-1">
          <OrderbookContainer className="row-span-2" />

          <ChartContainer />

          <OrderContainer />
        </div>

        <HistoryContainer className="px-1" />
      </div>
    </>
  );
}
