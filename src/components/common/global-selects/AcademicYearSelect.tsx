import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "../FormSelect";

interface AcademicYearSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
}
const AcademicYearSelect = ({
  onChangeValue,
  value,
}: AcademicYearSelectProps) => {
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  return (
    <>
      <FormSelect
        disabled={isLoadingAcademicYear}
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
