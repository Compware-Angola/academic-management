import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type MapResult = {
  key: string | number;
  value: string | number;
  label: string;
};

type FormSelectProps<T> = {
  label: string;
  value?: string;
  options?: T[];
  map: (item: T) => MapResult;
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  defaultSelectItem?: { value: string; label: string; key?: string }[];
};

export function FormSelect<T>({
  label,
  value,
  options = [],
  defaultSelectItem = [],
  map,
  onChange,
  disabled = false,
  loading = false,
}: FormSelectProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <Select value={value} disabled={disabled} onValueChange={onChange}>
        <SelectTrigger>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              Carregando
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <SelectValue placeholder="Selecionar" />
          )}
        </SelectTrigger>

        <SelectContent>
          {defaultSelectItem.map((item) => (
            <SelectItem key={item.key ?? item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
          {options.map((item) => {
            const mapped = map(item);

            return (
              <SelectItem key={mapped.key} value={String(mapped.value)}>
                {mapped.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
