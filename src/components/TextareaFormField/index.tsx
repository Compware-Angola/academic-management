import { Input } from "../ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import type { TextareaFormFieldProps } from "./type";
import type { FieldValues } from "react-hook-form";
import { Textarea } from "../ui/textarea";

export function TextareaFormField<T extends FieldValues>(
  props: TextareaFormFieldProps<T>,
) {
  const { control, name, placeholder, label, type, disabled } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="cursor-pointer">{label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
