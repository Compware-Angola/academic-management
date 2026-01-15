import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "../FormSelect";
import { useQueryTiposServico } from "@/hooks/financas/use-query-tipo-service";
import { parseFilter } from "@/util/parse-filter";

interface AcademicYearSelectProps {
  value: string;
  anoLectivo: string;
  onChangeValue(v: string);
}
const ServiceTypeSelect = ({
  onChangeValue,
  value,
  anoLectivo,
}: AcademicYearSelectProps) => {
  const { data: services, isLoading: isLoading } = useQueryTiposServico(
    {
      codigoAnoLectivo: parseFilter(anoLectivo),
    },
    { enabled: !!anoLectivo }
  );
  return (
    <>
      <FormSelect
        disabled={isLoading}
        loading={isLoading}
        label="Tipo de Serviço"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={services}
        map={(a) => ({ key: a.codigo, label: a.descricao, value: a.codigo })}
      />
    </>
  );
};

export { ServiceTypeSelect };
