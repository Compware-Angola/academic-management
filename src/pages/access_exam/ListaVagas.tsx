import { ReactNode, useEffect, useMemo, useState } from "react";
import { Edit, Loader2, Trash2 } from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteVaga } from "@/hooks/access_exam/use-delete-vaga";
import { useListarVagas } from "@/hooks/access_exam/use-listar-vagas";
import { useUpdateVaga } from "@/hooks/access_exam/use-update-vaga";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import { type Vaga } from "@/services/access_exam/listar-vagas.service";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

const PAGE_SIZE = 10;

type ListaVagasProps = {
  onExportActionsChange?: (actions: ReactNode) => void;
};

function parseFilter(value: string) {
  return value === "all" ? undefined : Number(value);
}

export function ListaVagas({ onExportActionsChange }: ListaVagasProps) {
  const [cursoId, setCursoId] = useState("all");
  const [periodoId, setPeriodoId] = useState("all");
  const [anoLetivoId, setAnoLetivoId] = useState("all");
  const [page, setPage] = useState(1);
  const [vagaEmEdicao, setVagaEmEdicao] = useState<Vaga | null>(null);
  const [vagaParaRemover, setVagaParaRemover] = useState<Vaga | null>(null);
  const [editForm, setEditForm] = useState({
    cursoId: "",
    periodoId: "",
    anoLetivoId: "",
    numVagas: "",
    cursosOpcionais: "",
  });

  const { data: cursos = [], isLoading: isLoadingCursos } = useCursos();
  const { data: periodos = [], isLoading: isLoadingPeriodos } =
    useQueryPeriod();
  const { data: anosLetivos = [], isLoading: isLoadingAnosLetivos } =
    useQueryAnoAcademico();

  const { data, isLoading, isError } = useListarVagas({
    cursoId: parseFilter(cursoId),
    periodoId: parseFilter(periodoId),
    anoLetivoId: parseFilter(anoLetivoId),
    page,
    limit: PAGE_SIZE,
  });

  const vagas = data?.data ?? [];
  const pagination = data?.pagination;
  const updateVaga = useUpdateVaga();
  const deleteVaga = useDeleteVaga();

  const exportRows = useMemo(
    () =>
      vagas.map((vaga) => ({
        curso: vaga.curso,
        periodo: vaga.periodo,
        anoLectivo: vaga.ano_lectivo,
        totalVagas: vaga.num_vagas,
        vagasDisponiveis: vaga.vagas_disponiveis,
        cursosOpcionais: vaga.cursosopcionais ?? "-",
      })),
    [vagas]
  );

  const filtrosExportacao = [
    cursoId !== "all" ? `Curso: ${cursoId}` : null,
    periodoId !== "all" ? `Período: ${periodoId}` : null,
    anoLetivoId !== "all" ? `Ano lectivo: ${anoLetivoId}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  const pdfContent = exportRows.length ? (
    <GenericPDFDocument
      documentTitle="Listagem de Vagas"
      subtitle="Vagas configuradas por curso, período e ano lectivo"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: filtrosExportacao || "Sem filtros",
        },
        {
          title: "Resumo",
          content: [`Total de registos: ${pagination?.total ?? exportRows.length}`],
        },
      ]}
      mainTable={{
        headers: [
          { key: "curso", label: "Curso", width: "26%" },
          { key: "periodo", label: "Período", width: "14%" },
          { key: "anoLectivo", label: "Ano lectivo", width: "14%" },
          { key: "totalVagas", label: "Total", width: "10%" },
          { key: "vagasDisponiveis", label: "Disponíveis", width: "12%" },
          { key: "cursosOpcionais", label: "Cursos opcionais", width: "24%" },
        ],
        rows: exportRows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = exportRows.length
    ? {
        documentTitle: "Listagem de Vagas",
        subtitle: "Vagas configuradas por curso, período e ano lectivo",
        infoSections: [
          {
            title: "Filtros Aplicados",
            content: filtrosExportacao || "Sem filtros",
          },
          {
            title: "Resumo",
            content: [`Total de registos: ${pagination?.total ?? exportRows.length}`],
          },
        ],
        mainTable: {
          headers: [
            { key: "curso", label: "Curso", width: 35 },
            { key: "periodo", label: "Período", width: 18 },
            { key: "anoLectivo", label: "Ano lectivo", width: 18 },
            { key: "totalVagas", label: "Total", width: 12 },
            { key: "vagasDisponiveis", label: "Disponíveis", width: 16 },
            { key: "cursosOpcionais", label: "Cursos opcionais", width: 30 },
          ],
          rows: exportRows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Listagem_Vagas_${new Date().toISOString().slice(0, 10)}`;

  const exportActions =
    pdfContent || excelProps ? (
      <div className="flex flex-wrap justify-end gap-2">
        {pdfContent && (
          <PDFActions
            document={pdfContent}
            fileName={`${baseFileName}.pdf`}
            showDownload
            showPrint
          />
        )}

        {excelProps && (
          <ExcelActions
            excelProps={excelProps}
            fileName={`${baseFileName}.xlsx`}
            showDownload
          />
        )}
      </div>
    ) : null;

  useEffect(() => {
    onExportActionsChange?.(exportActions);

    return () => {
      onExportActionsChange?.(null);
    };
  }, [exportActions, onExportActionsChange]);

  function handleFilterChange(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  function openEditDialog(vaga: Vaga) {
    setVagaEmEdicao(vaga);
    setEditForm({
      cursoId: String(vaga.curso_id),
      periodoId: String(vaga.periodo_id),
      anoLetivoId: String(vaga.ano_lectivo_id),
      numVagas: String(vaga.num_vagas),
      cursosOpcionais: vaga.cursosopcionais ?? "",
    });
  }

  function handleUpdate() {
    if (!vagaEmEdicao) {
      return;
    }

    updateVaga.mutate(
      {
        id: vagaEmEdicao.id,
        payload: {
          cursoId: Number(editForm.cursoId),
          periodoId: Number(editForm.periodoId),
          anoLetivoId: Number(editForm.anoLetivoId),
          numVagas: Number(editForm.numVagas),
          cursosOpcionais: editForm.cursosOpcionais.trim() || undefined,
        },
      },
      {
        onSuccess: () => setVagaEmEdicao(null),
      }
    );
  }

  function handleDelete() {
    if (!vagaParaRemover) {
      return;
    }

    deleteVaga.mutate(vagaParaRemover.id, {
      onSuccess: () => setVagaParaRemover(null),
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <FormSelect
            label="Curso"
            value={cursoId}
            onChange={(value) => handleFilterChange(setCursoId, value)}
            options={cursos}
            loading={isLoadingCursos}
            defaultSelectItem={[{ value: "all", label: "Todos" }]}
            map={(curso) => ({
              key: curso.codigo,
              value: curso.codigo,
              label: curso.designacao,
            })}
          />

          <FormSelect
            label="Período"
            value={periodoId}
            onChange={(value) => handleFilterChange(setPeriodoId, value)}
            options={periodos}
            loading={isLoadingPeriodos}
            defaultSelectItem={[{ value: "all", label: "Todos" }]}
            map={(periodo) => ({
              key: periodo.codigo,
              value: periodo.codigo,
              label: periodo.designacao,
            })}
          />

          <FormSelect
            label="Ano lectivo"
            value={anoLetivoId}
            onChange={(value) => handleFilterChange(setAnoLetivoId, value)}
            options={anosLetivos}
            loading={isLoadingAnosLetivos}
            defaultSelectItem={[{ value: "all", label: "Todos" }]}
            map={(anoLetivo) => ({
              key: anoLetivo.codigo,
              value: anoLetivo.codigo,
              label: anoLetivo.designacao,
            })}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Erro ao carregar vagas.</p>
        ) : vagas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma vaga encontrada.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Ano lectivo</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Disponíveis</TableHead>
                
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vagas.map((vaga) => (
                <TableRow key={vaga.id}>
                  <TableCell>{vaga.curso}</TableCell>
                  <TableCell>{vaga.periodo}</TableCell>
                  <TableCell>{vaga.ano_lectivo}</TableCell>
                  <TableCell>{vaga.num_vagas}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vaga.vagas_disponiveis}</Badge>
                  </TableCell>
            
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(vaga)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => setVagaParaRemover(vaga)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Próxima
            </Button>
          </div>
        )}

        <Dialog
          open={!!vagaEmEdicao}
          onOpenChange={(open) => !open && setVagaEmEdicao(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Atualizar vaga</DialogTitle>
              <DialogDescription>
                Altere os dados da vaga selecionada.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <FormSelect
                label="Curso"
                value={editForm.cursoId}
                onChange={(value) =>
                  setEditForm((current) => ({ ...current, cursoId: value }))
                }
                options={cursos}
                loading={isLoadingCursos}
                disabled={updateVaga.isPending}
                map={(curso) => ({
                  key: curso.codigo,
                  value: curso.codigo,
                  label: curso.designacao,
                })}
              />

              <FormSelect
                label="Período"
                value={editForm.periodoId}
                onChange={(value) =>
                  setEditForm((current) => ({ ...current, periodoId: value }))
                }
                options={periodos}
                loading={isLoadingPeriodos}
                disabled={updateVaga.isPending}
                map={(periodo) => ({
                  key: periodo.codigo,
                  value: periodo.codigo,
                  label: periodo.designacao,
                })}
              />

              <FormSelect
                label="Ano lectivo"
                value={editForm.anoLetivoId}
                onChange={(value) =>
                  setEditForm((current) => ({ ...current, anoLetivoId: value }))
                }
                options={anosLetivos}
                loading={isLoadingAnosLetivos}
                disabled={updateVaga.isPending}
                map={(anoLetivo) => ({
                  key: anoLetivo.codigo,
                  value: anoLetivo.codigo,
                  label: anoLetivo.designacao,
                })}
              />

              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-num-vagas">Número de vagas</Label>
                <Input
                  id="edit-num-vagas"
                  type="number"
                  min={1}
                  value={editForm.numVagas}
                  onChange={(event) =>
                    setEditForm((current) => ({
                      ...current,
                      numVagas: event.target.value,
                    }))
                  }
                  disabled={updateVaga.isPending}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-cursos-opcionais">Cursos opcionais</Label>
              <Textarea
                id="edit-cursos-opcionais"
                value={editForm.cursosOpcionais}
                onChange={(event) =>
                  setEditForm((current) => ({
                    ...current,
                    cursosOpcionais: event.target.value,
                  }))
                }
                disabled={updateVaga.isPending}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateVaga.isPending}
                onClick={() => setVagaEmEdicao(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={updateVaga.isPending}
                onClick={handleUpdate}
              >
                {updateVaga.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!vagaParaRemover}
          onOpenChange={(open) => !open && setVagaParaRemover(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover vaga</DialogTitle>
              <DialogDescription>
                Confirme a remoção da vaga selecionada.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={deleteVaga.isPending}
                onClick={() => setVagaParaRemover(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleteVaga.isPending}
                onClick={handleDelete}
              >
                {deleteVaga.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
