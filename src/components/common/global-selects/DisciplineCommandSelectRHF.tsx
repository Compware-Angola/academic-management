import { Control, Path, useController } from "react-hook-form";

import { CursoParams } from "@/services/fetch-course";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";
import { useQueryDropdownDisciplines } from "@/hooks/study_plan/use-query-dropdown-disciplines";

interface Props<TForm> {
  control: Control<TForm>;
  name: Path<TForm>;
  label?: string;
  labelMode?: "inside" | "outside";
  params?: CursoParams;
}

export function DisciplineCommandSelectRHF<TForm>({
  control,
  name,
  label = "Disciplina",
  labelMode = "outside",
  params,
}: Props<TForm>) {
  const { field } = useController({
    name,
    control,
  });

  const { data: disciplines = [], isLoading: isLoadingDisciplines } =
    useQueryDropdownDisciplines();

  return (
    <FormCommandSelect
      label={label}
      labelMode={labelMode}
      value={field.value ? String(field.value) : undefined}
      disabled={isLoadingDisciplines}
      isLoading={isLoadingDisciplines}
      width="full"
      options={disciplines}
      map={(c) => ({
        key: c.codigo.toString(),
        value: c.codigo.toString(),
        label: c.desginacao,
      })}
      onChange={(value) => field.onChange(value)}
    />
  );
}
