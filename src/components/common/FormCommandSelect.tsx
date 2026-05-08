import { useState, useEffect, useRef } from "react";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------ Tipos ------------------ */

type MapResult = {
  key: string | number;
  value: string | number;
  label: string;
};

type WidthPreset = "auto" | "sm" | "md" | "lg" | "full";

export type LabelMode = "outside" | "inside";

type FormCommandSelectProps<T> = {
  label?: string;
  labelMode?: LabelMode;
  value?: string;
  options?: T[];
  map: (item: T) => MapResult;
  onChange: (value: string) => void;
  defaultSelectItem?: MapResult[];
  placeholder?: string;
  onSearchChange?: (value: string) => void;
  disabled?: boolean;
  width?: WidthPreset | string;
  isLoading?: boolean;
};

/* ------------------ Utilitário de largura ------------------ */

function resolveWidthClass(width?: WidthPreset | string) {
  if (!width || width === "md") return "w-64";
  if (width === "sm") return "w-48";
  if (width === "lg") return "w-80";
  if (width === "full") return "w-full";
  if (width === "auto") return "w-auto";
  return width;
}

/* ------------------ Componente ------------------ */

export function FormCommandSelect<T>({
  label,
  labelMode = "outside",
  value,
  options = [],
  map,
  onChange,
  placeholder = "Selecionar",
  defaultSelectItem = [],
  onSearchChange,
  disabled = false,
  width = "md",
  isLoading = false,
}: FormCommandSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Cache do item selecionado — persiste mesmo quando `options` muda por nova busca
  const [cachedSelectedItem, setCachedSelectedItem] = useState<MapResult | undefined>();

  const widthClass = resolveWidthClass(width);

  const allItems = [...defaultSelectItem, ...options.map(map)];

  // Tenta encontrar o item nas options atuais
  const itemFromOptions = allItems.find(
    (item) => String(item.value) === value
  );

  // Sincroniza o cache sempre que o item for encontrado nas options
  useEffect(() => {
    if (itemFromOptions) {
      setCachedSelectedItem(itemFromOptions);
    }
  }, [itemFromOptions?.value]);

  // Se o value foi limpo externamente, limpa o cache também
  useEffect(() => {
    if (!value) {
      setCachedSelectedItem(undefined);
    }
  }, [value]);

  // O item exibido: prioriza o encontrado nas options atuais, depois o cache
  const selectedItem = itemFromOptions ?? cachedSelectedItem;

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchValue("");
      onSearchChange?.("");
    }
  }

  function handleSelect(selectedValue: string) {
    const item = allItems.find((i) => String(i.value) === selectedValue);
    if (item) {
      setCachedSelectedItem(item); // persiste o item mesmo após options mudar
    }
    onChange(selectedValue);
    setOpen(false);
    setSearchValue("");
    onSearchChange?.("");
  }

  return (
    <div className="flex flex-col gap-2">
      {label && labelMode === "outside" && <Label>{label}</Label>}

      <Popover open={open} onOpenChange={handleOpenChange} modal>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              widthClass
            )}
          >
            <span className="truncate">
              {selectedItem
                ? selectedItem.label
                : labelMode === "inside"
                ? label
                : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className={cn("p-0", widthClass)}
          onCloseAutoFocus={(e) => {
            if (labelMode === "outside") e.preventDefault();
          }}
        >
          <Command>
            <CommandInput
              value={searchValue}
              placeholder={
                label ? `Procurar ${label.toLowerCase()}...` : "Procurar..."
              }
              onValueChange={(val) => {
                setSearchValue(val);
                onSearchChange?.(val);
              }}
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> A
                  pesquisar...
                </div>
              ) : options.length === 0 && defaultSelectItem.length === 0 ? (
                <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {defaultSelectItem.map((item) => (
                    <CommandItem
                      key={item.key}
                      value={`${item.label} ${item.value}`}
                      onSelect={() => handleSelect(String(item.value))}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === String(item.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {item.label}
                    </CommandItem>
                  ))}
                  {options.map((item) => {
                    const mapped = map(item);
                    return (
                      <CommandItem
                        key={mapped.key}
                        value={`${mapped.label} ${mapped.value}`}
                        onSelect={() => handleSelect(String(mapped.value))}
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
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}