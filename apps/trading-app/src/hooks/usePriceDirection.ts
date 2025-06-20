import { useEffect, useRef, useState } from 'react';

export type PriceDirection = 'up' | 'down' | null;

export function usePriceDirection(currentPrice?: number): PriceDirection {
  const [direction, setDirection] = useState<PriceDirection>(null);
  const lastPrice = useRef<number | null>(null);

  useEffect(() => {
    if (currentPrice == null) return;

    if (lastPrice.current != null) {
      if (currentPrice > lastPrice.current) setDirection('up');
      else if (currentPrice < lastPrice.current) setDirection('down');
    }

    lastPrice.current = currentPrice;
  }, [currentPrice]);

  return direction;
}
