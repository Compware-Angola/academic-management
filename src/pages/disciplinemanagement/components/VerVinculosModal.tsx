import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link2Off, BookOpen, X, Loader2, Info } from "lucide-react";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { parseFilter } from "@/util/parse-filter";
import { useQueryVinculosGrade } from "@/hooks/depatamento/use-query-vinculos-grade";
import { useDesvincularUC } from "@/hooks/depatamento/use-desvincular-uc";
import { useUpdateTemOralTemPratica } from "@/hooks/use-grade-curricular";
import { toast } from "sonner";

interface UcResumo {
  codigo_grade: number;
  unidade_curricular: string;
}

interface Filtro {
  anoLectivo: string;
  tipoCandidatura: string;
  curso: string;
}

const FILTROS_VAZIOS: Filtro = {
  anoLectivo: "",
  tipoCandidatura: "",
  curso: "",
};

interface VerVinculosModalProps {
  open: boolean;
  onClose: () => void;
  uc: UcResumo | null;
}

export function VerVinculosModal({ open, onClose, uc }: VerVinculosModalProps) {
  const [filters, setFilters] = useState<Filtro>(FILTROS_VAZIOS);

  // Estado do dialog de confirmação de desvincular
  const [vinculoSelecionado, setVinculoSelecionado] = useState<{
    codigoVinculo: number;
    nomeCurso: string;
    anoCurricular: string;
    codigoSemestre: number;
  } | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  // Estado do dialog de Detalhes do Plano (Oral / Prática)
  const [vinculoDetalheCodigo, setVinculoDetalheCodigo] = useState<
    number | null
  >(null);

  const temFiltroAtivo =
    !!filters.anoLectivo || !!filters.tipoCandidatura || !!filters.curso;

  const {
    data: vinculosResponse,
    isLoading,
    isFetching,
    refetch: refetchVinculos,
  } = useQueryVinculosGrade({
    codigoGrade: uc?.codigo_grade ?? 0,
    anoLetivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    codigoCurso: filters.curso ? Number(filters.curso) : undefined,
    enabled: open && !!uc && !!filters.anoLectivo,
  });

  const vinculos = vinculosResponse?.vinculos ?? [];

  const vinculoDetalhe =
    vinculos.find((v) => v.codigoVinculo === vinculoDetalheCodigo) ?? null;

  const { mutate: desvincular, isPending: isDesvinculando } = useDesvincularUC({
    onSuccess: () => {
      setVinculoSelecionado(null);
      setConfirmado(false);
    },
  });

  const { mutate: updateTemOralTemPratica, isPending: updatingPlanoExtras } =
    useUpdateTemOralTemPratica();

  const handleClose = () => {
    setFilters(FILTROS_VAZIOS);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters(FILTROS_VAZIOS);
  };

  const handleAbrirConfirmacao = (v: (typeof vinculos)[number]) => {
    setConfirmado(false);
    setVinculoSelecionado({
      codigoVinculo: v.codigoVinculo,
      nomeCurso: v.nomeCurso,
      anoCurricular: v.anoCurricular,
      codigoSemestre: v.codigoSemestre,
    });
  };

  const handleFecharConfirmacao = () => {
    if (isDesvinculando) return;
    setVinculoSelecionado(null);
    setConfirmado(false);
  };

  const handleConfirmarDesvinculo = () => {
    if (!vinculoSelecionado || !confirmado) return;
    desvincular(vinculoSelecionado.codigoVinculo);
  };

  const handleAbrirDetalhes = (v: (typeof vinculos)[number]) => {
    setVinculoDetalheCodigo(v.codigoVinculo);
  };

  const handleFecharDetalhes = () => {
    setVinculoDetalheCodigo(null);
  };

  const handleToggleOral = (checked: boolean) => {
    if (!vinculoDetalhe) return;
    // Oral e Prática são mutuamente exclusivas: activar uma desactiva a outra.
    if (checked && vinculoDetalhe.temPratica) {
      toast.info("Prática desativada automaticamente", {
        description:
          "Um vínculo não pode ter Oral e Prática activas ao mesmo tempo.",
      });
    }
    updateTemOralTemPratica(
      {
        codigo: vinculoDetalhe.codigoPlanoGrade,
        temOral: checked,
      },
      { onSuccess: () => refetchVinculos() },
    );
  };

  const handleTogglePratica = (checked: boolean) => {
    if (!vinculoDetalhe) return;
    // Oral e Prática são mutuamente exclusivas: activar uma desactiva a outra.
    if (checked && vinculoDetalhe.temOral) {
      toast.info("Oral desativada automaticamente", {
        description:
          "Um vínculo não pode ter Oral e Prática activas ao mesmo tempo.",
      });
    }
    updateTemOralTemPratica(
      {
        codigo: vinculoDetalhe.codigoPlanoGrade,
        temPratica: checked,
      },
      { onSuccess: () => refetchVinculos() },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-4xl!">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle>Vínculos da Disciplina</DialogTitle>
                <DialogDescription className="mt-0.5">
                  Consulte os cursos e classes onde esta disciplina está
                  vinculada.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {uc && (
            <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium truncate">
                {uc.unidade_curricular}
              </span>
              <Badge variant="outline" className="ml-auto shrink-0">
                {uc.codigo_grade}
              </Badge>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="grid flex-1 grid-cols-3 gap-3">
              <TipoCandidaturaSelect
                value={filters.tipoCandidatura?.toString()}
                onChangeValue={(v) =>
                  setFilters({
                    ...filters,
                    tipoCandidatura: v,
                  })
                }
              />
              <AcademicYearsAvailableForOperationSelect
                label="Ano Letivo"
                value={filters.anoLectivo}
                onChangeValue={(v) =>
                  setFilters({
                    ...filters,
                    anoLectivo: v,
                  })
                }
                tipoCandidaturaId={parseFilter(filters.tipoCandidatura) ?? 1}
                onlyConfigurable={false}
              />
              <CourseSelect
                params={{
                  tipoCandidaturaId: parseFilter(filters.tipoCandidatura) ?? 1,
                }}
                value={filters.curso}
                onChangeValue={(v) =>
                  setFilters({
                    ...filters,
                    curso: v,
                  })
                }
              />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!temFiltroAtivo}
              onClick={handleClearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>

          <div className="flex flex-col gap-3 py-1">
            {!filters.anoLectivo ? (
              <div className="text-center py-14 border rounded-md">
                <p className="text-sm text-muted-foreground">
                  Selecione o ano letivo para ver os vínculos
                </p>
              </div>
            ) : isLoading || isFetching ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : vinculos.length === 0 ? (
              <div className="text-center py-14 border rounded-md">
                <Link2Off className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum vínculo encontrado para este ano letivo
                </p>
              </div>
            ) : (
              <div className="rounded-md border max-h-[420px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Ano Curricular</TableHead>
                      <TableHead>Semestre</TableHead>
                      <TableHead className="w-[1%] text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vinculos.map((v, idx) => (
                      <TableRow
                        key={`${v.codigoCurso}-${v.codigoClasse}-${v.codigoSemestre}-${idx}`}
                      >
                        <TableCell className="font-medium">
                          {v.nomeCurso}
                        </TableCell>
                        <TableCell>{v.anoCurricular}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {v.codigoSemestre}º Semestre
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:bg-accent hover:text-foreground"
                              onClick={() => handleAbrirDetalhes(v)}
                              title="Ver detalhes do plano"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleAbrirConfirmacao(v)}
                              title="Desvincular"
                            >
                              <Link2Off className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {vinculosResponse && filters.anoLectivo && (
              <p className="text-xs text-muted-foreground text-right">
                {vinculosResponse.total} vínculo(s) encontrado(s)
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detalhes do plano (Oral / Prática) */}
      <Dialog
        open={!!vinculoDetalhe}
        onOpenChange={(v) => !v && handleFecharDetalhes()}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              Detalhes do Plano
            </DialogTitle>
            <DialogDescription>
              Informações do vínculo e configuração das avaliações de excepção.
            </DialogDescription>
          </DialogHeader>

          {vinculoDetalhe && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border p-4">
                <div className="col-span-2 space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Curso
                  </p>
                  <p className="text-sm font-medium">
                    {vinculoDetalhe.nomeCurso}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Ano Curricular
                  </p>
                  <p className="text-sm">{vinculoDetalhe.anoCurricular}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Semestre
                  </p>
                  <Badge variant="outline">
                    {vinculoDetalhe.codigoSemestre}º Semestre
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Avaliações de Excepção
                </h4>

                <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="vinculo-ativar-oral"
                      className="text-sm cursor-pointer"
                    >
                      Ativar Oral
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Este vínculo passa a exigir prova oral (Aguarda Oral /
                      Oral de Recurso).
                    </p>
                  </div>
                  <Switch
                    id="vinculo-ativar-oral"
                    checked={vinculoDetalhe.temOral}
                    onCheckedChange={handleToggleOral}
                    disabled={updatingPlanoExtras}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="vinculo-ativar-pratica"
                      className="text-sm cursor-pointer"
                    >
                      Ativar Prática
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Este vínculo passa a exigir componente prática (Aguarda
                      Nota da Prática).
                    </p>
                  </div>
                  <Switch
                    id="vinculo-ativar-pratica"
                    checked={vinculoDetalhe.temPratica}
                    onCheckedChange={handleTogglePratica}
                    disabled={updatingPlanoExtras}
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleFecharDetalhes}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de desvincular */}
      <AlertDialog
        open={!!vinculoSelecionado}
        onOpenChange={(v) => !v && handleFecharConfirmacao()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Link2Off className="h-4 w-4 text-destructive" />
              Desvincular unidade curricular
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação vai remover o vínculo desta disciplina com{" "}
              <span className="font-medium text-foreground">
                {vinculoSelecionado?.nomeCurso}
              </span>{" "}
              ({vinculoSelecionado?.anoCurricular},{" "}
              {vinculoSelecionado?.codigoSemestre}º semestre). Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <Label
              htmlFor="confirmar-desvinculo"
              className="text-sm cursor-pointer"
            >
              Confirmo que desejo remover este vínculo
            </Label>
            <Switch
              id="confirmar-desvinculo"
              checked={confirmado}
              onCheckedChange={setConfirmado}
              disabled={isDesvinculando}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleFecharConfirmacao}
              disabled={isDesvinculando}
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={!confirmado || isDesvinculando}
              onClick={handleConfirmarDesvinculo}
            >
              {isDesvinculando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Desvinculando...
                </>
              ) : (
                "Desvincular"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
