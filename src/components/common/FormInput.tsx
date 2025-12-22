import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type FormInputProps = {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  loading?: boolean;

  onValueChange?: (value: string) => void;

  onDebounce?: (value: string) => void;

  debounceTime?: number;
};

export function FormInput({
  label,
  value = "",
  placeholder,
  type = "text",
  disabled = false,
  loading = false,
  debounceTime = 500,
  onValueChange,
  onDebounce,
}: FormInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (!onDebounce) return;

    const timer = setTimeout(() => {
      onDebounce(internalValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [internalValue, debounceTime, onDebounce]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled || loading}
          value={internalValue}
          onChange={(e) => {
            setInternalValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          className={loading ? "pr-10" : ""}
        />

        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
