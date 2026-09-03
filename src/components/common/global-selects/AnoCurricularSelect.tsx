import { useQueryClassesByCursos } from "@/hooks/classes/use-query-classes-by-cursos";
import { FormSelect } from "../FormSelect";
import { useId } from "react";

interface AnoCurricularSelectProps {
  value: string;
  curso?: string | (string | number)[];
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  label?: string;
}
const AnoCurricularSelect = ({
  onChangeValue,
  curso,
  value,
  disabled,
  enableDefaultSelectItem,
  label = "Ano Curricular",
}: AnoCurricularSelectProps) => {
  const cursos = Array.isArray(curso) ? curso : curso ? [curso] : [];
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassesByCursos(cursos);

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
        label={label}
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={classes ?? []}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { AnoCurricularSelect };
