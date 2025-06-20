import { cn } from '@/lib/utils';

export function OrderbookMidPrice({ price, direction }: { price: number; direction: 'up' | 'down' | null }) {
  const color = direction === 'up' ? 'text-chart-2' : direction === 'down' ? 'text-chart-1' : 'text-foreground';
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '';

  return (
    <div className="flex px-2 py-2 text-sm font-mono">
      <div className={cn('text-md', color)}>
        {price.toFixed(2)}
        {arrow && <span className="ml-1">{arrow}</span>}
      </div>
      <div className="text-xs text-muted-foreground mt-auto translate-y-[-1px] ml-0.5">(${price.toFixed(2)})</div>
    </div>
  );
}
