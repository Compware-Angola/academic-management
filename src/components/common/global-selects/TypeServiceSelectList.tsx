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
  type?: "EXCEPTION";
}

const TypeServiceSelectList = ({
  onChangeValue,
  value,
  label = "Tipo de Serviço",
  placeholder = "Selecione um serviço...",
  type,
  disabled,
}: TypeServiceSelectListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: services = [], isLoading } = useQueryTiposServico(
    {
      descricao: debouncedSearch || undefined,
      estado: "Ativo",
    },
    { enabled: true },
  );
  const EXCEPTION_SIGLA = ["IpuC", "IpuCricular(Anual)", "TdM", "PROP"];

  const filteredServices =
    type === "EXCEPTION"
      ? services.filter((service) => !EXCEPTION_SIGLA.includes(service.sigla))
      : services;

  return (
    <FormCommandSelect
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChangeValue}
      onSearchChange={setSearchTerm}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      options={filteredServices}
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
