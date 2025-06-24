import { describe, it, expect, vi } from 'vitest';
import { SocketManager } from '../socket-manager';

describe('SocketManager', () => {
  it('can add, get, and remove sockets', () => {
    const manager = new SocketManager();
    const ws = { close: vi.fn() } as any;
    const conn = { ws, type: 'test' };
    manager.addSocket('foo', conn);
    expect(manager.getConnection('foo')).toBe(conn);
    manager.removeSocket('foo');
    expect(manager.getConnection('foo')).toBeUndefined();
    expect(ws.close).toHaveBeenCalled();
  });

  it('can close all sockets', () => {
    const manager = new SocketManager();
    const ws1 = { close: vi.fn() } as any;
    const ws2 = { close: vi.fn() } as any;
    manager.addSocket('a', { ws: ws1, type: 't1' });
    manager.addSocket('b', { ws: ws2, type: 't2' });
    manager.closeAllSockets();
    expect(ws1.close).toHaveBeenCalled();
    expect(ws2.close).toHaveBeenCalled();
    expect(manager.getAllConnections()).toHaveLength(0);
  });
});
