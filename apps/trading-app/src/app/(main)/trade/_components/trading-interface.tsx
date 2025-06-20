import { ChartContainer } from './chart-container';
import { CoinInfo } from './coin-info';

import { OrderBookContainer } from './order-book-container';
import { OrderContainer } from './order-container';

import { TradingPairCheck } from './trading-pair-check';

import { Card } from '@/components/ui/card';

export function TradingInterface() {
  return (
    <>
      <TradingPairCheck />
      <div className="flex gap-1 mt-0.5 flex-col">
        <CoinInfo />

        <div className="grid gap-1 [grid-template-columns:minmax(253px,320px)_minmax(510px,880px)_minmax(253px,320px)] px-1">
          <OrderBookContainer />

          <ChartContainer />

          <OrderContainer />
        </div>
      </div>
    </>
  );
}
