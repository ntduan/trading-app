import { ChevronUp, ChevronDown } from 'lucide-react';

export function PriceInput({
  value,
  onChange,
  step = 1,
}: {
  value: number;
  onChange: (val: number) => void;
  step?: number;
}) {
  return (
    <div className="flex items-center rounded-md border border-[#3c3c3c] bg-[#16191e] text-white overflow-hidden">
      <div className="px-3 py-2 text-sm text-[#9ca3af]">Price</div>

      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 bg-transparent px-3 py-2 text-right font-medium text-white outline-none appearance-none"
      />

      <div className="flex items-stretch divide-x divide-[#3c3c3c] border-l border-[#3c3c3c]">
        <div className="px-2 flex items-center text-sm font-semibold">USDT</div>
        <div className="flex flex-col">
          <button className="px-1 h-1/2 hover:bg-[#1f1f1f]" onClick={() => onChange(value + step)}>
            <ChevronUp className="w-3 h-3" />
          </button>
          <button className="px-1 h-1/2 hover:bg-[#1f1f1f]" onClick={() => onChange(value - step)}>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
