import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const resolutionToBinanceInterval = (res: string) => {
  switch (res) {
    case '1':
      return '1m';
    case '5':
      return '5m';
    case '60':
      return '1h';
    case '240':
      return '4h';
    case '1D':
      return '1d';
    default:
      return '1m';
  }
};

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatPrice = (price: number) => price.toFixed(2);

export const formatAmount = (amount: number) => amount.toFixed(4);
