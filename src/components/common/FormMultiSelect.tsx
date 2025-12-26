import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown } from "lucide-react";

type MapResult = {
  key: string | number;
  value: string;
  label: string;
};

type FormMultiSelectProps<T> = {
  label?: string;
  value?: string[];
  options?: T[];
  map: (item: T) => MapResult;
  onChange: (values: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
  maxVisibleLabels?: number;
};

export function FormMultiSelect<T>({
  label,
  value = [],
  options = [],
  map,
  onChange,
  disabled = false,
  loading = false,
  maxVisibleLabels = 2,
}: FormMultiSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedOptions = options
    .map(map)
    .filter((o) => value.includes(o.value));

  const visibleLabels = selectedOptions
    .slice(0, maxVisibleLabels)
    .map((o) => o.label);

  const extraCount = selectedOptions.length - visibleLabels.length;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full justify-between text-left"
          >
            {loading ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                Carregando <Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : selectedOptions.length ? (
              <span className="truncate">
                {visibleLabels.join(", ")}
                {extraCount > 0 && ` +${extraCount}`}
              </span>
            ) : (
              <span className="text-muted-foreground">Selecionar</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-2 space-y-2 max-h-64 overflow-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />A carregar...
            </div>
          ) : options.length === 0 ? (
            <div className="py-4 text-sm text-muted-foreground text-center">
              Sem opções
            </div>
          ) : (
            options.map((item) => {
              const mapped = map(item);
              const checked = value.includes(mapped.value);

              return (
                <label
                  key={mapped.key}
                  className="flex items-center gap-2 cursor-pointer rounded px-2 py-1 hover:bg-muted"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleValue(mapped.value)}
                  />
                  <span className="text-sm">{mapped.label}</span>
                </label>
              );
            })
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
