import { ChartContainer } from './chart-container';
import { CoinInfo } from './coin-info';

import { OrderBookContainer } from './order-book-container';
import { OrderContainer } from './order-container';

import { TradingPairCheck } from './trading-pair-check';

export function TradingInterface() {
  return (
    <>
      <TradingPairCheck />
      <div className="flex gap-1 mt-0.5 flex-col">
        <CoinInfo />

        <div className="grid gap-1 [grid-template-columns:minmax(253px,360px)_minmax(510px,1fr)] [grid-template-rows:minmax(420px,1fr)_minmax(360px,auto)] px-1">
          <OrderBookContainer className="row-span-2" />

          <ChartContainer />

          <OrderContainer />
        </div>
      </div>
    </>
  );
}
