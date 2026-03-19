import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "../FormSelect";
import { useId } from "react";

interface AcademicYearSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  onlyActive?: boolean;
}
const AcademicYearSelect = ({
  onChangeValue,
  value,
  disabled,
  enableDefaultSelectItem = false,
  onlyActive = false,
}: AcademicYearSelectProps) => {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const id = useId();
  const defaultSelectItem = enableDefaultSelectItem
    ? [
        {
          label: "Todos",
          value: "all",
          key: id,
        },
      ]
    : undefined;
  return (
    <>
      <FormSelect
        disabled={isLoadingAcademicYear || disabled}
        loading={isLoadingAcademicYear}
        label="Ano Letivo"
        value={value}
        defaultSelectItem={defaultSelectItem}
        onChange={(v) => onChangeValue(v)}
        options={
          onlyActive
            ? academicYear?.filter(
                (a) => a.estado.toLocaleLowerCase() === "activo",
              )
            : academicYear
        }
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { AcademicYearSelect };
