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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------ Tipos ------------------ */

type MapResult = {
  key: string | number;
  value: string | number;
  label: string;
};

type WidthPreset = "auto" | "sm" | "md" | "lg" | "full";

type LabelMode = "outside" | "inside";

type FormCommandSelectProps<T> = {
  label?: string;
  labelMode?: LabelMode;
  value?: string;
  options?: T[];
  map: (item: T) => MapResult;
  onChange: (value: string) => void;

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
  labelMode = "outside", // 👈 PADRÃO,
  value,
  options = [],
  map,
  onChange,
  placeholder = "Selecionar",
  onSearchChange,
  disabled = false,
  width = "md",
  isLoading = false,
}: FormCommandSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // 🔥 Memorizar o último item selecionado
  const [lastSelectedItem, setLastSelectedItem] = useState<T | null>(null);

  const widthClass = resolveWidthClass(width);

  const selectedItem = options.find(
    (item) => String(map(item).value) === value,
  );

  // 🔥 Atualizar lastSelectedItem quando encontrar na lista
  if (selectedItem && selectedItem !== lastSelectedItem) {
    setLastSelectedItem(selectedItem);
  }

  // 🔥 Usar o item memorizado se não estiver na lista atual
  const displayItem = selectedItem || lastSelectedItem;

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);

    if (!isOpen) {
      setSearchValue("");
      onSearchChange?.("");
    }
  }

  function handleSelect(value: string) {
    onChange(value);
    setOpen(false);

    setSearchValue("");
    onSearchChange?.("");
  }

  return (
    <div className="flex flex-col gap-2">
      

        {/* LABEL EXTERNO: só se mandarem */}
          {label && labelMode === "outside" && (
            <Label>{label}</Label>
          )}



      <Popover open={open} onOpenChange={handleOpenChange} modal>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              widthClass,
            )}
          >
            <span className="truncate">
              {displayItem && map(displayItem).label}

              {!displayItem && labelMode === "inside" && label}

              {!displayItem && labelMode === "outside" && placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={4}
          className={cn("p-0", widthClass)}
        >
          <Command>
            <CommandInput
              autoFocus
              value={searchValue}
              placeholder={
                label ? `Procurar ${label.toLowerCase()}...` : "Procurar..."
              }
              className={widthClass}
              onValueChange={(value) => {
                setSearchValue(value);
                onSearchChange?.(value);
              }}
            />

            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />A pesquisar...
                </div>
              ) : options.length === 0 ? (
                <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
              ) : (
                <CommandGroup>
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
                              : "opacity-0",
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
