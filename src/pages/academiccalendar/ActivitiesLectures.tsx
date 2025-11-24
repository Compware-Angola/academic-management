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
  Download,
  Printer,
  RefreshCw,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

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

// ROTAS REAIS
const API_ATIVIDADES = "https://dev2.sistema.unisaude.co.ao/ords/compware/ga/academic-calendar/academic-activities";
const API_TIPOS_CANDIDATURA = "http://34.202.163.85:8080/ords/cmpdev/uma/tipo-candidatura/all";

// Mock de anos letivos (até teres a rota real)
const ANOS_LETIVOS_MOCK = [
  { id: "23", descricao: "2025/2026" },
  { id: "22", descricao: "2024/2025" },
  { id: "21", descricao: "2023/2024" },
  { id: "20", descricao: "2022/2023" },
];

export default function ActivitiesLecturesLic() {
  const { toast } = useToast();

  // Estados
  const [loading, setLoading] = useState(true);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [tiposCandidatura, setTiposCandidatura] = useState<TipoCandidatura[]>([]);

  // Filtros
  const [anoLetivoId, setAnoLetivoId] = useState("23");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState<string>("1"); // padrão: Licenciatura

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal Nova Atividade
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({
    descricao: "",
    data_inicio: "",
    data_termino: "",
    ano_lectivo: "2025/2026",
    tipo_calendario: "",
  });

  // Carregar tipos de candidatura
  const fetchTiposCandidatura = async () => {
    try {
      const res = await axios.get(API_TIPOS_CANDIDATURA);
      const data = res.data.tipo_candidaturas || [];
      setTiposCandidatura(data);

      // Definir Licenciatura como padrão (código 1)
      const licenciatura = data.find((t: TipoCandidatura) => t.codigo === 1);
      if (licenciatura) {
        setTipoCandidaturaId("1");
      }
    } catch (err) {
      console.error("Erro ao carregar tipos de candidatura", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tipos de candidatura",
        variant: "destructive",
      });
    }
  };

  // Carregar atividades
  const fetchAtividades = async () => {
    if (!tipoCandidaturaId) return;

    setLoading(true);
    try {
      const url = `${API_ATIVIDADES}/${anoLetivoId}/${tipoCandidaturaId}`;
      const res = await axios.get(url);
      const data: Atividade[] = res.data.actividades || [];
      setAtividades(data);
      setCurrentPage(1);
      toast({ title: `Carregadas ${data.length} atividades` });
    } catch (err: any) {
      console.error("Erro na API de atividades:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as atividades",
        variant: "destructive",
      });
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na montagem
  useEffect(() => {
    fetchTiposCandidatura();
  }, []);

  // Recarregar atividades quando mudar filtro
  useEffect(() => {
    if (tiposCandidatura.length > 0) {
      fetchAtividades();
    }
  }, [anoLetivoId, tipoCandidaturaId]);

  // Paginação
  const totalPages = Math.ceil(atividades.length / itemsPerPage);
  const paginatedData = atividades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    toast({ title: "Atualizando..." });
    fetchAtividades();
  };

  const handleSubmitNew = () => {
    if (!form.descricao || !form.data_inicio || !form.data_termino || !form.tipo_calendario) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
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
    fetchAtividades();
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
            {/*
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            */}
            <Button size="sm" onClick={() => setOpenModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Atividade
            </Button>
          </>
        }
      />

      {/* Filtros */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label>Ano Letivo</Label>
            <Select value={anoLetivoId} onValueChange={setAnoLetivoId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANOS_LETIVOS_MOCK.map((ano) => (
                  <SelectItem key={ano.id} value={ano.id}>
                    {ano.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Candidatura</Label>
            <Select value={tipoCandidaturaId} onValueChange={setTipoCandidaturaId}>
              <SelectTrigger>
                <SelectValue placeholder={tiposCandidatura.length === 0 ? "Carregando..." : undefined} />
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
          {/*
          <div className="space-y-2">
            <Label>Pesquisar</Label>
            <Input placeholder="Buscar por descrição..." />
          </div>
*/}
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={handleRefresh}>
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
              <TableHead className="max-w-md">Tipo Calendário</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  Nenhuma atividade encontrada para os filtros selecionados
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.codigo}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs whitespace-normal">
                      {item.descricao}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.data_inicio}</TableCell>
                  <TableCell>{item.data_termino}</TableCell>
                  <TableCell>{item.ano_lectivo}</TableCell>
                  <TableCell className="text-xs">{item.tipo_calendario}</TableCell>
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

      {/* Paginação */}
      {!loading && atividades.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, atividades.length)} de {atividades.length} atividades
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm px-3">
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal Nova Atividade */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Atividade Letiva</DialogTitle>
            <DialogDescription>
              Adicione uma nova atividade ao calendário académico.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Ex: Início das Aulas"
              />
            </div>
            <div className="space-y-2">
              <Label>Ano Letivo *</Label>
              <Select value={form.ano_lectivo} onValueChange={(v) => setForm({ ...form, ano_lectivo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ANOS_LETIVOS_MOCK.map((ano) => (
                    <SelectItem key={ano.id} value={ano.descricao}>
                      {ano.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Data Início *</Label>
              <Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Data Fim *</Label>
              <Input type="date" value={form.data_termino} onChange={(e) => setForm({ ...form, data_termino: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Tipo de Calendário *</Label>
              <Textarea
                value={form.tipo_calendario}
                onChange={(e) => setForm({ ...form, tipo_calendario: e.target.value })}
                placeholder="Ex: Período letivo regular do 1º semestre"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>Cancelar</Button>
            <Button onClick={handleSubmitNew}>Criar Atividade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}