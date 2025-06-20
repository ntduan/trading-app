'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface TradeTicketProps {
  bestBid: number;
  bestAsk: number;
  availableBalance?: number; // Optional balance display
}

export const TradeTicket: React.FC<TradeTicketProps> = ({ bestBid, bestAsk, availableBalance = 0 }) => {
  const [price, setPrice] = useState<number>(0);
  const [size, setSize] = useState<number | ''>('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [postOnly, setPostOnly] = useState<boolean>(true);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (side === 'buy') setPrice(bestBid);
    else setPrice(bestAsk);
  }, [bestBid, bestAsk, side]);

  const validateOrder = () => {
    if (!size || size <= 0) return 'Quantity is required';
    if (price <= 0) return 'Limit price must be greater than 0';
    if (side === 'buy' && price >= bestAsk) return 'Buy price must be below best ask';
    if (side === 'sell' && price <= bestBid) return 'Sell price must be above best bid';
    if (side === 'buy' && typeof size === 'number' && size * price > availableBalance)
      return 'Insufficient balance to cover total cost';
    return null;
  };

  const submitOrder = () => {
    const errorMsg = validateOrder();
    if (errorMsg) {
      setError(errorMsg);
      return toast.error(errorMsg);
    }
    setError(null);
    setStatus('submitting');
    setTimeout(() => {
      const accepted = Math.random() > 0.5;
      if (accepted) {
        toast.success('Order accepted');
        // Reset form after successful submission
        setSize('');
        setPrice(side === 'buy' ? bestBid : bestAsk);
        setPostOnly(true);
        setSide('buy');
      } else {
        toast.error('Order rejected');
      }
      setStatus('idle');
    }, 200);
  };

  const total = typeof size === 'number' ? (size * price).toFixed(2) : '0';

  return (
    <div className="bg-[#0d1117] text-white p-4 rounded w-full space-y-4">
      <div className="flex gap-2">
        <Button className="flex-1" onClick={() => setSide('buy')} variant={side === 'buy' ? 'default' : 'ghost'}>
          Buy
        </Button>
        <Button className="flex-1" onClick={() => setSide('sell')} variant={side === 'sell' ? 'default' : 'ghost'}>
          Sell
        </Button>
      </div>

      <div className="bg-[#1a1d23] p-3 rounded">
        <div className="text-xs text-gray-400 mb-1">Available balance</div>
        <div className="text-sm font-mono">{availableBalance.toFixed(4)} USD</div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Quantity</label>
        <Input
          type="number"
          className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-sm"
          value={size}
          onChange={(e) => setSize(e.target.value === '' ? '' : Number(e.target.value))}
        />
        {error?.toLowerCase().includes('quantity') && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div className="bg-[#1a1d23] p-3 rounded">
        <label className="block text-xs text-gray-400 mb-1">Limit price</label>
        <div className="text-sm font-mono">{price}</div>
      </div>

      <div className="bg-[#1a1d23] p-3 rounded">
        <label className="block text-xs text-gray-400 mb-1">Total</label>
        <div className="text-sm font-mono">≈ {total} USD</div>
      </div>

      <div className="flex items-center space-x-2 text-xs">
        <Checkbox id="postOnly" checked={postOnly} onCheckedChange={() => setPostOnly(!postOnly)} />
        <label htmlFor="postOnly">Post-only</label>
      </div>

      <Button
        className="w-full rounded text-sm disabled:opacity-50"
        onClick={submitOrder}
        disabled={status === 'submitting'}
      >
        Submit
      </Button>
    </div>
  );
};
