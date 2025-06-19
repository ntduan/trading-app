import { Card } from '@/components/ui/card';

export const CoinInfo = ({ symbol }: { symbol: string }) => {
  return (
    <Card className="m-1">
      <h2 className="text-2xl font-bold mb-4">{symbol}</h2>
      <p className="text-lg">Details about the selected coin will be displayed here.</p>
    </Card>
  );
};
