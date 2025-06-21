import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';
import { useUserBalance } from '@/hooks/useUserBalance';

export const AccountInfo = ({ side }: { side: 'buy' | 'sell' }) => {
  const { data: pair } = useActiveTradingPairInfo();
  const { data: balance } = useUserBalance();
  const baseAssetBalance = pair?.baseAsset ? balance?.[pair.baseAsset] : undefined;
  const quoteAssetBalance = pair?.quoteAsset ? balance?.[pair.quoteAsset] : undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between ">
        <div className="text-xs text-muted-foreground capitalize">Available</div>
        <div className="text-xs flex gap-1">
          {pair?.baseAsset ? (
            <>
              <span>{side === 'buy' ? quoteAssetBalance : baseAssetBalance}</span>
              <span>{side === 'buy' ? pair?.quoteAsset : pair?.baseAsset}</span>
            </>
          ) : (
            '--'
          )}
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <div className="text-xs text-muted-foreground capitalize">Current Position</div>
        <div className="text-xs flex gap-1">
          {pair?.baseAsset ? (
            <>
              <span>{baseAssetBalance}</span>
              <span>{pair?.baseAsset}</span>
            </>
          ) : (
            '--'
          )}
        </div>
      </div>
    </div>
  );
};
