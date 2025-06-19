import { CoinInfo } from './coin-info';

import { Card } from '@/components/ui/card';

export function TradingInterface({ symbol }: { symbol: string }) {
  return (
    <div className="flex gap-1 mt-0.5 flex-col">
      <Card>Header</Card>

      <div className="grid gap-1 [grid-template-columns:minmax(253px,320px)_minmax(510px,880px)_minmax(253px,320px)]">
        <Card>Orderbook</Card>

        <Card>Market</Card>

        <Card>Orderform</Card>
      </div>
    </div>
  );
}
