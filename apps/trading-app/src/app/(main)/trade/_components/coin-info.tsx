'use client';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

import Link from 'next/link';

import { useState } from 'react';

import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActiveTradingPairInfo } from '@/hooks/useActiveTradingPairInfo';
import { useAllTradingPairs } from '@/hooks/useAllTradingPairs';

export const CoinInfo = () => {
  const { data: activeTradingPair } = useActiveTradingPairInfo();
  const { data: allTradingPairs } = useAllTradingPairs();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="flex flex-row items-center px-4 py-2 h-20 mt-0.5">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {activeTradingPair ? (
            <div className="flex items-center gap-2 select-none cursor-pointer">
              {activeTradingPair.logoUrl && (
                <Image width={24} height={24} className="rounded-full" src={activeTradingPair.logoUrl} alt="" />
              )}
              <h2 className="text-xl">
                {activeTradingPair.baseAsset}-{activeTradingPair.quoteAsset}
              </h2>
              <ChevronDown
                className={`transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          ) : null}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>All Coins</DropdownMenuLabel>
          <DropdownMenuGroup>
            {allTradingPairs?.map((item) => (
              <Link href={`/trade/${item.symbol}`} key={item.symbol}>
                <DropdownMenuItem className="select-none cursor-pointer">
                  {item.baseAsset}-{item.quoteAsset}
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <input />
      {/* <div className="text-lg">Details about the selected coin will be displayed here.</div> */}
    </Card>
  );
};
