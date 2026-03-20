import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useToast } from "@/hooks/use-toast";

interface DocenteSelectProps {
  values: string[];
  onChange: (values: string[]) => void;
  max?: number;
  label?: string;
}

export function DocenteVigilanteSelect({
  values,
  onChange,
  max = 2,
  label = "Docentes",
}: DocenteSelectProps) {
  const { toast } = useToast();
  const { data: docentes = [], isLoading } = useQueryTeacther();

  function handleSelect(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
      return;
    }

    if (values.length >= max) {
      toast({
        description: `Só é permitido selecionar no máximo ${max} docentes.`,
        variant: "destructive",
      });
      return;
    }

    onChange([...values, value]);
  }

  return (
    <FormCommandSelect
      label={label}
      value={undefined} // multi-select → não fixa valor único
      options={docentes}
      isLoading={isLoading}
      width="full"
      map={(d) => ({
        key: d.codigo_utilizador,
        value: d.codigo_utilizador.toString(),
        label: d.nome,
      })}
      onChange={handleSelect}
      placeholder={
        values.length > 0
          ? `${values.length} docente(s) selecionado(s)`
          : "Selecionar docentes"
      }
    />
  );
}
