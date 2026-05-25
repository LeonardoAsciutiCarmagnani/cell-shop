import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  className?: string;
  inputId?: string;
};

export function QuantityStepper({
  value,
  max,
  onChange,
  disabled,
  className,
  inputId,
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.max(0, Math.min(max, Math.floor(next)));
  const decrementDisabled = disabled || value <= 0;
  const incrementDisabled = disabled || value >= max;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-input bg-background shadow-sm',
        disabled && 'opacity-60',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-r-none"
        aria-label="Diminuir quantidade"
        onClick={() => onChange(clamp(value - 1))}
        disabled={decrementDisabled}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(clamp(Number(event.target.value)))}
        aria-label="Quantidade"
        className="h-9 w-14 rounded-none border-0 border-x text-center shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-l-none"
        aria-label="Aumentar quantidade"
        onClick={() => onChange(clamp(value + 1))}
        disabled={incrementDisabled}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
