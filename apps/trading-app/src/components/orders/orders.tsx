'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';

import { DataTable, DataTableRow, EmptyState } from '../data-table/data-table';

import { Button } from '@/components/ui/button';
import { QUERY_KEYS } from '@/constants';
import { useOrderbook } from '@/hooks/useOrderbook';
import { useOrders } from '@/hooks/useOrders';
import { cn, formatAmount, formatDate, formatPrice } from '@/lib/utils';
import { _cancelOrderAtom, activeTradingPairInfoAtom, enhanceOrdersAtom } from '@/state/atoms';

export const Orders = () => {
  const { data: allOrders } = useOrders();
  const activeTradingPair = useAtomValue(activeTradingPairInfoAtom);
  const queryClient = useQueryClient();
  const cancelOrder = useSetAtom(_cancelOrderAtom);
  const enhanceOrders = useAtomValue(enhanceOrdersAtom);
  const orderbook = useOrderbook();

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      if (!activeTradingPair) {
        throw new Error('Trading pair not available');
      }

      // Simulate API call delay
      await Promise.resolve();

      // Cancel order and update balance in one operation
      const result = cancelOrder({
        orderId,
        tradingPair: {
          baseAsset: activeTradingPair.baseAsset,
          quoteAsset: activeTradingPair.quoteAsset,
        },
      });

      console.log(`Refunding ${result.refund.amount} ${result.refund.asset} for cancelled order`);

      return result.order;
    },
    onSuccess: (cancelledOrder) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BALANCE] });

      enqueueSnackbar(`Order ${cancelledOrder.id.slice(-7)} cancelled successfully`, {
        variant: 'success',
      });
    },
    onError: (error) => {
      enqueueSnackbar(`Failed to cancel order: ${error.message}`, {
        variant: 'error',
      });
    },
  });

  const handleCancelOrder = (orderId: string, event: React.MouseEvent) => {
    console.log(`Cancel order: ${orderId}`);
    cancelOrderMutation.mutate(orderId);
    event.stopPropagation();
  };

  const columns = useMemo(
    () => [
      'Order No.',
      'Date',
      'Pair',
      'Side',
      `Price (${activeTradingPair?.quoteAsset || '--'})`,
      `Amount (${activeTradingPair?.baseAsset || '--'})`,
      `Unrealized PnL (${activeTradingPair?.quoteAsset || '--'})`,
      'Status',
      'Actions',
    ],
    [activeTradingPair]
  );

  const orders = useMemo(
    () =>
      enhanceOrders(allOrders)
        .filter((order) => order.pair === activeTradingPair?.symbol)
        ?.slice()
        .sort((a, b) => b.createdAt - a.createdAt) || [],
    [activeTradingPair?.symbol, allOrders, enhanceOrders]
  );

  const ordersWithPnl = useMemo(() => {
    const midPrice = orderbook?.mid;
    if (!midPrice) return orders;
    return orders.map((order) => {
      if (order.status !== 'pending') return order;
      const unrealizedPnl =
        order.side === 'buy' ? (midPrice - order.price) * order.amount : (order.price - midPrice) * order.amount;
      return {
        ...order,
        unrealizedPnl: unrealizedPnl.toFixed(2),
      };
    });
  }, [orders, orderbook]);

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} emptyStateMessage="No orders." className="min-w-[864px]">
        {!orders || orders?.length === 0 || !activeTradingPair ? (
          <EmptyState message="You have no orders." />
        ) : (
          ordersWithPnl.map((order) => (
            <DataTableRow key={order.id} className="grid-cols-9">
              <div className="font-mono text-muted-foreground">{order.id.slice(-7)}</div>
              <div>{formatDate(order.createdAt)}</div>
              <div className="font-medium">{order.pair}</div>
              <div>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-medium',
                    order.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  )}
                >
                  {order.side.toUpperCase()}
                </span>
              </div>
              <div className="font-mono">{formatPrice(order.price)}</div>
              <div className="font-mono">{formatAmount(order.amount)}</div>
              <div className="font-mono">{order.unrealizedPnl}</div>
              <div>
                <span
                  className={cn(
                    'select-none px-1.5 py-0.5 rounded text-xs font-medium',
                    order.status === 'filled' && 'bg-green-500/20 text-green-400',
                    order.status === 'pending' && 'bg-yellow-500/20 text-yellow-400',
                    order.status === 'cancelled' && 'bg-red-500/20 text-red-400'
                  )}
                >
                  {order.status}
                </span>
              </div>
              <div>
                {order.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer h-auto px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    onClick={(e) => handleCancelOrder(order.id, e)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </DataTableRow>
          ))
        )}
      </DataTable>
    </div>
  );
};
