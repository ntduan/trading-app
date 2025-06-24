import { atom } from 'jotai';

import { binance } from '@/adapters/binance';
import { type IExchangeAdapter } from '@/adapters/types';

const binanceAdapter = binance();
export const exchangeAdapterAtom = atom<IExchangeAdapter>(binanceAdapter);
