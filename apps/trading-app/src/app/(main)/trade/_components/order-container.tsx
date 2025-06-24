'use client';

import { useAtomValue } from 'jotai';
import { SnackbarProvider } from 'notistack';
import { useState } from 'react';

import { LimitOrder } from '@/components/limit-order/limit-order';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { activeTradingPairSymbolAtom } from '@/state/atoms';
export const OrderContainer = () => {
  const [activeTab, setActiveTab] = useState('Spot');
  const [loadedTabs, setLoadedTabs] = useState(new Set(['Spot']));
  const activeTradingPairSymbol = useAtomValue(activeTradingPairSymbolAtom);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLoadedTabs((prev) => new Set([...prev, value]));
  };

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      />
      <Card className="gap-0 py-0">
        <div>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="Spot">Spot</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative h-full">
          <div className={cn('h-full', `${/* v8 ignore next line */ activeTab === 'Spot' ? 'block' : 'hidden'}`)}>
            {loadedTabs.has('Spot') && <LimitOrder symbol={activeTradingPairSymbol} />}
          </div>
        </div>
      </Card>
    </>
  );
};
