import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { FormSelect } from "../FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

interface AnoCurricularSelectProps {
  value: string;
  curso: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}
const AnoCurricularSelect = ({
  onChangeValue,
  curso,
  value,
  disabled,
}: AnoCurricularSelectProps) => {
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso });

  return (
    <>
      <FormSelect
        disabled={isLoadingClasses || disabled}
        loading={isLoadingClasses}
        label="Ano Curricular"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={classes ?? []}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { AnoCurricularSelect };
