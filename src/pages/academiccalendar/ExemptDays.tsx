import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  Download,
  Printer,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";
import { formatarData } from "@/util/date-formate";
import { useMutationUpdateExemptDay } from "@/hooks/exempt-day/use-mutation-update-exempt-day";
import { useMutationDeleteExemptDay } from "@/hooks/exempt-day/use-mutation-delete-exempt-day";

interface DiaIsento {
  codigo: number;
  designacao: string;
  data_inicio: string;
  data_fim: string;
  estado: number;
}

const API_URL = "http://34.202.163.85:8080/ords/cmpdev/ga/exempt-days";

export default function ExemptDays() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [diasIsentos, setDiasIsentos] = useState<DiaIsento[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [codigoEdicao, setCodigoEdicao] = useState<number | null>(null);

  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoEstado, setNovoEstado] = useState<"1" | "0">("1");
  const [saving, setSaving] = useState(false);
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();
  const { mutateAsync: updateExemptDay } = useMutationUpdateExemptDay();
  const { mutateAsync: deleteExemptDay } = useMutationDeleteExemptDay();
  const fetchDiasIsentos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const data = response.data.dias_isentos || [];
      setDiasIsentos(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar dias isentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiasIsentos();
  }, []);

  const handleSalvar = async () => {
    if (!dataInicio || !dataFim || !novaDescricao.trim()) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    setSaving(true);

    const payload = {
      designacao: novaDescricao,
      data_inicio: format(dataInicio, "yyyy-MM-dd"),
      data_fim: format(dataFim, "yyyy-MM-dd"),
      estado: Number(novoEstado),
    };

    try {
      if (modoEdicao && codigoEdicao) {
        await updateExemptDay({
          codigo: codigoEdicao,
          data_fim: payload.data_fim,
          data_inicio: payload.data_inicio,
          observacao: payload.designacao,
          estado: payload.estado,
        });
      } else {
        await axios.post(API_URL, payload);

        toast({ title: "Dia isento cadastrado com sucesso!" });
      }

      // Reset do modal
      setOpenModal(false);
      setModoEdicao(false);
      setCodigoEdicao(null);
      setNovaDescricao("");
      setDataInicio(undefined);
      setDataFim(undefined);
      setNovoEstado("1");

      fetchDiasIsentos();
    } catch {
      toast({
        title: "Erro ao salvar",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getBadgeEstado = (estado: number) => {
    return estado === 1 ? (
      <Badge className="bg-success/10 text-success">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };
  const resetForm = () => {
    setModoEdicao(false);
    setCodigoEdicao(null);

    setNovaDescricao("");
    setNovoEstado("1");

    setDataInicio(undefined);
    setDataFim(undefined);
  };
  const totalPages = Math.ceil(diasIsentos.length / itemsPerPage);
  const paginatedData = diasIsentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const abrirEdicao = (item: DiaIsento) => {
    setModoEdicao(true);
    setCodigoEdicao(item.codigo);

    setNovaDescricao(item.designacao);
    setNovoEstado(item.estado === 1 ? "1" : "0");

    setDataInicio(new Date(item.data_inicio));
    setDataFim(new Date(item.data_fim));

    setOpenModal(true);
  };
  const handleDelete = async (id: number) => {
    deleteExemptDay(id);
    fetchDiasIsentos();
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dias Isentos"
        subtitle="Home / Calendário Académico (Lic.) / Dias Isentos"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDiasIsentos}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>

            <Button size="sm" onClick={() => setOpenModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Dia Isento
            </Button>
          </>
        }
      />

      {/* Card vazio de filtros (apenas título) */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Filtros</h3>
        {/* Sem conteúdo */}
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>

              <TableHead>Descrição</TableHead>
              <TableHead>Data Inicio</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-64" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : diasIsentos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  Nenhum dia isento registado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.codigo}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell className="font-medium">
                    {item.designacao}
                  </TableCell>
                  <TableCell>{formatarData(item.data_inicio)}</TableCell>

                  <TableCell>{formatarData(item.data_inicio)}</TableCell>
                  <TableCell>{getBadgeEstado(item.estado)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => abrirEdicao(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.codigo)}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Itens por página:
          </span>
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
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
            Página {currentPage} de {totalPages || 1}
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

      {/* Modal de Novo Dia Isento */}
      <Dialog
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open);

          if (!open) {
            resetForm(); // limpa tudo quando fechar
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modoEdicao ? "Editar Dia Isento" : "Novo Dia Isento"}
            </DialogTitle>
            <DialogDescription>
              Adicione um novo feriado ou dia sem aulas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Descrição */}
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                placeholder="Ex: Natal, Páscoa..."
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
              />
            </div>

            {/* Data Início */}
            <div className="space-y-2">
              <Label>Data Início</Label>

              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {dataInicio
                      ? format(dataInicio, "dd/MM/yyyy")
                      : "Selecionar data"}
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <Label>Data Fim</Label>

              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {dataFim
                      ? format(dataFim, "dd/MM/yyyy")
                      : "Selecionar data"}
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="estado"
                    value="1"
                    checked={novoEstado === "1"}
                    onChange={() => setNovoEstado("1")}
                  />
                  <span>Ativo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="estado"
                    value="0"
                    checked={novoEstado === "0"}
                    onChange={() => setNovoEstado("0")}
                  />
                  <span>Inativo</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} disabled={saving}>
              {saving ? "Salvando..." : modoEdicao ? "Atualizar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
