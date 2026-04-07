import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { FormSelect } from "../FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useId } from "react";
import { useEstadoMatriculaDropdown } from "@/hooks/registrations/estatisticas";
import { FormCommandSelect } from "../FormCommandSelect";

interface EstadoMatriculaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}
const EstadoMatriculaSelect = ({
  onChangeValue,
  value,
  disabled,
  enableDefaultSelectItem,
}: EstadoMatriculaSelectProps) => {
  const { data: estadoMatricula = [], isLoading: isLoadingEstadoMatricula } =
    useEstadoMatriculaDropdown();

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
      <FormCommandSelect
        disabled={isLoadingEstadoMatricula || disabled}
        defaultSelectItem={defaultSelectItem}
        isLoading={isLoadingEstadoMatricula}
        width="full"
        label="Estado da Matrícula"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={estadoMatricula ?? []}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { EstadoMatriculaSelect };
