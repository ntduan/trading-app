import { useAtomValue } from 'jotai';

import { useUserBalance } from '@/hooks/useUserBalance';
import { activeTradingPairInfoAtom } from '@/state/atoms';

export const AccountInfo = ({ side }: { side: 'buy' | 'sell' }) => {
  const activePair = useAtomValue(activeTradingPairInfoAtom);
  const { data: balance } = useUserBalance();
  const baseAssetBalance = activePair?.baseAsset ? balance?.[activePair.baseAsset] : undefined;
  const quoteAssetBalance = activePair?.quoteAsset ? balance?.[activePair.quoteAsset] : undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between ">
        <div className="text-xs text-muted-foreground capitalize">Available</div>
        <div className="text-xs flex gap-1">
          {activePair?.baseAsset ? (
            <>
              <span>{side === 'buy' ? quoteAssetBalance : baseAssetBalance}</span>
              <span>{side === 'buy' ? activePair?.quoteAsset : activePair?.baseAsset}</span>
            </>
          ) : (
            '--'
          )}
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <div className="text-xs text-muted-foreground capitalize">Current Position</div>
        <div className="text-xs flex gap-1">
          {activePair?.baseAsset ? (
            <>
              <span>{baseAssetBalance}</span>
              <span>{activePair?.baseAsset}</span>
            </>
          ) : (
            '--'
          )}
        </div>
      </div>
    </div>
  );
};
