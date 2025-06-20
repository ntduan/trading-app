import { TradingInterface } from './_components/trading-interface';

export default async function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TradingInterface />
      {children}
    </>
  );
}
