import { type SocketConnection } from './types';

export class SocketManager {
  private connections = new Map<string, SocketConnection>();

  addSocket(key: string, connection: SocketConnection) {
    if (this.connections.has(key)) {
      this.removeSocket(key);
    }
    this.connections.set(key, connection);
  }

  removeSocket(key: string) {
    const connection = this.connections.get(key);
    if (connection) {
      connection.ws.close();
      this.connections.delete(key);
    }
  }

  closeAllSockets() {
    for (const key of this.connections.keys()) {
      this.removeSocket(key);
    }
  }

  getConnection(key: string) {
    return this.connections.get(key);
  }

  getAllConnections() {
    return Array.from(this.connections.entries());
  }
}
