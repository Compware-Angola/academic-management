import { useQueryTiposServico } from "@/hooks/financas/use-query-tipo-service";
import { useState } from "react";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDebounce } from "@/hooks/use-debounce";

interface TypeServiceSelectListProps {
  value: string;
  onChangeValue: (v: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const TypeServiceSelectList = ({
  onChangeValue,
  value,
  label = "Tipo de Serviço",
  placeholder = "Selecione um serviço...",
  disabled,
}: TypeServiceSelectListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: services = [], isLoading } = useQueryTiposServico(
    {
      descricao: debouncedSearch || undefined,
      estado: "Ativo",
    },
    { enabled: true }
  );

  return (
    <FormCommandSelect
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChangeValue}
      onSearchChange={setSearchTerm}
      isLoading={isLoading}
      disabled={disabled}
      options={services}
      width="full"
      map={(service) => ({
        key: service.codigo.toString(),
        value: service.codigo.toString(),
        label: service.descricao,
      })}
    />
  );
};

export { TypeServiceSelectList };
