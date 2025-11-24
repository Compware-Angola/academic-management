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
import { RefreshCw, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { formatarData } from "@/util/date-formate";

// Interfaces
interface Prazo {
  prazo_id: number;
  observacao: string;
  tipo_avaliacao_id: number;
  data_inicio: string;
  data_fim: string;
  tipo_avaliacao: string;
  criado_por_nome: string;
}

interface AnoLetivo {
  codigo: string;
  designacao: string;
  estado: string;
}

interface TipoCandidatura {
  codigo: number;
  designacao: string;
}

interface TipoPrazo {
  pk_tipo_prazo: number;
  designacao: string;
}

interface TipoAvaliacao {
  codigo: number;
  designacao: string;
  sigla: string;
}

// ROTAS REAIS
const API_ANOS_LETIVOS = "http://34.202.163.85:8080/ords/cmpdev/academic-year/all";
const API_TIPOS_CANDIDATURA = "http://34.202.163.85:8080/ords/cmpdev/uma/tipo-candidatura/all";
const API_TIPOS_PRAZO = "http://34.202.163.85:8080/ords/cmpdev/uma/tipo-prazo/all";
const API_TIPOS_AVALIACAO = "http://34.202.163.85:8080/ords/cmpdev/uma/tipo-avaliacao/all";
const API_PRAZOS = "http://34.202.163.85:8080/ords/cmpdev/ga/academic-calendar/deadlines";
const API_CRIAR_PRAZO = "http://34.202.163.85:8080/ords/cmpdev/ga/academic-calendar/deadlines";

const SEMESTRES = [
  { id: 1, nome: "1º Semestre" },
  { id: 2, nome: "2º Semestre" },
];

export default function Deadlines() {
  const { toast } = useToast();

  // Estados
  const [loading, setLoading] = useState(true);
  const [prazos, setPrazos] = useState<Prazo[]>([]);
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([]);
  const [tiposCandidatura, setTiposCandidatura] = useState<TipoCandidatura[]>([]);
  const [tiposPrazo, setTiposPrazo] = useState<TipoPrazo[]>([]);
  const [tiposAvaliacao, setTiposAvaliacao] = useState<TipoAvaliacao[]>([]);

  // Filtros
  const [anoLetivoId, setAnoLetivoId] = useState<string>("");
  const [tipoPrazoId, setTipoPrazoId] = useState<string>("");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState<string>("");

  // Modal Novo Prazo
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    fk_tipo_prazo: "",
    fk_tipo_avaliacao: "",
    fk_semestre: "1",
    data_inicio: "",
    data_fim: "",
    observacao: "",
    fk_created_by: "1397",
  });

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Carregar anos letivos (TODOS, ordenados do mais recente para o mais antigo)
  const fetchAnosLetivos = async () => {
    try {
      const res = await axios.get(API_ANOS_LETIVOS);
      const todos = res.data.anolectivos || [];

      // Ordenar do mais recente para o mais antigo
      const ordenados = todos.sort((a: AnoLetivo, b: AnoLetivo) =>
        Number(b.codigo) - Number(a.codigo)
      );

      setAnosLetivos(ordenados);

      // Selecionar automaticamente o mais recente
      if (ordenados.length > 0) {
        setAnoLetivoId(ordenados[0].codigo);
      }
    } catch {
      toast({ title: "Erro ao carregar anos letivos", variant: "destructive" });
    }
  };

  const fetchTiposCandidatura = async () => {
    try {
      const res = await axios.get(API_TIPOS_CANDIDATURA);
      const data = res.data.tipo_candidaturas || [];
      setTiposCandidatura(data);
      const licenciatura = data.find((t: any) => t.codigo === 1);
      if (licenciatura) setTipoCandidaturaId("1");
    } catch {
      toast({ title: "Erro ao carregar tipos de candidatura", variant: "destructive" });
    }
  };

  const fetchTiposPrazo = async () => {
    try {
      const res = await axios.get(API_TIPOS_PRAZO);
      const data = res.data.tiposPrazo || [];
      setTiposPrazo(data);
      const marcacaoProvas = data.find((t: TipoPrazo) => t.pk_tipo_prazo === 4);
      if (marcacaoProvas) {
        setTipoPrazoId("4");
        setForm(prev => ({ ...prev, fk_tipo_prazo: "4" }));
      }
    } catch {
      toast({ title: "Erro ao carregar tipos de prazo", variant: "destructive" });
    }
  };

  const fetchTiposAvaliacao = async () => {
    try {
      const res = await axios.get(API_TIPOS_AVALIACAO);
      const data = res.data.tipo_avaliacoes || [];
      setTiposAvaliacao(data);
    } catch {
      toast({ title: "Erro ao carregar tipos de avaliação", variant: "destructive" });
    }
  };

  const fetchPrazos = async () => {
    if (!anoLetivoId || !tipoPrazoId || !tipoCandidaturaId) return;

    setLoading(true);
    try {
      const url = `${API_PRAZOS}/${anoLetivoId}/${tipoPrazoId}/${tipoCandidaturaId}`;
      const res = await axios.get(url);
      const data = res.data.prazos || [];
      setPrazos(data);
      toast({ title: `Carregados ${data.length} prazos` });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Erro ao carregar prazos",
        description: "Verifique os filtros selecionados",
        variant: "destructive",
      });
      setPrazos([]);
    } finally {
      setLoading(false);
    }
  };

  // Criar prazo
  const handleCriarPrazo = async () => {
    if (!form.fk_tipo_prazo || !form.fk_tipo_avaliacao || !form.data_inicio || !form.data_fim) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const payload = {
      fk_tipo_prazo: Number(form.fk_tipo_prazo),
      fk_tipo_avaliacao: Number(form.fk_tipo_avaliacao),
      fk_semestre: Number(form.fk_semestre),
      data_inicio: `${form.data_inicio}T00:00:00`,
      data_fim: `${form.data_fim}T00:00:00`,
      observacao: form.observacao || null,
      fk_created_by: Number(form.fk_created_by),
    };

    try {
      await axios.post(API_CRIAR_PRAZO, payload);
      toast({ title: "Prazo criado com sucesso!" });
      setOpenModal(false);
      setForm({
        fk_tipo_prazo: tipoPrazoId,
        fk_tipo_avaliacao: "",
        fk_semestre: "1",
        data_inicio: "",
        data_fim: "",
        observacao: "",
        fk_created_by: "1397",
      });
      fetchPrazos();
    } catch (err: any) {
      toast({
        title: "Erro ao criar prazo",
        description: err.response?.data?.message || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  // Inicialização
  useEffect(() => {
    fetchAnosLetivos();
    fetchTiposCandidatura();
    fetchTiposPrazo();
    fetchTiposAvaliacao();
  }, []);

  useEffect(() => {
    if (anoLetivoId && tipoPrazoId && tipoCandidaturaId) {
      fetchPrazos();
    }
  }, [anoLetivoId, tipoPrazoId, tipoCandidaturaId]);

  // Paginação
  const totalPages = Math.ceil(prazos.length / itemsPerPage);
  const paginated = prazos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prazos Académicos"
        subtitle="Home / Calendário Académico / Prazos"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={fetchPrazos}>
              <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
            </Button>
            <Button size="sm" onClick={() => setOpenModal(true)}>
              <Plus className="h-4 w-4 mr-2" /> Novo Prazo
            </Button>
          </>
        }
      />

      {/* Filtros */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Ano Letivo - TODOS os anos + (Ativo) correto */}
          <div className="space-y-2">
            <Label>Ano Letivo</Label>
            <Select value={anoLetivoId} onValueChange={setAnoLetivoId}>
              <SelectTrigger>
                <SelectValue placeholder={anosLetivos.length === 0 ? "Carregando..." : "Selecione"} />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map((a) => (
                  <SelectItem key={a.codigo} value={a.codigo}>
                    <div className="flex items-center justify-between w-full">
                      <span>{a.designacao}</span>
                      {!a.estado.toLowerCase().includes("desactiv") && (
                        <span className="text-xs text-green-600 font-medium ml-4">(Ativo)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Prazo */}
          <div className="space-y-2">
            <Label>Tipo de Prazo</Label>
            <Select value={tipoPrazoId} onValueChange={setTipoPrazoId}>
              <SelectTrigger>
                <SelectValue placeholder={tiposPrazo.length === 0 ? "Carregando..." : "Selecione"} />
              </SelectTrigger>
              <SelectContent>
                {tiposPrazo.map((t) => (
                  <SelectItem key={t.pk_tipo_prazo} value={t.pk_tipo_prazo.toString()}>
                    {t.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Candidatura */}
          <div className="space-y-2">
            <Label>Tipo de Candidatura</Label>
            <Select value={tipoCandidaturaId} onValueChange={setTipoCandidaturaId}>
              <SelectTrigger>
                <SelectValue placeholder={tiposCandidatura.length === 0 ? "Carregando..." : "Selecione"} />
              </SelectTrigger>
              <SelectContent>
                {tiposCandidatura.map((t) => (
                  <SelectItem key={t.codigo} value={t.codigo.toString()}>
                    {t.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={fetchPrazos}>
              <RefreshCw className="h-4 w-4 mr-2" /> Aplicar Filtros
            </Button>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-8 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-40" /></TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
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
                      <div className="text-muted-foreground">até {formatarData(p.data_fim)}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.observacao || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.criado_por_nome}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Novo Prazo */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Prazo</DialogTitle>
            <DialogDescription>Defina o período para o tipo de prazo selecionado.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Tipo de Prazo */}
            <div className="space-y-2">
              <Label>Tipo de Prazo *</Label>
              <Select value={form.fk_tipo_prazo} onValueChange={(v) => setForm({ ...form, fk_tipo_prazo: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de prazo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposPrazo.map((t) => (
                    <SelectItem key={t.pk_tipo_prazo} value={t.pk_tipo_prazo.toString()}>
                      {t.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Avaliação */}
            <div className="space-y-2">
              <Label>Tipo de Avaliação *</Label>
              <Select value={form.fk_tipo_avaliacao} onValueChange={(v) => setForm({ ...form, fk_tipo_avaliacao: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAvaliacao.map((t) => (
                    <SelectItem key={t.codigo} value={t.codigo.toString()}>
                      {t.designacao} ({t.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semestre */}
            <div className="space-y-2">
              <Label>Semestre *</Label>
              <Select value={form.fk_semestre} onValueChange={(v) => setForm({ ...form, fk_semestre: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEMESTRES.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Início *</Label>
                <Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data Fim *</Label>
                <Input type="date" value={form.data_fim} onChange={(e) => setForm({ ...form, data_fim: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observação (opcional)</Label>
              <Textarea
                placeholder="Ex: Período alargado devido a feriados..."
                value={form.observacao}
                onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button onClick={handleCriarPrazo}>Criar Prazo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Paginação */}
      {!loading && prazos.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, prazos.length)} de {prazos.length} prazos
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <span className="text-sm">Página {currentPage} de {totalPages}</span>
            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              Próxima <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}