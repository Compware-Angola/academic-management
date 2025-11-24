import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { formatarData } from "@/util/date-formate";
import { useQuery } from "@tanstack/react-query";
import { fetchAnosAcademicos } from "@/services/fetch-anos-academico";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

// --------------------- Tipos -------------------------
interface Atividade {
  codigo: string;
  descricao: string;
  data_inicio: string;
  data_termino: string;
  ano_lectivo: string;
  tipo_candidatura: string;
  tipo_calendario: string;
}

interface TipoCandidatura {
  codigo: number;
  designacao: string;
}

// --------------------- Rotas -------------------------
const API_ATIVIDADES =
  "http://34.202.163.85:8080/ords/cmpdev/ga/academic-calendar/academic-activities";

const API_TIPOS_CANDIDATURA =
  "http://34.202.163.85:8080/ords/cmpdev/uma/tipo-candidatura/all";
const API_ANOS_ACADEMICOS =
  "http://34.202.163.85:8080/ords/cmpdev/academic-year/all";

const ANOS_LETIVOS_MOCK = [
  { id: "23", descricao: "2025/2026" },
  { id: "22", descricao: "2024/2025" },
  { id: "21", descricao: "2023/2024" },
  { id: "20", descricao: "2022/2023" },
];

// --------------------- Componente -------------------------
export default function ActivitiesLecturesLic() {
  const { toast } = useToast();

  // Filtros
  const [anoLetivoId, setAnoLetivoId] = useState("23");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal criação
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    descricao: "",
    data_inicio: "",
    data_termino: "",
    ano_lectivo: "2025/2026",
    tipo_calendario: "",
  });

  // ------------------------------------------------------
  // ★ QUERY: TIPOS DE CANDIDATURA
  // ------------------------------------------------------
  const { data: tiposCandidatura = [], isLoading: loadingTipos } = useQuery<
    TipoCandidatura[]
  >({
    queryKey: ["tiposCandidatura"],
    queryFn: async () => {
      const r = await axios.get(API_TIPOS_CANDIDATURA);
      return r.data.tipo_candidaturas ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Efeito colateral após load: selecionar licenciatura como padrão
  useEffect(() => {
    if (tiposCandidatura.length === 0) return;

    const padrao = tiposCandidatura.find((t) => t.codigo === 1);
    if (padrao) setTipoCandidaturaId("1");
  }, [tiposCandidatura]);
  const { data: anosLetivos = [], isLoading: loadingAnosLetivos } =
    useQueryAnoAcademico();
  useEffect(() => {
    if (loadingAnosLetivos || anosLetivos.length === 0) return;

    const anosFiltrados = anosLetivos.filter(
      (a) =>
        !a.designacao.toLowerCase().includes("doutoramento") &&
        !a.designacao.toLowerCase().includes("mestrado"),
    );

    const ativo =
      anosFiltrados.find((a) => a.estado.toLowerCase().includes("activ")) ??
      anosFiltrados[0];

    setAnoLetivoId(ativo.codigo.toString());
  }, [anosLetivos, loadingAnosLetivos]);
  // ------------------------------------------------------
  // ★ QUERY: ATIVIDADES LETIVAS
  // ------------------------------------------------------
  const {
    data: atividades = [],
    isLoading: loadingAtividades,
    refetch: refetchAtividades,
  } = useQuery<Atividade[]>({
    queryKey: ["atividades", anoLetivoId, tipoCandidaturaId],
    queryFn: async () => {
      if (!tipoCandidaturaId) return [];

      const url = `${API_ATIVIDADES}/${anoLetivoId}/${tipoCandidaturaId}`;
      const r = await axios.get(url);
      return r.data.actividades ?? [];
    },
    enabled: !!tipoCandidaturaId,
  });

  // Aviso e reset da página quando os dados chegam
  useEffect(() => {
    if (atividades.length === 0) return;

    setCurrentPage(1);
    toast({ title: `Carregadas ${atividades.length} atividades` });
  }, [atividades]);

  // ------------------------------------------------------
  // Handlers
  // ------------------------------------------------------
  const handleRefresh = () => refetchAtividades();

  const handleSubmitNew = () => {
    if (
      !form.descricao ||
      !form.data_inicio ||
      !form.data_termino ||
      !form.tipo_calendario
    ) {
      toast({
        title: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Atividade cadastrada com sucesso!" });
    setOpenModal(false);
    setForm({
      descricao: "",
      data_inicio: "",
      data_termino: "",
      ano_lectivo: "2025/2026",
      tipo_calendario: "",
    });

    refetchAtividades();
  };

  // Paginação
  const totalPages = Math.ceil(atividades.length / itemsPerPage);
  const paginatedData = atividades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
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
                  placeholder={loadingTipos ? "Carregando..." : "Selecione"}
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

      {/* -------------------- TABELA -------------------- */}
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
              // ← Skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              // ← Nenhum resultado
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-16 text-muted-foreground"
                >
                  Nenhuma atividade encontrada
                </TableCell>
              </TableRow>
            ) : (
              // ← Dados reais
              paginatedData.map((item) => (
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
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button variant="ghost" size="icon">
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

      {/* -------------------- PAGINAÇÃO -------------------- */}
      {!loadingAtividades && atividades.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} –{" "}
            {Math.min(currentPage * itemsPerPage, atividades.length)} de{" "}
            {atividades.length} atividades
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <span className="px-3 text-sm">
              Página <strong>{currentPage}</strong> de{" "}
              <strong>{totalPages}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* -------------------- MODAL CRIAR -------------------- */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Atividade Letiva</DialogTitle>
            <DialogDescription>
              Adicione uma nova atividade ao calendário acadêmico.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Ano Letivo *</Label>
              <Select
                value={form.ano_lectivo}
                onValueChange={(v) => setForm({ ...form, ano_lectivo: v })}
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
                value={form.data_termino}
                onChange={(e) =>
                  setForm({ ...form, data_termino: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Tipo de Calendário *</Label>
              <Textarea
                value={form.tipo_calendario}
                onChange={(e) =>
                  setForm({ ...form, tipo_calendario: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitNew}>Criar Atividade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
