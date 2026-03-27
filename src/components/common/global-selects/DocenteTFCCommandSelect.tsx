// components/DocenteCommandSelect.tsximport { useQueryDocentesTfc } from "@/hooks/defesa-tfc/use-query-docente-tfc";
import { useDebounce } from "@/hooks/use-debounce";
import React, { useId, useState } from "react";
import { FormCommandSelect } from "../FormCommandSelect";
import { useQueryDocentesTfc } from "@/hooks/defesa-tfc/use-query-docente-tfc";

interface Props {
  value: string;
  onChangeValue: (v: string) => void;
  params: {
    faculdadeId: number;
  };
  disabled?: boolean;
  label?: string;
  labelMode?: "inside" | "outside";
  enableDefaultSelectItem?: boolean;
}

export const DocenteTFCCommandSelect = (props: Props) => {
  const {
    params,
    value,
    onChangeValue,
    label,
    labelMode,
    enableDefaultSelectItem,
    disabled,
  } = props;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading } = useQueryDocentesTfc({
    faculdadeId: params.faculdadeId,
    search: debouncedSearch,
    page: 1,
    limit: 50,
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
      disabled={disabled || isLoading}
      value={value}
      label={label}
      labelMode={labelMode}
      isLoading={isLoading}
      onSearchChange={(val) => setSearch(val)}
      defaultSelectItem={defaultSelectItem}
      width="full"
      options={data?.data || []}
      map={(f) => ({
        key: f.codigo.toString(),
        value: f.codigo.toString(),
        label: f.nome,
      })}
      onChange={(val) => {
        onChangeValue(val);
        setSearch("");
      }}
    />
  );
};
