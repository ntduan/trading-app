import { type RawOrder } from '../types';
import { ManagedWebSocket } from '../websocket';

import { type Snapshot, type DepthUpdateEvent, type Orderbook } from './types';

export function applyDelta(book: Orderbook, updates: [string, string][]) {
  for (const [price, size] of updates) {
    if (Number(size) === 0) book.delete(price);
    else book.set(price, size);
  }
}

export async function fetchSnapshot(symbol: string): Promise<Snapshot> {
  const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol.toUpperCase()}&limit=1000`);
  return res.json();
}

export function subscribeOrderbook(symbol: string, onRealtimeCallback: (bids: RawOrder[], asks: RawOrder[]) => void) {
  const bids: Orderbook = new Map();
  const asks: Orderbook = new Map();
  let lastUpdateId = 0;
  let snapshotLoaded = false;
  const buffer: DepthUpdateEvent[] = [];

  const ws = new ManagedWebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth@1000ms`);

  // Resync logic: fetch snapshot and replay buffer
  async function resync() {
    snapshotLoaded = false;
    buffer.length = 0;
    bids.clear();
    asks.clear();
    lastUpdateId = 0;

    // Fetch new snapshot
    const snapshot = await fetchSnapshot(symbol);
    for (const [price, size] of snapshot.bids) bids.set(price, size);
    for (const [price, size] of snapshot.asks) asks.set(price, size);
    lastUpdateId = snapshot.lastUpdateId;

    // Replay buffered updates
    for (const patch of buffer) {
      if (patch.u <= lastUpdateId) continue;
      if (patch.U > lastUpdateId + 1) {
        console.warn('[Orderbook] GAP detected in buffer during resync');
        return;
      }
      applyDelta(bids, patch.b);
      applyDelta(asks, patch.a);
      lastUpdateId = patch.u;
    }
    snapshotLoaded = true;
    console.info('[Orderbook] Resync completed successfully');
    onRealtimeCallback(Array.from(bids.entries()), Array.from(asks.entries()));
  }

  ws.addMessageHandler((event) => {
    const data: DepthUpdateEvent = JSON.parse(event.data.toString());

    if (!snapshotLoaded) {
      buffer.push(data);
      return;
    }

    if (data.u <= lastUpdateId) return;
    if (data.U > lastUpdateId + 1) {
      console.warn('[Orderbook] GAP detected, resync needed');
      // Call resync when GAP detected
      resync();
      return;
    }

    applyDelta(bids, data.b);
    applyDelta(asks, data.a);
    lastUpdateId = data.u;

    onRealtimeCallback(Array.from(bids.entries()), Array.from(asks.entries()));
  });

  fetchSnapshot(symbol).then((snapshot) => {
    for (const [price, size] of snapshot.bids) bids.set(price, size);
    for (const [price, size] of snapshot.asks) asks.set(price, size);
    lastUpdateId = snapshot.lastUpdateId;
    for (const patch of buffer) {
      if (patch.u <= lastUpdateId) continue;
      if (patch.U > lastUpdateId + 1) {
        console.warn('[Orderbook] GAP detected in buffer');
        // Call resync if GAP detected in buffer
        resync();
        return;
      }
      applyDelta(bids, patch.b);
      applyDelta(asks, patch.a);
      lastUpdateId = patch.u;
    }
    snapshotLoaded = true;
    onRealtimeCallback(Array.from(bids.entries()), Array.from(asks.entries()));
  });

  return () => ws.close();
}
