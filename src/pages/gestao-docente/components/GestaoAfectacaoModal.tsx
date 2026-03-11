import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";

interface GestaoAfectacaoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}
export const GestaoAfectacaoModal = ({
  isModalOpen,
  setIsModalOpen,
}: GestaoAfectacaoModalProps) => {
  const { toast } = useToast();
  const handleSubmit = async () => {};
  const { data: teachersData = [] } = useQueryTeacther();
  const [params, setParams] = useState({
    docente: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    semestre: "",
  });

  const handleChangeInput = (key: string, v: any) => {
    setParams({
      ...params,
      [key]: v,
    });
  };
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: params.curso,
      semestre: params.semestre,
      classe: params.anoCurricular,
    });
  const canLoadUcs = !!params.curso && !!params.semestre;

  return (
    <>
      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[350px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5" />
              Adicionar Afectação
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Docente</Label>
            <FormCommandSelect
              value={params.docente}
              options={teachersData}
              map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
              onChange={(codigo) => handleChangeInput("docente", codigo)}
            />
          </div>
          <CourseSelect
            value={params.curso}
            onChangeValue={(v) => handleChangeInput("curso", v)}
          />
          <AnoCurricularSelect
            value={params.anoCurricular}
            onChangeValue={(v) => handleChangeInput("anoCurricular", v)}
            curso={params.curso}
          />
          <SemestreSelect
            value={params.semestre}
            onChangeValue={(v) => handleChangeInput("semestre", v)}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Unidade Curricular</label>
            <Select
              value={params.unidadeCurricular}
              onValueChange={(v) => handleChangeInput("unidadeCurricular", v)}
              disabled={!canLoadUcs}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !params.curso
                      ? "Selecione curso"
                      : !params.semestre
                        ? "Selecione semestre"
                        : isLoadingUC
                          ? "Carregando UCs..."
                          : "Selecionar UC"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {unidadesCurriculares.map((uc) => (
                  <SelectItem key={uc.pk} value={uc.pk.toString()}>
                    {uc.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
