import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import type { FieldValues, Path, Control } from "react-hook-form";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";



type MapResult = {
    key: string | number;
    value: string | number;
    label: string;
};

type CommandInputFormFieldProps<T extends FieldValues, U> = {
    control: Control<T>;
    name: Path<T>;

    label?: string;
    placeholder?: string;
    disabled?: boolean;

    items?: U[];
    map: (item: U) => MapResult;

    isLoading?: boolean;
    width?: "auto" | "sm" | "md" | "lg" | "full";

    onSearchChange?: (value: string) => void;
};

export function CommandInputFormField<T extends FieldValues, U>({
    control,
    name,
    label,
    placeholder,
    disabled,
    items = [],
    map,
    isLoading,
    width = "full",
    onSearchChange,
}: CommandInputFormFieldProps<T, U>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}

                    <FormCommandSelect<U>
                        value={field.value ? String(field.value) : ""}
                        options={items}
                        map={map}
                        isLoading={isLoading}
                        width={width}
                        disabled={disabled}
                        onSearchChange={onSearchChange}
                        placeholder={placeholder}
                        onChange={(val) => {
                            field.onChange(val);
                        }}
                        onBlur={field.onBlur}
                    />

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}