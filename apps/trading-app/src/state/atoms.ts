import { atomWithStorage } from 'jotai/utils';

import { STORAGE_KEYS } from '@/consts';

export const activeTradingPairAtom = atomWithStorage(STORAGE_KEYS.ACTIVE_TRADING_PAIR, '');
