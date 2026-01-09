import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MapResult = {
  key: string | number;
  value: string | number;
  label: string;
};

type FormCommandSelectProps<T> = {
  placeholder?: string;
  label: string;
  value?: string;
  options?: T[];
  map: (item: T) => MapResult;
  onChange: (value: string) => void;
  onSearchChange?: (value: string) => void;
  disabled?: boolean;
};

export function FormCommandSelect<T>({
  label,
  value,
  options = [],
  map,
  onChange,
  disabled = false,
  placeholder = "Selecionar",
  onSearchChange,
}: FormCommandSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedItem = options.find(
    (item) => String(map(item).value) === value
  );

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}

      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center min-w-40! justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            )}
          >
            <span className="truncate">
              {selectedItem ? map(selectedItem).label : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-[var(--radix-popover-trigger-width)]  p-0"
        >
          <Command>
            <CommandInput
              placeholder={`Procurar ${label.toLowerCase()}...`}
              autoFocus
              onValueChange={(value) => {
                onSearchChange?.(value);
              }}
            />
            <CommandList>
              <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => {
                  const mapped = map(item);
                  return (
                    <CommandItem
                      key={mapped.key}
                      value={`${mapped.label} ${mapped.value}`}
                      onSelect={() => {
                        onChange(String(mapped.value));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === String(mapped.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {mapped.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
