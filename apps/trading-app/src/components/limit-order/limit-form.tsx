'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom, useStore } from 'jotai';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { AmountInput } from '../amount-input/amount-input';

import { AccountInfo } from './account-info';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { QUERY_KEYS } from '@/constants';
import { useUserBalance } from '@/hooks/useUserBalance';
import { cn } from '@/lib/utils';
import { _amountAtom, _ordersAtom, activeTradingPairInfoAtom, orderbookAtom, type Order } from '@/state/atoms';

type LimitFormFormProps = {
  side: 'buy' | 'sell';
  onSubmit?: (data: { price: string; amount: string; postOnly: boolean; side: 'buy' | 'sell' }) => void;
  symbol: string;
};

type FormData = {
  price: string;
  amount: string;
  postOnly: boolean;
};

const isValidNumber = (value: string) => {
  if (!value) return false;
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
};

export const LimitForm = ({ symbol, side }: LimitFormFormProps) => {
  const store = useStore();
  const activePair = useAtomValue(activeTradingPairInfoAtom);
  const { data: balance } = useUserBalance();
  const updateAmount = useSetAtom(_amountAtom);
  const addOrder = useSetAtom(_ordersAtom);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      price: '',
      amount: '',
      postOnly: false,
    },
  });

  const watchedPrice = watch('price');

  const maxAmount = useMemo(() => {
    if (!balance || !activePair?.quoteAsset) return 0;
    if (side === 'buy') {
      const priceNum = parseFloat(watchedPrice);
      if (!priceNum || priceNum <= 0) return 0;
      return Number((balance[activePair.quoteAsset] / priceNum).toFixed(4));
    } else {
      return balance[activePair.baseAsset];
    }
  }, [balance, activePair?.baseAsset, activePair?.quoteAsset, side, watchedPrice]);

  const submitOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const price = parseFloat(data.price);
      const amount = parseFloat(data.amount);

      if (!activePair || !balance) {
        throw new Error('Missing activePair or balance data');
      }

      const orderbook = store.get(orderbookAtom);

      if (!orderbook) {
        throw new Error('orderbook not initialized');
      }

      // Post-only logic: only allow maker orders
      if (data.postOnly) {
        if ((side === 'buy' && price >= orderbook.bestAsk) || (side === 'sell' && price <= orderbook.bestBid)) {
          enqueueSnackbar('Post-only limit price must not match the current market. Please adjust your price.', {
            variant: 'warning',
          });
          throw new Error('Post-only limit price must not match the current market');
        }
      }

      if (side === 'buy') {
        const totalCost = price * amount;
        if (balance[activePair.quoteAsset] < totalCost) {
          throw new Error('Insufficient balance');
        }
      } else {
        if (balance[activePair.baseAsset] < amount) {
          throw new Error('Insufficient balance');
        }
      }

      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        side,
        price,
        amount,
        pair: activePair.symbol,
        postOnly: data.postOnly,
        status: 'pending',
        createdAt: Date.now(),
      };

      // add new order
      addOrder(newOrder);

      // update balance
      if (balance && activePair) {
        const newBalance = { ...balance };
        if (side === 'buy') {
          const totalCost = price * amount;
          newBalance[activePair.quoteAsset] = newBalance[activePair.quoteAsset] - totalCost;
        } else {
          newBalance[activePair.baseAsset] = newBalance[activePair.baseAsset] - amount;
        }

        updateAmount(newBalance);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_BALANCE] });
      reset({ ...getValues(), amount: '' });
      console.log('Order submitted successfully:', data);
      enqueueSnackbar('Limit order placed successfully', {
        variant: 'success',
      });
    },
    onError: (error) => {
      console.error('Error submitting order:', error);
    },
  });

  const internalSubmit = (data: FormData) => {
    submitOrderMutation.mutate(data);
  };

  useEffect(() => {
    const unsubscribe = store.sub(orderbookAtom, () => {
      const result = store.get(orderbookAtom);
      if (result && result.symbol === symbol) {
        console.log('Orderbook updated for symbol:', symbol, Number(result.mid.toFixed(2)).toString());

        reset({
          price: Number(result.mid.toFixed(2)).toString(),
        });
        unsubscribe();
      }
    });
  }, [reset, store, symbol]);

  return (
    <form onSubmit={handleSubmit(internalSubmit)} className="flex flex-col gap-4 flex-1">
      {/* Price */}
      <div>
        <Controller
          name="price"
          control={control}
          rules={{
            required: 'Price is required',
            validate: {
              validNumber: (v) => isValidNumber(v) || 'Invalid number',
              positiveNumber: (v) => parseFloat(v) > 0 || 'Must be > 0',
            },
          }}
          render={({ field }) => (
            <AmountInput
              label="Price"
              unit={activePair?.quoteAsset}
              value={field.value}
              onChange={field.onChange}
              step={0.01}
              maxDecimals={2}
              data-testid={`${side}-price-input`}
            />
          )}
        />
        {errors.price && <p className="text-chart-1 text-sm mt-1">{errors.price.message}</p>}
      </div>

      {/* Amount */}
      <div>
        <Controller
          name="amount"
          control={control}
          rules={{
            required: 'Amount is required',
            validate: {
              validNumber: (v) => isValidNumber(v) || 'Invalid number',
              positiveNumber: (v) => parseFloat(v) > 0 || 'Must be > 0',
              maxAmount: (v) => {
                const amountNum = parseFloat(v);
                return amountNum <= maxAmount || `Max Amount is ${maxAmount}`;
              },
            },
          }}
          render={({ field }) => (
            <AmountInput
              label="Amount"
              unit={activePair?.baseAsset}
              value={field.value}
              onChange={field.onChange}
              step={0.0001}
              maxDecimals={4}
              data-testid={`${side}-amount-input`}
            />
          )}
        />
        {errors.amount && <p className="text-chart-1 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      {/* Post-only */}
      <div className="flex items-center space-x-2">
        <Controller
          name="postOnly"
          control={control}
          render={({ field }) => <Checkbox id="postOnly" checked={field.value} onCheckedChange={field.onChange} />}
        />
        <label htmlFor="postOnly" className="text-sm text-white">
          Post-only
        </label>
      </div>

      <AccountInfo side={side} />

      <Button
        disabled={submitOrderMutation.isPending || !activePair || !balance}
        type="submit"
        variant={side === 'buy' ? 'default' : 'destructive'}
        className={cn('w-full mt-8 font-normal cursor-pointer')}
        data-testid={`${side}-submit-button`}
      >
        {side === 'buy' ? 'Buy' : 'Sell'}
      </Button>
    </form>
  );
};
