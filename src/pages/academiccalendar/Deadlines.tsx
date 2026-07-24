import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { formatarData } from "@/util/date-formate";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { AuthStorage } from "@/util/auth-storage";
import { useQueryPrazos } from "@/hooks/prazos/use-query-prazo";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { useQueryTiposPrazos } from "@/hooks/prazos/use-query-tipo-prazo";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryTipoEpocaAvaliacoes } from "@/hooks/avaliacao/use-query-fetch-tipo-epoca-avaliacoes";
import { useCreatePrazo } from "@/hooks/prazos/use-create-prazo";
import { useUpdatePrazo } from "@/hooks/prazos/use-update-prazo";
import { useDeletePrazo } from "@/hooks/prazos/use-delete-prazo";
import { Prazo } from "@/services/prazos/fetchPrazos";
import { useAuth } from "@/hooks/use-auth";
import { FormSelect } from "@/components/common/FormSelect";
import { set } from "date-fns";
import { MCALTipoAvaliacoesSelectSelect } from "@/components/common/global-selects/MCALTipoAvaliacoesSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

export default function Deadlines() {
  const pk_utilizador = useAuth()?.user?.user?.pk_utilizador;
  const { hasPermission } = usePermission();

  const [prazoId, setPrazoId] = useState<number>(0);
  const { data: tiposCandidatura = [], isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();
  const tiposCandidaturaFiltered = useMemo(() => {
    return tiposCandidatura?.filter((tp) => {
      if (
        !hasPermission(
          PermissionTypeDetails.PRAZOS_ACADEMICOS_POS_GRADUACAO.sigla,
        ) &&
        (tp.sigla === "DTR" || tp.sigla === "MST")
      ) {
        return false;
      }
      return true;
    });
  }, [hasPermission, tiposCandidatura]);
  const { mutateAsync: criarPrazo, isPending: isCreating } = useCreatePrazo();

  const { mutateAsync: actualizarPrazo, isPending: isUpdating } =
    useUpdatePrazo();
  const { mutateAsync: removerPrazo, isPending: isRemoverPrazo } =
    useDeletePrazo();
  const { data: tiposAvaliacao = [] } = useQueryTipoAvaliacao();
  const { data: semestres = [] } = useQuerySemestres();
  const { data: tiposEpocaAvaliacao = [] } = useQueryTipoEpocaAvaliacoes();
  const [anoLetivoId, setAnoLetivoId] = useState<string>("");
  const [tipoPrazoId, setTipoPrazoId] = useState<string>("");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState<string>("");
  const { data: tiposPrazo = [], isLoading: isLoadingTiposPrazo } =
    useQueryTiposPrazos();
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const { data: anosAcademicos = [], isLoading: isLoadingAnosAcademicos } =
    useQueryAnoAcademico();
  const { data: prazos = [], isLoading: isLoadingPrazo } = useQueryPrazos({
    anoLetivoId: anoLetivoId,
    tipoPrazoId: tipoPrazoId,
    tipoCandidaturaId: tipoCandidaturaId,
  });
  // Modal Novo Prazo
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    fk_tipo_prazo: "",
    fk_tipo_avaliacao: "",
    fk_semestre: "",
    data_inicio: "",
    data_fim: "",
    observacao: "",
    fk_created_by: pk_utilizador?.toString(),
    fk_updated_by: pk_utilizador?.toString(),
    anoletivo: "",
    tipoCandidaturaId: "",
  });

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDeletePrazo = async (prazoId: number) => {
    try {
      await removerPrazo(prazoId);
      toast.success("Prazo removido com sucesso");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao remover prazo");
    }
  };

  const handleSelecionarPrazo = (prazo: Prazo) => {
    setPrazoId(prazo.prazo_id);
    const dataInicioFormatada = prazo.data_inicio.split("T")[0];
    const dataFimFormatada = prazo.data_fim.split("T")[0];

    setForm({
      fk_tipo_prazo: tipoPrazoId,
      fk_tipo_avaliacao: prazo.tipo_avaliacao_id?.toString() || "",
      fk_semestre: prazo.fk_semestre,
      data_inicio: dataInicioFormatada,
      data_fim: dataFimFormatada,
      observacao: prazo.observacao || "",
      fk_created_by: "1397",
      fk_updated_by: "1397",
      anoletivo: anoLetivoId.toString(),
      tipoCandidaturaId: tipoCandidaturaId,
    });
    setOpenModal(true);
    setIsEditing(true);
  };

  const handleActualizarPrazo = async () => {
    await actualizarPrazo({
      pk_prazo: prazoId,
      observacao: form.observacao,
      fk_semestre: form.fk_semestre,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim,
      fk_tipo_avaliacao: form.fk_tipo_avaliacao,
      fk_tipo_prazo: form.fk_tipo_prazo,
      tipo_candidatura: form.tipoCandidaturaId,
    });

    toast.success("Prazo atualizado com sucesso");

    setOpenModal(false);
  };

  const handleCriarPrazo = async () => {
    try {
      await criarPrazo({
        fk_tipo_avaliacao:
          Number(form.fk_tipo_prazo) === 5
            ? Number(form.fk_tipo_avaliacao) || 0
            : Number(form.fk_tipo_avaliacao),

        fk_semestre: Number(form.fk_semestre),
        fk_tipo_prazo: Number(form.fk_tipo_prazo),
        fk_ano_lectivo: Number(form.anoletivo),

        data_inicio: `${form.data_inicio}T00:00:00`,
        data_fim: `${form.data_fim}T23:59:59`,

        observacao: form.observacao || undefined,

        fk_created_by: Number(pk_utilizador),

        tipo_candidatura: form.tipoCandidaturaId,
      });

      toast.success("Prazo criado com sucesso");

      // ✅ Só se executa se deu sucesso
      setForm({
        fk_tipo_prazo: "",
        fk_tipo_avaliacao: "",
        fk_semestre: "",
        data_inicio: "",
        data_fim: "",
        observacao: "",
        fk_created_by: pk_utilizador.toString(),
        fk_updated_by: pk_utilizador.toString(),
        anoletivo: "",
        tipoCandidaturaId: "",
      });

      setIsEditing(false);
      setOpenModal(false);
    } catch (error: any) {
      // ❌ Modal NÃO fecha, mostra o erro
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoadingAnosAcademicos && anosAcademicos.length === 0) {
      return;
    }
    const anoAcademicoAtivo = anosAcademicos.filter((ano) =>
      ano.estado.toLowerCase().startsWith("activ"),
    );
    setAnoLetivoId(anoAcademicoAtivo[0]?.codigo.toString() || "");
  }, [isLoadingAnosAcademicos, anosAcademicos]);

  useEffect(() => {
    if (isLoadingTiposPrazo || tiposPrazo.length === 0) return;
    if (tipoPrazoId) return;

    setTipoPrazoId(String(tiposPrazo[0]?.pk_tipo_prazo));
  }, [isLoadingTiposPrazo, tiposPrazo, tipoPrazoId]);
  useEffect(() => {
    if (isLoadingTiposCandidatura || tiposCandidaturaFiltered.length === 0)
      return;

    const tipoCandidaturaValido = tiposCandidaturaFiltered.some(
      (tipo) => String(tipo.codigo) === tipoCandidaturaId,
    );

    if (!tipoCandidaturaId || !tipoCandidaturaValido) {
      setTipoCandidaturaId(String(tiposCandidaturaFiltered[0]?.codigo));
    }
  }, [isLoadingTiposCandidatura, tiposCandidaturaFiltered, tipoCandidaturaId]);

  const totalPages = Math.ceil(prazos.length / itemsPerPage);
  const paginated = prazos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prazos Académicos"
        subtitle="Home / Calendário Académico / Prazos"
        actions={
          <Button
            disabled={isCreating}
            size="sm"
            onClick={() => {
              setOpenModal(true);
              setIsEditing(false);
            }}
          >
            Novo Prazo
          </Button>
        }
      />

      {/* Filtros */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tipo de Candidatura */}
          <FormSelect
            label="Tipo de Candidatura"
            value={tipoCandidaturaId}
            onChange={setTipoCandidaturaId}
            options={tiposCandidaturaFiltered}
            loading={isLoadingTiposCandidatura}
            map={(tp) => ({
              key: tp.codigo,
              label: tp.designacao,
              value: tp.codigo,
            })}
          />

          {/* Ano Letivo */}
          <div className="space-y-2">
            <AcademicYearsAvailableForOperationSelect
              label="Ano Letivo"
              value={anoLetivoId}
              onChangeValue={setAnoLetivoId}
              tipoCandidaturaId={parseFilter(tipoCandidaturaId) ?? 1}
              onlyConfigurable={false}
            />
          </div>

          {/* Tipo de Prazo */}
          <div className="space-y-2">
            <Label>Tipo de Prazo</Label>
            <Select
              value={tipoPrazoId}
              onValueChange={(v) => {
                setTipoPrazoId(v);
                setForm({ ...form, fk_tipo_prazo: v });
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingTiposPrazo ? "Carregando..." : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tiposPrazo.map((t) => (
                  <SelectItem
                    key={t.pk_tipo_prazo}
                    value={t.pk_tipo_prazo.toString()}
                  >
                    {t.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo de Avaliação</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead>Actualizado por</TableHead>
              <TableHead className="text-right">Acções</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingPrazo ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-8 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-64" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-40" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-16 text-muted-foreground"
                >
                  Nenhum prazo encontrado para os filtros selecionados
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <TableRow key={p.prazo_id}>
                  <TableCell>
                    <Badge variant="outline">{p.tipo_avaliacao}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm leading-tight">
                      <div>{formatarData(p.data_inicio)}</div>
                      <div className="text-muted-foreground">
                        até {formatarData(p.data_fim)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {p.observacao || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.criado_por_nome}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {p.atualizado_por_nome ?? "---"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleSelecionarPrazo(p)}
                        size="sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePrazo(p.prazo_id)}
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

      {/* Modal Novo Prazo */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-lg! w-full!">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Prazo" : "Novo Prazo"}
            </DialogTitle>
            <DialogDescription>
              Defina o período para o tipo de prazo selecionado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Tipo de Prazo */}
            <div className="space-y-2">
              <Label>Tipo de Prazo *</Label>
              <Select
                value={form.fk_tipo_prazo}
                onValueChange={(v) => {
                  setTipoPrazoId(v);
                  setForm({ ...form, fk_tipo_prazo: v });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de prazo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPrazo.map((t) => (
                    <SelectItem
                      key={t.pk_tipo_prazo}
                      value={t.pk_tipo_prazo.toString()}
                    >
                      {t.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Avaliação */}
            {form.fk_tipo_prazo.toString() === "3" && (
              <div className="space-y-2">
                <MCALTipoAvaliacoesSelectSelect
                  onChangeValue={(v) =>
                    setForm({ ...form, fk_tipo_avaliacao: v })
                  }
                  value={form.fk_tipo_avaliacao}
                />
              </div>
            )}

            {/*Tipo epoca avalicaoes */}
            {form.fk_tipo_prazo.toString() === "4" && (
              <div className="space-y-2">
                <MCALTipoAvaliacoesSelectSelect
                  onChangeValue={(v) =>
                    setForm({ ...form, fk_tipo_avaliacao: v })
                  }
                  value={form.fk_tipo_avaliacao}
                />
              </div>
            )}
            {/* Tipo de Candidatura */}
            <FormSelect
              label="Tipo de Candidatura"
              value={form.tipoCandidaturaId}
              onChange={(v) => setForm({ ...form, tipoCandidaturaId: v })}
              options={tiposCandidaturaFiltered}
              loading={isLoadingTiposCandidatura}
              map={(tp) => ({
                key: tp.codigo,
                label: tp.designacao,
                value: tp.codigo,
              })}
            />

            {/* Ano Letivo */}
            <div className="space-y-2">
              {/* <FormSelect
                disabled={isEditing ? true : false}
                label="Ano Letivo"
                value={form.anoletivo}
                onChange={(v) => setForm({ ...form, anoletivo: v })}
                options={anosAcademicos?.filter(
                  (ay) => ay.estado.toLowerCase() === "activo",
                )}
                map={(a) => ({
                  key: a.codigo,
                  label: a.designacao,
                  value: a.codigo,
                })}
              /> */}
              <AcademicYearsAvailableForOperationSelect
                disabled={isEditing ? true : false}
                onChangeValue={(v) => setForm({ ...form, anoletivo: v })}
                tipoCandidaturaId={parseFilter(form.tipoCandidaturaId)}
                value={form.anoletivo}
                enableDefaultActiveYear
                label="Ano Letivo"
              />
            </div>

            {/* Semestre - AGORA DA API */}
            <div className="space-y-2">
              <Label>Semestre *</Label>
              <Select
                value={form.fk_semestre?.toString() ?? ""}
                onValueChange={(v) => setForm({ ...form, fk_semestre: v })}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      semestres.length === 0 ? "Carregando..." : "Selecione"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {semestres.map((s) => (
                    <SelectItem key={s.codigo} value={s.codigo.toString()}>
                      {s.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início *</Label>
                <Input
                  type="date"
                  value={form.data_inicio}
                  onChange={(e) =>
                    setForm({ ...form, data_inicio: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Data Fim *</Label>
                <Input
                  type="date"
                  value={form.data_fim}
                  onChange={(e) =>
                    setForm({ ...form, data_fim: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observação (opcional)</Label>
              <Textarea
                placeholder="Ex: Período alargado devido a feriados..."
                value={form.observacao}
                onChange={(e) =>
                  setForm({ ...form, observacao: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenModal(false);
                setIsEditing(false);
                setForm({
                  fk_tipo_prazo: "",
                  fk_tipo_avaliacao: "",
                  fk_semestre: "",
                  data_inicio: "",
                  data_fim: "",
                  observacao: "",
                  fk_created_by: pk_utilizador.toString(),
                  fk_updated_by: pk_utilizador.toString(),
                  anoletivo: "",
                  tipoCandidaturaId: "",
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              disabled={isUpdating || isCreating}
              onClick={isEditing ? handleActualizarPrazo : handleCriarPrazo}
            >
              {isEditing ? "Editar Prazo" : "Criar Prazo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Paginação */}
      {!isLoadingPrazo && prazos.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, prazos.length)} de{" "}
            {prazos.length} prazos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
