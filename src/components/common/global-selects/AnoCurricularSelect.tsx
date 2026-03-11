import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { FormSelect } from "../FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useId } from "react";

interface AnoCurricularSelectProps {
  value: string;
  curso: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}
const AnoCurricularSelect = ({
  onChangeValue,
  curso,
  value,
  disabled,
  enableDefaultSelectItem,
}: AnoCurricularSelectProps) => {
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso });

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
        disabled={isLoadingClasses || disabled}
        defaultSelectItem={defaultSelectItem}
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
