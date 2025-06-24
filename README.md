## Architecture Diagram

```mermaid
graph TD
  subgraph Pages & Layout
    A1[App Entry\\napp/layout.tsx]
    A2[Main Page\\napp/page.tsx]
    A3[Trade Page\\napp/(main)/trade/[symbol]/page.tsx]
  end

  subgraph Components
    B1[Common Components\\nsrc/components/]
    B2[Orderbook Components\\norderbook/]
    B3[Order Form Components\\nlimit-order/]
    B4[Header/Theme/Providers]
  end

  subgraph State Management
    C1[Atoms (Jotai)\\nsrc/state/atoms/]
    C2[Types\\nsrc/state/atoms/types.ts]
  end

  subgraph Hooks
    D1[useOrderbook]
    D2[useOrders]
    D3[useUserBalance]
    D4[useExchangeAdapter]
    D5[useTradingViewChart]
  end

  subgraph Adapters & Data
    E1[Exchange Adapter\\nsrc/adapters/]
    E2[Binance Implementation\\nadapters/binance/]
    E3[Data Feed\\nlib/data-feed.ts]
    E4[API Endpoints\\napp/api/pairs/]
  end

  subgraph Third-party
    F1[TradingView Chart\\ntv-charting-library]
    F2[Jotai]
    F3[React Query]
    F4[Next.js]
  end

  %% Pages & Components
  A1 --> A2
  A2 --> A3
  A3 --> B1
  B1 --> B2
  B1 --> B3
  B1 --> B4

  %% Components & State
  B1 --> C1
  B2 --> C1
  B3 --> C1

  %% Hooks & State
  D1 --> C1
  D2 --> C1
  D3 --> C1
  D4 --> C1
  D5 --> C1

  %% Hooks & Components
  D1 --> B2
  D2 --> B3
  D3 --> B4
  D4 --> B1
  D5 --> B1

  %% State & Adapter
  C1 --> E1
  E1 --> E2

  %% Adapter & Data
  E1 --> E3
  E3 --> F1
  E1 --> E4

  %% Components & Third-party
  B1 --> F1
  B1 --> F2
  B1 --> F3
  A1 --> F4
```

This diagram shows the main relationships between pages, components, state management, hooks, adapters, API, and third-party libraries in the trading-app frontend.

---

## Getting Started

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


