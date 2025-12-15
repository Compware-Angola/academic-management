import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatarData } from "@/util/date-formate";
import { useActivitiesLectures } from "./hooks";
import { ActivityModal } from "./ActivityModal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { useMutationfetchDeleteActivity } from "@/hooks/academiccalendar/use-mutation-delete-activity";

export default function ActivitiesLecturesLic() {
  const {
    resetForm,
    atividades,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    handleRefresh,
    handleSubmitNew,
    openModal,
    setOpenModal,
    form,
    setForm,
    anoLetivoId,
    setAnoLetivoId,
    tipoCandidaturaId,
    setTipoCandidaturaId,
    tiposCandidatura,
    tiposCalendario,
    loadingTiposCandidatura,
    anosLetivos,
    isSubmitting,
    loadingAnosLetivos,
    loadingAtividades,
    handleEdit,
    editId,
  } = useActivitiesLectures();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSala, setSelectedSala] = useState<{
    id: string;
    descricao: string;
  } | null>(null);
  const { mutate: deleteSala, isPending: deleting } =
    useMutationfetchDeleteActivity();

  const handleOpenDelete = (item: any) => {
    setSelectedSala({
      id: item.codigo.toString(),
      descricao: item.designacao,
    });
    setOpenDialog(true);
  };
  const handleConfirmDelete = () => {
    if (!selectedSala) return;
    deleteSala(selectedSala.id, {
      onSuccess: () => {
        setOpenDialog(false);
        setSelectedSala(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atividades Letivas"
        subtitle="Home / Calendário Académico / Atividades Letivas"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button size="sm" onClick={() => setOpenModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </>
        }
      />
      {/* -------------------- FILTROS -------------------- */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Ano letivo */}
          <div className="space-y-2">
            <Label>Ano Letivo</Label>
            <Select
              value={anoLetivoId}
              onValueChange={setAnoLetivoId}
              disabled={loadingAnosLetivos}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingAnosLetivos ? "Carregando anos..." : "Selecione"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {anosLetivos.map((ano) => (
                  <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                    {ano.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de candidatura */}
          <div className="space-y-2">
            <Label>Tipo de Candidatura</Label>
            <Select
              value={tipoCandidaturaId}
              onValueChange={setTipoCandidaturaId}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingTiposCandidatura ? "Carregando..." : "Selecione"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {tiposCandidatura.map((tipo) => (
                  <SelectItem key={tipo.codigo} value={tipo.codigo.toString()}>
                    {tipo.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Botão aplicar */}
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-32">Início</TableHead>
              <TableHead className="w-32">Fim</TableHead>
              <TableHead className="w-32">Ano Letivo</TableHead>
              <TableHead>Tipo Calendário</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadingAtividades ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : atividades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-16 text-muted-foreground"
                >
                  Nenhuma atividade encontrada
                </TableCell>
              </TableRow>
            ) : (
              atividades.map((item) => (
                <TableRow key={item.codigo}>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs whitespace-normal"
                    >
                      {item.descricao}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatarData(item.data_inicio)}</TableCell>
                  <TableCell>{formatarData(item.data_termino)}</TableCell>
                  <TableCell>{item.ano_lectivo}</TableCell>
                  <TableCell>{item.tipo_calendario}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => handleOpenDelete(item)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {atividades.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * 5 + 1} –{" "}
            {Math.min(currentPage * 5, atividades.length)} de{" "}
            {atividades.length} atividades
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={prevPage}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <span className="px-3 text-sm">
              Página <strong>{currentPage}</strong> de{" "}
              <strong>{totalPages}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={nextPage}
            >
              Próxima <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir a actividade{" "}
              <strong>{selectedSala?.descricao}</strong>?<br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Modal */}
      <ActivityModal
        editId={editId}
        open={openModal}
        setOpen={(state) => {
          resetForm();
          setOpenModal(state);
        }}
        form={form}
        setForm={setForm}
        handleSubmitNew={handleSubmitNew}
        loadingAnosLetivos={loadingAnosLetivos}
        anosLetivos={anosLetivos}
        loadingTiposCandidatura={loadingTiposCandidatura}
        loadingTiposCalendario={loadingTiposCandidatura}
        tiposCalendario={tiposCalendario}
        isSubmitting={isSubmitting}
        tiposCandidatura={tiposCandidatura}
      />
    </div>
  );
}
