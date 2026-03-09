import { Control, Path, useController } from "react-hook-form";

import { CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";
import { useQueryDepartamento } from "@/hooks/depatamento/use-query-depardamento";

interface Props<TForm> {
  control: Control<TForm>;
  name: Path<TForm>;
  label?: string;
  labelMode?: "inside" | "outside";
  params?: CursoParams;
}

export function DepartamentoCommandSelectRHF<TForm>({
  control,
  name,
  label = "Departamento",
  labelMode = "outside",
  params,
}: Props<TForm>) {
  const { field } = useController({
    name,
    control,
  });

  const { data: departamentos = [], isLoading: isLoadingDepartamento } =
    useQueryDepartamento();

  return (
    <FormCommandSelect
      label={label}
      labelMode={labelMode}
      value={field.value ? String(field.value) : undefined} // ✅ NORMALIZA
      disabled={isLoadingDepartamento}
      isLoading={isLoadingDepartamento}
      width="full"
      options={departamentos}
      map={(c) => ({
        key: c.codigo.toString(),
        value: c.codigo.toString(),
        label: c.designacao,
      })}
      onChange={(value) => field.onChange(value)} // value já é string
    />
  );
}
