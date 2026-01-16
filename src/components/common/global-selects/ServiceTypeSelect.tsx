import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "../FormSelect";
import { useQueryTiposServico } from "@/hooks/financas/use-query-tipo-service";
import { parseFilter } from "@/util/parse-filter";
import { useEffect, useState } from "react";
import { TipoServicoItem } from "@/services/financas/fetch-tipo-servico.service";

interface ServiceSelectProps {
  value: string;
  anoLectivo: string;
  allOption?: boolean;
  onChangeValue(v: string);
}
const ServiceTypeSelect = ({
  onChangeValue,
  value,
  anoLectivo,
  allOption,
}: ServiceSelectProps) => {
  const [allServico, setAllService] = useState<TipoServicoItem[]>([]);
  const { data: services = [], isLoading: isLoading } = useQueryTiposServico(
    {
      codigoAnoLectivo: parseFilter(anoLectivo),
    },
    { enabled: !!anoLectivo }
  );
  useEffect(() => {
    if (allOption) {
      setAllService([
        {
          codigo: "all",
          descricao: "Todos",
        } as any,
        ...services,
      ]);
    } else {
      setAllService(services);
    }
  }, [allOption, services]);
  return (
    <>
      <FormSelect
        disabled={isLoading}
        loading={isLoading}
        label="Tipo de Serviço"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={allServico}
        map={(a) => ({ key: a.codigo, label: a.descricao, value: a.codigo })}
      />
    </>
  );
};

export { ServiceTypeSelect };
