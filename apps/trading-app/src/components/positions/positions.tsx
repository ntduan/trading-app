'use client';

import { useMemo } from 'react';

import { DataTable, DataTableRow, EmptyState } from '../data-table/data-table';

import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useOrders';
import { cn, formatAmount, formatPrice } from '@/lib/utils';

type Position = {
  pair: string;
  side: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercentage: number;
  margin: number;
  leverage: number;
};

export const Positions = () => {
  const { data: orders = [] } = useOrders();

  // Calculate positions from filled orders
  const positions = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const filledOrders = orders.filter((order) => order.status === 'filled');
    const positionMap = new Map<string, Position>();

    filledOrders.forEach((order) => {
      const existing = positionMap.get(order.pair);
      const currentMarkPrice = order.price;

      if (!existing) {
        positionMap.set(order.pair, {
          pair: order.pair,
          side: order.side,
          size: order.amount,
          entryPrice: order.price,
          markPrice: currentMarkPrice,
          pnl: (currentMarkPrice - order.price) * order.amount * (order.side === 'buy' ? 1 : -1),
          pnlPercentage: ((currentMarkPrice - order.price) / order.price) * 100 * (order.side === 'buy' ? 1 : -1),
          margin: order.amount * order.price * 0.1, // 10x leverage
          leverage: 10,
        });
      } else {
        // Simplified position calculation
        const totalSize = existing.size + (order.side === existing.side ? order.amount : -order.amount);
        if (totalSize !== 0) {
          const avgPrice =
            (existing.entryPrice * existing.size + order.price * order.amount) / (existing.size + order.amount);
          existing.size = Math.abs(totalSize);
          existing.entryPrice = avgPrice;
          existing.pnl = (currentMarkPrice - avgPrice) * Math.abs(totalSize) * (totalSize > 0 ? 1 : -1);
          existing.pnlPercentage = ((currentMarkPrice - avgPrice) / avgPrice) * 100 * (totalSize > 0 ? 1 : -1);
        } else {
          positionMap.delete(order.pair);
        }
      }
    });

    return Array.from(positionMap.values()).filter((pos) => pos.size > 0);
  }, [orders]);

  const formatPnl = (pnl: number) => (pnl >= 0 ? '+' : '') + pnl.toFixed(2);
  const formatPercentage = (percentage: number) => (percentage >= 0 ? '+' : '') + percentage.toFixed(2) + '%';

  const columns = ['Pair', 'Side', 'Size', 'Entry Price', 'Mark Price', 'PnL', 'PnL%', 'Margin'];

  return (
    <DataTable columns={columns} emptyStateMessage="You have no positions.">
      {positions.length === 0 ? (
        <EmptyState message="You have no positions." />
      ) : (
        positions.map((position, index) => (
          <DataTableRow key={`${position.pair}-${index}`} className="grid-cols-8">
            <div className="font-medium">{position.pair}</div>
            <div>
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-xs font-medium',
                  position.side === 'buy' ? 'bg-green-500/20 text-chart-2' : 'bg-red-500/20 text-chart-1'
                )}
              >
                {position.side.toUpperCase()}
              </span>
            </div>
            <div className="font-mono">{formatAmount(position.size)}</div>
            <div className="font-mono">{formatPrice(position.entryPrice)}</div>
            <div className="font-mono">{formatPrice(position.markPrice)}</div>
            <div className={cn('font-mono', position.pnl >= 0 ? 'text-chart-2' : 'text-chart-1')}>
              {formatPnl(position.pnl)}
            </div>
            <div className={cn('font-mono', position.pnlPercentage >= 0 ? 'text-chart-2' : 'text-chart-1')}>
              {formatPercentage(position.pnlPercentage)}
            </div>
            <div className="font-mono">{formatPrice(position.margin)}</div>
          </DataTableRow>
        ))
      )}
    </DataTable>
  );
};
