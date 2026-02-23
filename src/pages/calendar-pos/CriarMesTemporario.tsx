import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { useEffect } from "react";
import ExcelActions from "@/components/views/excel/GenericExcelExport";


import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Download, Printer, RefreshCw, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {  useQueryGenerateMesTemp } from "@/hooks/academiccalendar/use-query-generate-mes-temp";
import { useMutationCreateMesTemp } from "@/hooks/academiccalendar/use-mutation-create-mes-temp";


interface MesTemporario {
  id: number;
  designacao: string;
  isencao: number;
  ordem_mes: number;
  ano_lectivo: number;
  prestacao: number;
  activo: boolean;
  activo_posgraduacao: boolean;
  data_limite: string;
  data_inicial: string;
  data_final: string;
  data_final_desconto: string | null;
  semestre: number;
  semestre_posgraduacao: number;
}

const initialFormState: Omit<MesTemporario, "id"> = {
  designacao: "",
  isencao: 0,
  ordem_mes: 1,
  ano_lectivo: 2025,
  prestacao: 1,
  activo: true,
  activo_posgraduacao: false,
  data_limite: "",
  data_inicial: "",
  data_final: "",
  data_final_desconto: null,
  semestre: 1,
  semestre_posgraduacao: 1,
};

export  function CriarMesTemporario() {
  const { toast } = useToast();
  const [anoLectivoId, setAnoLectivoId] = useState<number>(22);

  const [mesesEditados, setMesesEditados] = useState<MesTemporario[]>([]);


  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemestre, setFilterSemestre] = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MesTemporario | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  


const { mutate, isPending } = useMutationCreateMesTemp();

  const { data, isLoading, isFetching } =
   useQueryGenerateMesTemp({
    anoLectivoId,
  });

  useEffect(() => {
  if (data) {
    const mapped = data.map((item, index) => ({
      id: index + 1,
      designacao: item.designacao,
      isencao: item.isencao,
      ordem_mes: item.ordem_mes,
      ano_lectivo: item.ano_lectivo,
      prestacao: item.prestacao,
      activo: item.activo === 1,
      activo_posgraduacao: item.activo_posgraduacao === 1,
      data_limite: item.data_limite,
      data_inicial: item.data_inicial,
      data_final: item.data_final,
      data_final_desconto: item.data_final_desconto,
      semestre: item.semestre,
      semestre_posgraduacao: item.semestre_posgraduacao,
    }));

    setMesesEditados(mapped);
  }
}, [data]);



  const filteredData = mesesEditados.filter((item) => {
  const matchSearch = item.designacao
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchSemestre =
    filterSemestre === "all" ||
    item.semestre.toString() === filterSemestre;

  const matchEstado =
    filterEstado === "all" ||
    (filterEstado === "activo"
      ? item.activo
      : !item.activo);

  return matchSearch && matchSemestre && matchEstado;
});


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Lista atualizada com sucesso" });
    }, 1000);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const openEditModal = (item: MesTemporario) => {
    setEditingItem(item);
    const { id, ...rest } = item;
    setFormData(rest);
    setModalOpen(true);
  };

  

