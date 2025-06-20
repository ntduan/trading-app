import { atomWithStorage } from 'jotai/utils';

import { STORAGE_KEYS } from '@/constants';

export const activeTradingPairAtom = atomWithStorage(STORAGE_KEYS.ACTIVE_TRADING_PAIR, 'BTCUSDT');
