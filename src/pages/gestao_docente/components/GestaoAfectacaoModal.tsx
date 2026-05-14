import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast, useToast } from "@/components/ui/use-toast";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
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
import { useQueryCategoriaDocente } from "@/hooks/categoria-docente/use-query-categoria-docente";
import { Button } from "@/components/ui/button";
import { useMutationCreateDocenteAfectacao } from "@/hooks/gestao_docente/use-mutation-create-afectacao";
import { Loader2 } from "lucide-react";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
interface GestaoAfectacaoModalProps {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
}
export const GestaoAfectacaoModal = ({
  isModalOpen,
  setIsModalOpen,
}: GestaoAfectacaoModalProps) => {
  const { mutateAsync, isPending } = useMutationCreateDocenteAfectacao();
  const { data: teachersData = [] } = useQueryTeacther();
  const { data: categoriaDocente = [] } = useQueryCategoriaDocente();
  const [params, setParams] = useState({
    docente: undefined,
    curso: undefined,
    anoCurricular: undefined,
    unidadeCurricular: undefined,
    semestre: undefined,
    categoria: undefined,
    anoLectivo: undefined,
  });
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
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

  const handleSubmit = async () => {
    const payload = {
      anoLectivo: 23,
      docente: params.docente,
      unidadeCurricular: params.unidadeCurricular,
      semestre: params.semestre,
      categoria: params.categoria,
    };
    await mutateAsync(payload, {
      onSuccess: (response) => {
        toast({
          title: "Gestão de Afectação",
          description: "Afectação de  UC criado com sucesso.",
          variant: "default",
        });
        setIsModalOpen();
      },
      onError(error) {
        toast({
          title: "Gestão de Afectação",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };
  const activeAcademicYear = academicYear?.find(
    (year) => year.estado.toLowerCase() === "activo",
  );

  const activeAcademicYearId = activeAcademicYear?.codigo;
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      anoLectivo: activeAcademicYearId?.toString() || "",
    }));
  }, [activeAcademicYearId]);

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
            <FormSelect
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              label="Ano Letivo"
              value={params.anoLectivo}
              onChange={(v) => setParams({ ...params, anoLectivo: v })}
              options={[activeAcademicYear]}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
            <Label>Docente</Label>
            <FormCommandSelect
              width="full"
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
          <div className="space-y-2">
            <Label>Categoria</Label>
            <FormCommandSelect
              width="full"
              value={params.categoria}
              options={categoriaDocente}
              map={(t) => ({ key: t.value, value: t.value, label: t.label })}
              onChange={(codigo) => handleChangeInput("categoria", codigo)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {}}>
              Cancelar
            </Button>
            <Button onClick={() => handleSubmit()}>
              {" "}
              {isPending ? <Loader2 /> : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
