import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { FormCommandSelect } from "../FormCommandSelect";

export function SelectUnidadeCurricularWithFilter({
  value,
  onChangeValue,
 filter,
 isLoading,
  label="Unidade Curricular",
  labelMode="outside",
  disabled
}: {
  value: string;
  isLoading?: boolean;
  onChangeValue: (value: string) => void;
  filter?: {
    curso?: string;
    semestre?: string;
    classe?: string;
  };
  label?: string;
  labelMode?: "inside" | "outside";
  disabled?: boolean;
}) {
    const { data: unidadesCurriculares = [] } = useQueryDisciplinaWithFilter({
    curso: filter?.curso,
    semestre: filter?.semestre,
    classe: filter?.classe,
  });
  return (
    <FormCommandSelect
    value={value}
    options={unidadesCurriculares}
    label={label}
    labelMode={labelMode}
    disabled={disabled}
    isLoading={isLoading}
    width="full"
    map={(uc) => ({
      key: uc.pk.toString(),
      value: uc.pk.toString(),
      label: uc.descricao,
    })}
    onChange={(value) => {
      onChangeValue(value);
    }}
    />
  )
}