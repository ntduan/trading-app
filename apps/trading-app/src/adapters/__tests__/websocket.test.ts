import { describe, it, expect, vi } from 'vitest';
import { ManagedWebSocket } from '../websocket';

global.WebSocket = vi.fn(() => ({
  close: vi.fn(),
  send: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
})) as any;

describe('ManagedWebSocket', () => {
  it('can be constructed and closed', () => {
    const ws = new ManagedWebSocket('ws://test');
    expect(ws).toBeDefined();
    ws.close();
    expect(ws.ws?.close).toBeDefined();
  });

  it('can add and remove message handlers', () => {
    const ws = new ManagedWebSocket('ws://test');
    const handler = vi.fn();
    ws.addMessageHandler(handler);
    ws.removeMessageHandler(handler);
    // No error expected
  });
});
