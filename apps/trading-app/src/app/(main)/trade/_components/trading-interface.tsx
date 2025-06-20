import { CoinInfo } from './coin-info';
import { Market } from './market';

import { TradingPairCheck } from './trading-pair-check';

import { OrderBook } from '@/components/order-book/order-book';

import { Card } from '@/components/ui/card';

export function TradingInterface() {
  return (
    <>
      <TradingPairCheck />
      <div className="flex gap-1 mt-0.5 flex-col">
        <CoinInfo />

        <div className="grid gap-1 [grid-template-columns:minmax(253px,320px)_minmax(510px,880px)_minmax(253px,320px)]">
          <OrderBook />

          <Market />

          <Card>Orderform</Card>
        </div>
      </div>
    </>
  );
}
