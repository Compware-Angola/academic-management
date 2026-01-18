import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "../FormSelect";

interface AcademicYearSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}
const AcademicYearSelect = ({
  onChangeValue,
  value,
  disabled,
}: AcademicYearSelectProps) => {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  return (
    <>
      <FormSelect
        disabled={isLoadingAcademicYear || disabled}
        loading={isLoadingAcademicYear}
        label="Ano Letivo"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={academicYear}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { AcademicYearSelect };
