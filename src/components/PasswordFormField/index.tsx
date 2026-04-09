/* eslint-disable no-useless-escape */
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldValues, Path, Control } from "react-hook-form";

type PasswordFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  showStrength?: boolean;
};

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8 caracteres", ok: password.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(password) },
    {
      label: "Caractere especial",
      ok: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\/\\]/.test(password),
    },
  ];

  const score = checks.filter((c) => c.ok).length;

  const barColor =
    score <= 1
      ? "bg-destructive"
      : score === 2
        ? "bg-amber-500"
        : "bg-green-500";

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= score ? barColor : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map(({ label, ok }) => (
          <span
            key={label}
            className={`text-xs flex items-center gap-1 ${
              ok ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                ok ? "bg-green-500" : "bg-muted-foreground/50"
              }`}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PasswordFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  showStrength = false,
}: PasswordFormFieldProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const value = field.value ?? "";

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  type={show ? "text" : "password"}
                  placeholder={placeholder}
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  tabIndex={-1}
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormControl>

            {showStrength && value && <PasswordStrength password={value} />}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
