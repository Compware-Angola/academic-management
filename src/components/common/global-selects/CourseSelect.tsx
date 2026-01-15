import { FormSelect } from "../FormSelect";
import { useCursos } from "@/hooks/use-cursos";

interface CourseSelectProps {
  value: string;
  onChangeValue(v: string);
  anoLectivo: string;
}
const CourseSelect = ({
  onChangeValue,
  value,
  anoLectivo,
}: CourseSelectProps) => {
  const { data: cursos, isLoading: loadingCursos } = useCursos();
  return (
    <>
      <FormSelect
        label="Curso"
        value={value}
        disabled={!anoLectivo}
        loading={loadingCursos}
        onChange={(v) => onChangeValue(v)}
        options={cursos}
        map={(c) => ({
          key: c.codigo,
          label: c.designacao,
          value: c.codigo,
        })}
      />
    </>
  );
};

export { CourseSelect };
