import { useQueryEstudanteFinalista } from "@/hooks/defesa-tfc/use-query-estudante-finalista-tfc";
import { FormCommandSelect } from "../FormCommandSelect";
import { useId, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function EstudanteFinalistaCommandSelect({
  value,
  onChangeValue,
  params,
  disabled,
  label = "Estudantes",
  labelMode = "outside",
  enableDefaultSelectItem,
}: {
  value: string;
  onChangeValue: (v: string) => void;
  params: {
    anoLectivo: number;
    curso: number;
    tipoCandidatura: number;
  };
  disabled?: boolean;
  label?: string;
  labelMode?: "inside" | "outside";
  enableDefaultSelectItem?: boolean;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: estudanteFinalistaResponse, isLoading: loadingEstudantes } =
    useQueryEstudanteFinalista({
      search: debouncedSearch,
      anoLectivo: params?.anoLectivo,
      curso: params?.curso,
      tipoCandidatura: params?.tipoCandidatura,
      limit: 1000,
    });
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
    <FormCommandSelect
      disabled={disabled || loadingEstudantes}
      value={value}
      label={label}
      labelMode={labelMode}
      isLoading={loadingEstudantes}
      onSearchChange={(val) => setSearch(val)}
      defaultSelectItem={defaultSelectItem}
      width="full"
      options={estudanteFinalistaResponse?.data || []}
      map={(f) => ({
        key: f.matricula.toString(),
        value: f.matricula.toString(),
        label: f.nome,
      })}
      onChange={(val) => {
        onChangeValue(val);
        setSearch("");
      }}
    />
  );
}
