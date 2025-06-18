import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function TradePage() {
  const params = useParams();

  const [base, quote] = useMemo(() => {
    if (!params?.params) return [null, null];
    const parts = Array.isArray(params.params) ? params.params : [params.params];
    return [parts[0] ?? null, parts[1] ?? null];
  }, [params]);

  return (
    <div>
      <h1>Trade Page</h1>
      <p>Base: {base ?? 'None'}</p>
      <p>Quote: {quote ?? 'None'}</p>
    </div>
  );
}
