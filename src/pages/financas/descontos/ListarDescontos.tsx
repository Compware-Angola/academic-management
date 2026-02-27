import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Link } from "react-router-dom";
import { Home, Search, RefreshCw, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState, useMemo } from "react";
import { useQueryFetchDescontos } from "@/hooks/financas/descontos/use-query-descontos.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { formatarData } from "@/util/date-formate.ts";
import { CreateDescontoDialog, CreateDescontoFormData } from "./CreateDescontoDialog.tsx";
import { useMutationCreateDesconto } from "@/hooks/financas/descontos/use-mutation-create-desconto.ts";

export default function ListarDescontos() {
  const [codigoInput, setCodigoInput] = useState("");
  const [descricaoInput, setDescricaoInput] = useState("");
  const [filters, setFilters] = useState({
    codigo: "",
    designacao: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateDescontoFormData>({
    descricao: "",
    taxa: "",
    data_inicio: "",
    data_fim: "",
    obs: "",
    estado: true,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Estado para edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, refetch, isFetching } = useQueryFetchDescontos({
    codigo: filters.codigo || undefined,
    designacao: filters.designacao || undefined,
    page,
    limit,
  });

  const resetForm = () => {
    setFormData({
      descricao: "",
      taxa: "",
      data_inicio: "",
      data_fim: "",
      obs: "",
      estado: true,
    });
  };

  const { mutateAsync, isPending } = useMutationCreateDesconto();

  const items = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const total = data?.total ?? 0;
  const startIndex = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  const pageList = useMemo(() => {
    const maxButtons = 5;
    const pages: number[] = [];
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  // normalize any date-string to yyyy-mm-dd (returns empty string for falsy)
  const toYYYYMMDD = (value?: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      // if parsing fails, try simple regex for yyyy-mm-dd-like input
      const m = String(value).match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (m) {
        const yyyy = m[1];
        const mm = String(m[2]).padStart(2, "0");
        const dd = String(m[3]).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      }
      return String(value);
    }
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleLimitChange = (v: number) => {
    setLimit(v);
    setPage(1);
  };

  const handleSearch = () => {
    setFilters({
      codigo: codigoInput,
      designacao: descricaoInput,
    });
    setPage(1);
  };

  const handleClear = () => {
    setCodigoInput("");
    setDescricaoInput("");
    setFilters({
      codigo: "",
      designacao: "",
    });
    setPage(1);
  };

  const handleCreateSubmit = async () => {
    await mutateAsync({
      descricao: formData.descricao,
      taxa: Number(formData.taxa),
      data_inicio: formData.data_inicio,
      data_fim: formData.data_fim,
      obs: formData.obs,
      estado: formData.estado,
    });
    setIsModalOpen(false);
    resetForm();
    await refetch();
  };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    setIsUpdating(true);
    try {
      const body = {
        descricao: formData.descricao,
        taxa: Number(formData.taxa),
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        obs: formData.obs,
        estado: formData.estado,
      };
      const res = await fetch(`http://localhost:3002/api/discount/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro ao atualizar desconto");
      setIsModalOpen(false);
      setEditingId(null);
      resetForm();
      await refetch();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <Home className="h-4 w-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Finanças</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Gestão de Descontos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight">Descontos</h1>
        </div>
      </div>

      <CreateDescontoDialog
        open={isModalOpen}
        onOpenChange={(open) => {
          // fechar modal limpa estado de edição
          if (!open) {
            setEditingId(null);
            resetForm();
          }
          setIsModalOpen(open);
        }}
        formData={formData}
        onChange={setFormData}
        onSubmit={editingId ? handleEditSubmit : handleCreateSubmit}
        isSubmitting={isPending || isUpdating}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                placeholder="Filtrar por código"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Filtrar por descrição"
                value={descricaoInput}
                onChange={(e) => setDescricaoInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} disabled={isFetching}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={isFetching}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        className="gap-2"
        onClick={() => {
          setEditingId(null);
          resetForm();
          setIsModalOpen(true);
        }}
      >
        <Plus className="h-4 w-4" />
        Novo Desconto
      </Button>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Percentual (%)</TableHead>
                <TableHead>Data Inicial</TableHead>
                <TableHead>Data Final</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[110px]">Editar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum desconto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{item.taxa}%</TableCell>
                    <TableCell>{formatarData(item.data_inicio)}</TableCell>
                    <TableCell>{formatarData(item.data_fim)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.estado
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.estado ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // popular form e abrir modal para edição
                            setEditingId(item.id);
                            setFormData({
                              descricao: item.descricao ?? "",
                              taxa: String(item.taxa ?? ""),
                              data_inicio: toYYYYMMDD(item.data_inicio),
                              data_fim: toYYYYMMDD(item.data_fim),
                              obs: item.obs ?? "",
                              estado: Boolean(item.estado),
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex}–{endIndex} de {total} registros
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1 || isFetching}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1 || isFetching}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageList.length > 0 && (
            <div className="flex items-center space-x-1">
              {pageList[0] > 1 && (
                <button
                  className="px-2 py-1 rounded-md text-sm text-muted-foreground"
                  onClick={() => setPage(1)}
                  disabled={isFetching}
                >
                  1
                </button>
              )}
              {pageList[0] > 2 && <span className="px-2">…</span>}

              {pageList.map((p) => (
                <button
                  key={p}
                  className={`px-3 py-1 rounded-md text-sm ${
                    p === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => setPage(p)}
                  disabled={isFetching}
                >
                  {p}
                </button>
              ))}

              {pageList[pageList.length - 1] < totalPages - 1 && <span className="px-2">…</span>}
              {pageList[pageList.length - 1] < totalPages && (
                <button
                  className="px-2 py-1 rounded-md text-sm text-muted-foreground"
                  onClick={() => setPage(totalPages)}
                  disabled={isFetching}
                >
                  {totalPages}
                </button>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages || isFetching}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages || isFetching}
          >
            {">>"}
          </Button>

          <div className="flex items-center space-x-2 ml-4">
            <label className="text-sm text-muted-foreground">Por página:</label>
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
