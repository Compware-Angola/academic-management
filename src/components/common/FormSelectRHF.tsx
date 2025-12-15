import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { FormSelect } from "@/components/common/FormSelect";

type MapResult = {
  value: string | number;
  label: string;
  key: string;
};

type FormSelectRHFProps<TForm extends FieldValues, TOption> = {
  control: Control<TForm>;
  name: Path<TForm>;
  label: string;

  options?: TOption[];
  loading?: boolean;
  disabled?: boolean;

  map: (item: TOption) => MapResult;
};

export function FormSelectRHF<TForm extends FieldValues, TOption>({
  control,
  name,
  label,

  options = [],
  loading,
  disabled,
  map,
}: FormSelectRHFProps<TForm, TOption>) {
  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: "Campo obrigatório",
        validate: (v) => v?.trim().length > 0 || "O campo não pode estar vazio",
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <FormSelect<TOption>
              label=""
              value={field.value || ""}
              options={options}
              loading={loading}
              disabled={disabled}
              onChange={field.onChange}
              map={map}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
