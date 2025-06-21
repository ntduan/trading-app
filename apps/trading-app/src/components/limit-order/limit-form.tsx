'use client';

import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { AmountInput } from '../amount-input/amount-input';

import { AccountInfo } from './account-info';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';
import { useUserBalance } from '@/hooks/useUserBalance';
import { cn } from '@/lib/utils';
import { _amountAtom, _ordersAtom, type Order } from '@/state/atoms';

type LimitFormFormProps = {
  side: 'buy' | 'sell';
  onSubmit?: (data: { price: string; amount: string; postOnly: boolean; side: 'buy' | 'sell' }) => void;
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

export const LimitForm = ({ side }: LimitFormFormProps) => {
  const { data: pair } = useActiveTradingPairInfo();
  const { data: balance, refetch } = useUserBalance();
  const updateAmount = useSetAtom(_amountAtom);
  const addOrder = useSetAtom(_ordersAtom);

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
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
    if (!balance || !pair?.quoteAsset) return 0;
    if (side === 'buy') {
      const priceNum = parseFloat(watchedPrice);
      if (!priceNum || priceNum <= 0) return 0;
      return Number((balance[pair.quoteAsset] / priceNum).toFixed(4));
    } else {
      return balance[pair.baseAsset];
    }
  }, [balance, pair?.baseAsset, pair?.quoteAsset, side, watchedPrice]);

  const submitOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const price = parseFloat(data.price);
      const amount = parseFloat(data.amount);

      if (!pair || !balance) {
        throw new Error('Missing pair or balance data');
      }

      if (side === 'buy') {
        const totalCost = price * amount;
        if (balance[pair.quoteAsset] < totalCost) {
          throw new Error('Insufficient balance');
        }
      } else {
        if (balance[pair.baseAsset] < amount) {
          throw new Error('Insufficient balance');
        }
      }

      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        side,
        price,
        amount,
        pair: pair.symbol,
        postOnly: data.postOnly,
        status: 'pending',
        createdAt: Date.now(),
      };

      // add new order
      addOrder(newOrder);

      // update balance
      if (balance && pair) {
        const newBalance = { ...balance };
        if (side === 'buy') {
          const totalCost = price * amount;
          newBalance[pair.quoteAsset] = Math.max(0, newBalance[pair.quoteAsset] - totalCost);
        } else {
          newBalance[pair.baseAsset] = Math.max(0, newBalance[pair.baseAsset] - amount);
        }

        updateAmount(newBalance);
      }
    },
    onSuccess: (data) => {
      refetch();
      reset();
      console.log('Order submitted successfully:', data);
      enqueueSnackbar('That was easy!');
    },
    onError: (error) => {
      console.error('Error submitting order:', error);
    },
  });

  const internalSubmit = (data: FormData) => {
    submitOrderMutation.mutate(data);
  };

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
              unit={pair?.quoteAsset}
              value={field.value}
              onChange={field.onChange}
              step={0.01}
              maxDecimals={2}
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
              unit={pair?.baseAsset}
              value={field.value}
              onChange={field.onChange}
              step={0.0001}
              maxDecimals={4}
            />
          )}
        />
        {errors.amount && <p className="text-chart-1 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      {/* Post-only */}
      <div className="flex items-center space-x-2">
        <Checkbox id="postOnly" {...register('postOnly')} />
        <label htmlFor="postOnly" className="text-sm text-white">
          Post-only
        </label>
      </div>

      <AccountInfo side={side} />

      <Button
        disabled={submitOrderMutation.isPending || !pair || !balance}
        type="submit"
        variant={side === 'buy' ? 'default' : 'destructive'}
        className={cn('w-full mt-8 font-normal cursor-pointer')}
      >
        {side === 'buy' ? 'Buy' : 'Sell'}
      </Button>
    </form>
  );
};