const handleSubmit = () => {
  if (
    !formData.designacao ||
    !formData.data_inicial ||
    !formData.data_final ||
    !formData.data_limite
  ) {
    toast({
      title: "Preencha todos os campos obrigatórios",
      variant: "destructive",
    });
    return;
  }

  mutate(
    {
      meses: [
        {
          ...formData,
          ano_lectivo: anoLectivoId,
          activo: formData.activo ? 1 : 0,
          activo_posgraduacao: formData.activo_posgraduacao ? 1 : 0,
        },
      ],
    },
    {
      onSuccess: () => {
        toast({
          title: "Mês temporário criado com sucesso",
        });

        setModalOpen(false);
        setFormData(initialFormState);
      },
      onError: () => {
        toast({
          title: "Erro ao criar mês temporário",
          variant: "destructive",
        });
      },
    }
  );
};

  const handleDelete = (item: MesTemporario) => {
    toast({ title: "Mês temporário removido", description: `${item.designacao} foi removido.` });
  };

  const mesesNomes: Record<number, string> = { 1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro" };

  const exportData = filteredData.map((item) => ({
  designacao: item.designacao,
  mes: mesesNomes[item.ordem_mes] || item.ordem_mes,
  prestacao: item.prestacao,
  semestre: `${item.semestre}º`,
  data_inicial: item.data_inicial,
  data_final: item.data_final,
  data_limite: item.data_limite,
  isencao: item.isencao ? "Sim" : "Não",
  activo: item.activo ? "Activo" : "Inactivo",
  posgraduacao: item.activo_posgraduacao ? "Sim" : "Não",
}));

const pdfContent =
  exportData.length > 0 ? (
    <GenericPDFDocument
      documentTitle="Meses Temporários"
      subtitle="Calendário Académico"
      infoSections={[
        {
          title: "Ano Lectivo",
          content: `Ano: ${anoLectivoId}`,
        },
        {
          title: "Resumo",
          content: `Total de registos: ${exportData.length}`,
        },
      ]}
      mainTable={{
        headers: [
          { key: "designacao", label: "Designação", width: "18%" },
          { key: "mes", label: "Mês", width: "10%" },
          { key: "prestacao", label: "Prestação", width: "10%" },
          { key: "semestre", label: "Semestre", width: "10%" },
          { key: "data_inicial", label: "Data Inicial", width: "12%" },
          { key: "data_final", label: "Data Final", width: "12%" },
          { key: "data_limite", label: "Data Limite", width: "12%" },
          { key: "isencao", label: "Isenção", width: "8%" },
          { key: "activo", label: "Activo", width: "8%" },
          { key: "posgraduacao", label: "Pós-Grad.", width: "10%" },
        ],
        rows: exportData,
        headerBackground: "#1e40af",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps =
  exportData.length > 0
    ? {
        documentTitle: "Meses Temporários",
        subtitle: "Calendário Académico",
        infoSections: [
          {
            title: "Ano Lectivo",
            content: `Ano: ${anoLectivoId}`,
          },
          {
            title: "Resumo",
            content: `Total de registos: ${exportData.length}`,
          },
        ],
        mainTable: {
          headers: [
            { key: "designacao", label: "Designação", width: 25 },
            { key: "mes", label: "Mês", width: 15 },
            { key: "prestacao", label: "Prestação", width: 15 },
            { key: "semestre", label: "Semestre", width: 15 },
            { key: "data_inicial", label: "Data Inicial", width: 18 },
            { key: "data_final", label: "Data Final", width: 18 },
            { key: "data_limite", label: "Data Limite", width: 18 },
            { key: "isencao", label: "Isenção", width: 12 },
            { key: "activo", label: "Activo", width: 12 },
            { key: "posgraduacao", label: "Pós-Grad.", width: 15 },
          ],
          rows: exportData,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#1e40af",
      }
    : null;


    const handleSalvarTodos = () => {
  mutate(
    {
      meses: mesesEditados.map((mes) => ({
        designacao: mes.designacao,
        isencao: mes.isencao,
        ordem_mes: mes.ordem_mes,
        ano_lectivo: mes.ano_lectivo,
        prestacao: mes.prestacao,
        activo: mes.activo ? 1 : 0,
        activo_posgraduacao: mes.activo_posgraduacao ? 1 : 0,
        data_limite: mes.data_limite,
        data_inicial: mes.data_inicial,
        data_final: mes.data_final,
        data_final_desconto: mes.data_final_desconto,
        semestre: mes.semestre,
        semestre_posgraduacao: mes.semestre_posgraduacao,
      })),
    },
    {
      onSuccess: () => {
        toast({
          title: "Alterações guardadas com sucesso",
        });
      },
      onError: () => {
        toast({
          title: "Erro ao guardar alterações",
          variant: "destructive",
        });
      },
    }
  );
};



  return (
    <div className="space-y-6">
      <PageHeader
        title="Criar Mês Temporário"
        subtitle="Home / Calendário Académico (Pós) / Criar Mês Temporário"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            {pdfContent && (
                <PDFActions
                    document={pdfContent}
                    fileName={`Meses_Temporarios_${new Date()
                    .toISOString()
                    .slice(0, 10)}.pdf`}
                    showDownload
                    showPrint
                />
                )}

                {excelProps && (
                <ExcelActions
                    excelProps={excelProps}
                    fileName={`Meses_Temporarios_${new Date()
                    .toISOString()
                    .slice(0, 10)}.xlsx`}
                    showDownload
                />
                )}

          <Button
            size="sm"
            onClick={handleSalvarTodos}
            disabled={isPending}
          >
            Guardar Alterações
          </Button>

          </>
        }
      />

      {/* Filtros */}
      <div className="bg-card rounded-lg border p-4 space-y-4">
        <h3 className="text-sm font-semibold">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Ano Lectivo</Label>
            <Select
            value={anoLectivoId.toString()}
            onValueChange={(v) => {
                setAnoLectivoId(Number(v));
                setCurrentPage(1);
            }}
            >
            <SelectTrigger>
                <SelectValue placeholder="Selecionar ano lectivo" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
                <SelectItem value="22">2022/2023</SelectItem>
                <SelectItem value="23">2023/2024</SelectItem>
                <SelectItem value="24">2024/2025</SelectItem>
                <SelectItem value="25">2025/2026</SelectItem>
            </SelectContent>
            </Select>

          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Designação</TableHead>
              <TableHead>Mês</TableHead>
              <TableHead>Prestação</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Data Inicial</TableHead>
              <TableHead>Data Final</TableHead>
              <TableHead>Data Limite</TableHead>
              <TableHead>Isenção</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Pós-Grad.</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isFetching  ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 11 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  Nenhum mês temporário encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.designacao}</TableCell>
                  <TableCell>{mesesNomes[item.ordem_mes] || item.ordem_mes}</TableCell>
                  <TableCell>{item.prestacao}</TableCell>
                  <TableCell>{item.semestre}º</TableCell>
                  <TableCell>{item.data_inicial}</TableCell>
                  <TableCell>{item.data_final}</TableCell>
                  
                  <TableCell>
                  <Input
                    type="date"
                    value={item.data_limite}
                    onChange={(e) => {
                      const newValue = e.target.value;

                      setMesesEditados((prev) =>
                        prev.map((mes) =>
                          mes.id === item.id
                            ? { ...mes, data_limite: newValue }
                            : mes
                        )
                      );
                    }}
                  />
                </TableCell>


                  <TableCell>
                    <Badge variant={item.isencao ? "default" : "secondary"}>
                      {item.isencao ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.activo ? "default" : "destructive"}>
                      {item.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.activo_posgraduacao ? "default" : "secondary"}>
                      {item.activo_posgraduacao ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item)}>
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
          <Label>Itens por página:</Label>
          <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Anterior</Button>
          <span className="text-sm">Página {currentPage} de {totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Próxima</Button>
        </div>
      </div>

      {/* Modal Criar / Editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Mês Temporário" : "Novo Mês Temporário"}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              <div className="space-y-2">
                <Label>Designação *</Label>
                <Input value={formData.designacao} onChange={(e) => setFormData({ ...formData, designacao: e.target.value })} placeholder="Ex: SET-2025" />
              </div>
              <div className="space-y-2">
                <Label>Ordem do Mês</Label>
                <Select value={formData.ordem_mes.toString()} onValueChange={(v) => setFormData({ ...formData, ordem_mes: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {Object.entries(mesesNomes).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ano Lectivo</Label>
                <Input type="number" value={formData.ano_lectivo} onChange={(e) => setFormData({ ...formData, ano_lectivo: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Prestação</Label>
                <Input type="number" value={formData.prestacao} onChange={(e) => setFormData({ ...formData, prestacao: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Semestre</Label>
                <Select value={formData.semestre.toString()} onValueChange={(v) => setFormData({ ...formData, semestre: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="1">1º Semestre</SelectItem>
                    <SelectItem value="2">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semestre Pós-Graduação</Label>
                <Select value={formData.semestre_posgraduacao.toString()} onValueChange={(v) => setFormData({ ...formData, semestre_posgraduacao: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="1">1º Semestre</SelectItem>
                    <SelectItem value="2">2º Semestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data Inicial *</Label>
                <Input type="date" value={formData.data_inicial} onChange={(e) => setFormData({ ...formData, data_inicial: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data Final *</Label>
                <Input type="date" value={formData.data_final} onChange={(e) => setFormData({ ...formData, data_final: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data Limite *</Label>
                <Input type="date" value={formData.data_limite} onChange={(e) => setFormData({ ...formData, data_limite: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Data Final Desconto</Label>
                <Input type="date" value={formData.data_final_desconto || ""} onChange={(e) => setFormData({ ...formData, data_final_desconto: e.target.value || null })} />
              </div>
              <div className="space-y-2">
                <Label>Isenção</Label>
                <Select value={formData.isencao.toString()} onValueChange={(v) => setFormData({ ...formData, isencao: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="0">Não</SelectItem>
                    <SelectItem value="1">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 pt-6">
                <div className="flex items-center gap-3">
                  <Switch checked={formData.activo} onCheckedChange={(v) => setFormData({ ...formData, activo: v })} />
                  <Label>Activo</Label>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-3">
                  <Switch checked={formData.activo_posgraduacao} onCheckedChange={(v) => setFormData({ ...formData, activo_posgraduacao: v })} />
                  <Label>Activo Pós-Graduação</Label>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{editingItem ? "Guardar Alterações" : "Criar Mês Temporário"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
