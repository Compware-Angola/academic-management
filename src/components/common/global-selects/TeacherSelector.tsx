import { useState } from "react";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";

interface TeacherSelectListProps {
  value: string;
  onChangeValue: (v: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  tipoCandidatura?: number;
  enabled?: boolean;
}

const TeacherSelectList = ({
  value,
  onChangeValue,
  tipoCandidatura,
  label = "Docente",
  placeholder = "Selecione um docente...",
  disabled,
  enabled,
}: TeacherSelectListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: teachers = [], isLoading } = useQueryTeacther({
    nome: debouncedSearch || undefined,
    tipoCandidatura,
  });

  return (
    <FormCommandSelect
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChangeValue}
      onSearchChange={setSearchTerm}
      isLoading={isLoading}
      disabled={disabled || isLoading || enabled === false}
      options={teachers}
      width="full"
      map={(teacher) => ({
        key: teacher.codigo,
        value: teacher.codigo.toString(),
        label: teacher.nome,
      })}
    />
  );
};
