import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTeacherByUcAndAcademicYear } from "@/hooks/teacher/use-query-teacher-by-uc";
import { parseFilter } from "@/util/parse-filter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationCreatePermissionLaunch } from "@/hooks/avaliacao/use-mutation-create-permission-launch";
import { AssessmentPermissionPayload } from "@/services/avaliacao/create-permission-launch.service";
import { Loader } from "lucide-react";
import { useQueryModalidade } from "@/hooks/modalidade/use-query-modalidade";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import { useQueryMarkingAssessment } from "@/hooks/avaliacao/use-query-marking-assessment";

type AddPermissionLaunchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddMarkingAssessmentModal({
  isOpen,
  onClose,
}: AddPermissionLaunchModalProps) {
  //Cadastrar Permissão
  const { mutate: createPermission, isPending: isCreateLoadingPermission } =
    useMutationCreatePermissionLaunch();
  // filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    tipoAvaliacao: "",
    docente: "",
    dataInicio: "",
    dataFim: "",
    modalidade: "",
    tipoProva: "",
    horarioId: "",
  });

  const { data: anosAcademicos } = useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: cursos } = useCursos();
  const { data: modalidade = [], isLoading: isLoadingModalidade } =
    useQueryModalidade();
  const { data: docentes, isLoading: isLoadingDocente } =
    useQueryTeacherByUcAndAcademicYear({
      anoLectivo: parseFilter(filters.anoLetivo),
      unidadeCurricular: parseFilter(filters.unidadeCurricular),
    });
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });
  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();
  const { data: tipoProva = [], isLoading: isLoadingTipoProva } =
    useQueryTipoProva();

  const canLoadUcs = !!filters.curso && !!filters.semestre;
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe: filters.anoCurricular,
    });
  const { data: markingResponse, isLoading: loadingMarking } =
    useQueryMarkingAssessment({
      anoLectivo: Number(filters.anoLetivo),
      semestre: Number(filters.semestre),
      periodo: parseFilter(filters.periodo),
      curso: Number(filters.curso),
      tipoAvaliacao: Number(filters.tipoAvaliacao),
      tipoHorario: 1,
      anoCurricular: parseFilter(filters.anoCurricular),
      page: 1,
      limit: 100,
    });
  const closeModal = () => {
    onClose();
  };
  const handleCreatePermission = async () => {
    const payload: AssessmentPermissionPayload = {
      anoLectivo: Number(filters.anoLetivo),
      dataFim: filters.dataFim,
      dataInicio: filters.dataInicio,
      docenteId: Number(filters.docente),
      tipoAvalacaoId: Number(filters.tipoAvaliacao),
      unidadeCurricular: Number(filters.unidadeCurricular),
    };
    createPermission(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!isOpen) return null;
  const markingSchedules = markingResponse?.data || [];
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl">Adicionar Permissões</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Letivo</label>
              <Select
                value={filters.anoLetivo}
                onValueChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {anosAcademicos?.map((a) => (
                    <SelectItem key={a.codigo} value={a.codigo.toString()}>
                      {a.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semestre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select
                value={filters.semestre}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    semestre: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {semestres?.map((s) => (
                    <SelectItem key={s.codigo} value={s.codigo.toString()}>
                      {s.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Curso</label>
              <Select
                value={filters.curso}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    curso: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {cursos?.map((c) => (
                    <SelectItem key={c.codigo} value={c.codigo.toString()}>
                      {c.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ano Curricular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    anoCurricular: v,
                    unidadeCurricular: "",
                  })
                }
                disabled={!filters.curso}
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Selecione curso"} />
                </SelectTrigger>
                <SelectContent>
                  {anosCurriculares.map((ac) => (
                    <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                      {ac.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Unidade Curricular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular</label>
              <Select
                value={filters.unidadeCurricular}
                onValueChange={(v) =>
                  setFilters({ ...filters, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !filters.curso
                        ? "Selecione curso"
                        : !filters.semestre
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
            <FormSelect
              label="Modalidade"
              value={filters.modalidade}
              disabled={isLoadingModalidade}
              onChange={(v) => setFilters({ ...filters, modalidade: v })}
              options={modalidade}
              map={(m) => ({
                key: m.pkModalidade,
                label: m.designacao,
                value: m.pkModalidade,
              })}
              loading={isLoadingModalidade}
            />
            <FormSelect
              label="Tipo de Avaliação"
              value={filters.tipoAvaliacao}
              onChange={(v) => setFilters({ ...filters, tipoAvaliacao: v })}
              options={tipoAvaliacao}
              loading={isLoadingTipoAvaliacao}
              disabled={isLoadingTipoAvaliacao}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
            />
            <FormSelect
              label="Tipo de Prova"
              value={filters.tipoProva}
              disabled={isLoadingTipoProva}
              onChange={(v) => setFilters({ ...filters, tipoProva: v })}
              options={tipoProva}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
              loading={isLoadingTipoProva}
            />
            <FormSelect
              label="Docentes"
              value={filters.docente}
              onChange={(v) => setFilters({ ...filters, docente: v })}
              options={docentes}
              loading={isLoadingDocente}
              disabled={isLoadingDocente && !filters.unidadeCurricular}
              map={(u) => ({
                key: u.codigo_docente,
                label: u.nome_docente,
                value: u.codigo_docente,
              })}
            />
            <FormSelect
              label="Horarios"
              value={filters.horarioId}
              onChange={(v) => setFilters({ ...filters, horarioId: v })}
              options={markingSchedules}
              loading={loadingMarking}
              disabled={loadingMarking && !filters.unidadeCurricular}
              map={(u) => ({
                key: u.codigo_horario,
                label: u.horario,
                value: u.codigo_horario,
              })}
            />
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Input
                type="date"
                placeholder="Data Início"
                value={filters.dataInicio}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dataInicio: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Input
                type="date"
                placeholder="Data Fim"
                value={filters.dataFim}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dataFim: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={closeModal} size="lg">
            Fechar
          </Button>
          <Button
            disabled={isCreateLoadingPermission}
            onClick={handleCreatePermission}
            size="lg"
          >
            {isCreateLoadingPermission ? <Loader /> : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
