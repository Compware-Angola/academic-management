"use client";
type MapResult = {
  key: string | number;
  value: string;
  label: string;
};

type FormMultiSelectProps<T> = {
  label?: string;
  values?: string[];
  options?: T[];
  map: (item: T) => MapResult;
  onChange: (values: string[]) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
};

import { Label } from "@/components/ui/label";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import { Loader2 } from "lucide-react";

export function FormMultiSelect<T>({
  label,
  values = [],
  options = [],
  map,
  onChange,
  loading = false,
  placeholder = "Selecionar",
}: FormMultiSelectProps<T>) {
  return (
    <div className="space-y-2">
      <div>{label && <Label>{label}</Label>}</div>
      <MultiSelect
        values={values ?? []}
        onValuesChange={(vals) => onChange(vals ?? [])}
      >
        <MultiSelectTrigger className="w-full">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              Carregando
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <MultiSelectValue
              placeholder={placeholder}
              overflowBehavior="cutoff"
            />
          )}
        </MultiSelectTrigger>

        <MultiSelectContent>
          <MultiSelectGroup>
            {options.map((item) => {
              const mapped = map(item);
              return (
                <MultiSelectItem key={mapped.key} value={mapped.value}>
                  {mapped.label}
                </MultiSelectItem>
              );
            })}
          </MultiSelectGroup>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  );
}
