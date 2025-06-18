// src/data/binanceAPI.ts
import { type Bar } from 'tv-charting-library';

const resolutionToBinanceInterval = (res: string) => {
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

export const getHistory = async (symbol: string, resolution: string, from: number, to: number): Promise<Bar[]> => {
  const interval = resolutionToBinanceInterval(resolution);
  const limit = 1000; // Binance max
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol.replace('/', '')}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}&limit=${limit}`;

  const res = await fetch(url);
  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((d: any) => ({
    time: d[0],
    low: parseFloat(d[3]),
    high: parseFloat(d[2]),
    open: parseFloat(d[1]),
    close: parseFloat(d[4]),
    volume: parseFloat(d[5]),
  }));
};

// WebSocket Management
const sockets: Record<string, WebSocket> = {};

export const subscribe = (
  symbol: string,
  resolution: string,
  onRealtimeCallback: (bar: Bar) => void,
  subscriberUID: string
) => {
  const interval = resolutionToBinanceInterval(resolution);
  const symbolStr = symbol.replace('/', '').toLowerCase();
  const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbolStr}@kline_${interval}`);

  sockets[subscriberUID] = socket;

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const k = data.k;
    const bar: Bar = {
      time: k.t,
      low: parseFloat(k.l),
      high: parseFloat(k.h),
      open: parseFloat(k.o),
      close: parseFloat(k.c),
      volume: parseFloat(k.v),
    };
    onRealtimeCallback(bar);
  };
};

export const unsubscribe = (subscriberUID: string) => {
  if (sockets[subscriberUID]) {
    sockets[subscriberUID].close();
    delete sockets[subscriberUID];
  }
};
