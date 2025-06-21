import { ChevronUp, ChevronDown } from 'lucide-react';

interface AmountInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  step?: number;
  unit?: string;
  maxDecimals?: number;
}

function limitDecimals(value: string, maxDecimals = 2): string {
  const [intPart, decPart] = value.split('.');
  if (!decPart) return value;
  return `${intPart}.${decPart.slice(0, maxDecimals)}`;
}

export const AmountInput = ({ label, value, onChange, step = 1, unit = '', maxDecimals = 2 }: AmountInputProps) => {
  const update = (delta: number) => {
    const num = parseFloat(value || '0');
    const next = (num + delta).toFixed(maxDecimals);
    onChange(next);
  };

  return (
    <div className="flex items-center rounded-md border border-border hover:border-primary bg-background text-foreground overflow-hidden">
      {/* Label */}
      <div className="px-3 py-2 text-sm text-[#9ca3af]">{label}</div>

      {/* Input */}
      <input
        type="number"
        value={value}
        min={step}
        step={step}
        onWheel={(e) => e.currentTarget.blur()}
        onChange={(e) => {
          const val = limitDecimals(e.target.value, maxDecimals);
          const numVal = parseFloat(val);
          if (numVal < 0) return;
          onChange(val);
        }}
        className="flex-1 bg-transparent px-3 py-2 text-right font-medium text-white outline-none
          appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:appearance-none
          [-moz-appearance:textfield]"
      />

      <div className="flex items-stretch divide-x divide-border h-10">
        <div className="px-2 flex items-center text-sm font-semibold">{unit}</div>
        <div className="flex flex-col divide-y divide-border">
          <button type="button" className="px-1 h-1/2 hover:bg-[#1f1f1f]" onClick={() => update(step)}>
            <ChevronUp className="w-3 h-3" />
          </button>
          <button type="button" className="px-1 h-1/2 hover:bg-[#1f1f1f]" onClick={() => update(-step)}>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
