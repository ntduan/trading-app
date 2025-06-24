type MessageHandler = (event: MessageEvent) => void;

interface ManagedWebSocketOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

export class ManagedWebSocket {
  ws: WebSocket | null = null;
  private url: string;
  private handlers: Set<MessageHandler> = new Set();
  private retryCount = 0;
  private maxRetries: number;
  private baseDelayMs: number;
  private maxDelayMs: number;
  private closedByUser = false;

  constructor(url: string, options: ManagedWebSocketOptions = {}) {
    this.url = url;
    this.maxRetries = options.maxRetries ?? 10;
    this.baseDelayMs = options.baseDelayMs ?? 1000;
    this.maxDelayMs = options.maxDelayMs ?? 30000;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.retryCount = 0;
    };

    this.ws.onmessage = (event) => {
      for (const handler of this.handlers) handler(event);
    };

    this.ws.onclose = () => {
      if (!this.closedByUser && this.retryCount < this.maxRetries) {
        const delay = Math.min(this.baseDelayMs * 2 ** this.retryCount, this.maxDelayMs);
        setTimeout(() => {
          console.log(`[ManagedWebSocket] Reconnecting to ${this.url} (attempt ${this.retryCount + 1})`);
          this.retryCount++;
          this.connect();
        }, delay);
      }
    };

    this.ws.onerror = () => {
      console.error(`[ManagedWebSocket] Error occurred on ${this.url}`);
      this.ws?.close();
    };
  }

  addMessageHandler(handler: MessageHandler) {
    this.handlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler) {
    this.handlers.delete(handler);
  }

  close() {
    this.closedByUser = true;
    this.ws?.close();
    this.handlers.clear();
  }
}
