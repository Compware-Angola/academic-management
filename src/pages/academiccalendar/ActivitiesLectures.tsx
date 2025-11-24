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
  codigo_utilizador?: string;
  descricao_utilizador?: string;
}

const ANOS_LETIVOS_MOCK = [
  { id: "23", descricao: "2025/2026" },
  { id: "22", descricao: "2024/2025" },
  { id: "21", descricao: "2023/2024" },
  { id: "20", descricao: "2022/2023" },
];

const TIPOS_CANDIDATURA_MOCK = [
  { id: "1", nome: "Licenciatura" },
  { id: "2", nome: "Mestrado" },
  { id: "3", nome: "Pos-graduação" },
];

const API_BASE =
  "https://dev2.sistema.unisaude.co.ao/ords/compware/ga/academic-calendar/academic-activities";

export default function ActivitiesLecturesLic() {
  const { toast } = useToast();

  // Estados
  const [loading, setLoading] = useState(true);
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  // Filtros
  const [anoLetivoId, setAnoLetivoId] = useState("23"); // padrão: 2025/2026
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState("1"); // padrão: Licenciatura

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

  // Buscar atividades com base nos filtros
  const fetchAtividades = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/${anoLetivoId}/${tipoCandidaturaId}`;
      const response = await axios.get(url);
      const data: Atividade[] = response.data.actividades || [];
      setAtividades(data);
      setCurrentPage(1);
      toast({ title: `Carregadas ${data.length} atividades` });
    } catch (err: any) {
      console.error("Erro na API:", err);
      toast({
        title: "Erro ao carregar atividades",
        description: "Verifique a conexão ou tente novamente mais tarde.",
        variant: "destructive",
      });
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar ao mudar qualquer filtro
  useEffect(() => {
    fetchAtividades();
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
    // Aqui vai o POST real quando tiveres
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_CANDIDATURA_MOCK.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nome}
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
              <TableHead className="w-32">Data Início</TableHead>
              <TableHead className="w-32">Data Fim</TableHead>
              <TableHead className="w-32">Ano Letivo</TableHead>
              <TableHead>Tipo Calendário</TableHead>
              <TableHead className="w-24 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
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
              <Input
                type="date"
                value={form.data_inicio}
                onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Fim *</Label>
              <Input
                type="date"
                value={form.data_termino}
                onChange={(e) => setForm({ ...form, data_termino: e.target.value })}
              />
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