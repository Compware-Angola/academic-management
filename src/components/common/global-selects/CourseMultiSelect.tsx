import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryDropdownDisciplines } from "@/hooks/study_plan/use-query-dropdown-disciplines";

interface CourseMultiSelectProps {
  values: string[];
  onChange: (values: string[]) => void;

  label?: string;
}

export function CourseMultiSelect({
  values,
  onChange,
  label = "Cursos",
}: CourseMultiSelectProps) {
  const { data: disciplines = [], isLoading: isLoadingDisciplines } =
    useQueryDropdownDisciplines();

  function handleSelect(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
      return;
    }

    onChange([...values, value]);
  }

  return (
    <FormCommandSelect
      label={label}
      value={undefined} // multi-select → não fixa valor único
      options={disciplines}
      isLoading={isLoadingDisciplines}
      width="full"
      map={(d) => ({
        key: d.codigo,
        value: d.codigo.toString(),
        label: d.desginacao,
      })}
      onChange={handleSelect}
      placeholder={
        values.length > 0
          ? `${values.length} Cursos(s) selecionado(s)`
          : "Selecionar Cursos"
      }
    />
  );
}
