import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Link } from "react-router-dom";
import { Home, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { useQueryFetchDescontosAdd } from "@/hooks/financas/descontos/use-query-descontos-add.ts";
import { useMutationCreateDescontoAdd } from "@/hooks/financas/descontos/use-mutation-create-desconto-add.ts";
import { CreateDescontoAddBody } from "@/services/financas/descontos/descontos.service.ts";
import AtribuirDescontoModal from "./AtribuirDescontoModal";
import {toast} from "sonner";
import {useMutationUpdateDescontoAdd} from "@/hooks/financas/descontos/use-mutation-update-desconto-add.ts";

interface AtribuirItem {
  codigo_matricula: number;
  nome_completo: string;
  bilhete_identidade?: string | null;
  curso?: string | null;
  codigo_instituicao?: number | null;
  instituicao?: string | null;
  codigo_tipo_desconto?: number | null;
  descricao?: string | null;
  semestre?: number | null;
  taxa?: number | null;
  isentar_multa?: boolean | null;
  codigo_utilizador?: number | null;
  tipo_taxa_desconto_especial?: number | null; // codigo do desconto
  canal?: string | null;
  codigo_anolectivo?: number | null;
  ano_lectivo?: string | null;
  observacao?: string | null;
  created_at?: string | null;
  codigo?: number | null;
}

export default function AtribuirDescontos() {
  // filter inputs
  const [codigoInput, setCodigoInput] = useState("");
  const [codigoAnoInput, setCodigoAnoInput] = useState("");
  const [semestreInput, setSemestreInput] = useState("");
  const [matriculaInput, setMatriculaInput] = useState("");

  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [items, setItems] = useState<AtribuirItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const startIndex = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  const { data, isFetching: queryFetching, refetch } = useQueryFetchDescontosAdd({
    page: page,
    limit: limit,
    codigo: filters.codigo,
    codigoAnoLectivo: filters.codigoAnoLectivo,
    semestre: filters.semestre,
    codigoMatricula: filters.codigoMatricula,
  });

  useEffect(() => {
    if (data) {
      setItems(data.data ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    }
  }, [data]);

    const [editingId, setEditingId] = useState<number | null>(null);

    const { mutateAsync: mutateCreateAdd, isPending: isCreatingAdd } = useMutationCreateDescontoAdd();
    const { mutateAsync: mutateUpdateAdd, isPending: isUpdatingAdd } = useMutationUpdateDescontoAdd();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Partial<CreateDescontoAddBody> | undefined>(undefined);

    const openEditModal = (row: AtribuirItem) => {
        setEditingId(row.codigo ?? null); // 'codigo' parece ser o ID da atribuição na sua interface
        setModalInitial({
            observacao: row.observacao ?? undefined,
            codigoMatricula: row.codigo_matricula,
            codigoTaxa: row.tipo_taxa_desconto_especial ?? undefined,
            codigoInstituicao: row.codigo_instituicao ?? undefined,
            codigoAno: row.codigo_anolectivo ?? undefined,
            semestre: row.semestre ?? undefined,
        });
        setIsModalOpen(true);
    };

  const handleSubmitAssign = async (body: CreateDescontoAddBody) => {
      try {
          if (editingId) {
              await mutateUpdateAdd({ id: editingId, body });
          } else {
              await mutateCreateAdd(body);
          }
          setIsModalOpen(false);
          setEditingId(null);
          await refetch();
      } catch (err) {
          toast("Erro ao atribuir desconto: " + getErrorMessage(err));
      }
  };

  const effectiveFetching = queryFetching || isCreatingAdd;

  const handleSearch = () => {
    setFilters({
      codigo: codigoInput || undefined,
      codigoAnoLectivo: codigoAnoInput || undefined,
      semestre: semestreInput || undefined,
      codigoMatricula: matriculaInput || undefined,
    });
    setPage(1);
  };

  function getErrorMessage(e: unknown) {
    if (e instanceof Error) return e.message;
    try {
      return String(e);
    } catch {
      return 'Erro desconhecido';
    }
  }

  const handleClear = () => {
    setCodigoInput("");
    setCodigoAnoInput("");
    setSemestreInput("");
    setMatriculaInput("");
    setFilters({});
    setPage(1);
  };

  const handleLimitChange = (v: number) => {
    setLimit(v);
    setPage(1);
  };

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
                <BreadcrumbPage>Atribuição de Descontos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold tracking-tight">Atribuição de Descontos</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="codigo">Desconto`</Label>
              <Input id="codigo" placeholder="Código do desconto" value={codigoInput} onChange={(e) => setCodigoInput(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semestre">Semestre</Label>
              <Input id="semestre" placeholder="Semestre" value={semestreInput} onChange={(e) => setSemestreInput(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input id="matricula" placeholder="Código matrícula" value={matriculaInput} onChange={(e) => setMatriculaInput(e.target.value)} />
            </div>

            <div className="col-span-full flex gap-2">
              <Button onClick={handleSearch} disabled={effectiveFetching}>
                <Search className="h-4 w-4 mr-2" />Buscar
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={effectiveFetching}>
                <RefreshCw className={`h-4 w-4 mr-2 ${effectiveFetching ? "animate-spin" : ""}`} />Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

        <Button
            className="gap-2 mb-2"
            onClick={() => {
                setEditingId(null);
                setModalInitial(undefined);
                setIsModalOpen(true);
            }}
        >
            Atribuir Desconto
        </Button>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matrícula</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Instituição</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Código Desconto</TableHead>
                <TableHead>Ano Letivo</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead className="w-[120px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {effectiveFetching ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, idx) => (
                  <TableRow key={`${item.codigo_matricula}-${idx}`}>
                    <TableCell className="font-medium">{item.codigo_matricula}</TableCell>
                    <TableCell>{item.nome_completo}</TableCell>
                    <TableCell>{item.instituicao ?? item.curso ?? "-"}</TableCell>
                    <TableCell>{item.descricao ?? "-"}</TableCell>
                    <TableCell>{item.tipo_taxa_desconto_especial ?? item.codigo ?? "-"}</TableCell>
                    <TableCell>{item.ano_lectivo ?? "-"}</TableCell>
                    <TableCell>{item.semestre ?? "-"}</TableCell>
                      <TableCell>
                          <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>
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
          <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1 || effectiveFetching}>
            {"<<"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1 || effectiveFetching}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageList.length > 0 && (
            <div className="flex items-center space-x-1">
              {pageList[0] > 1 && (
                <button className="px-2 py-1 rounded-md text-sm text-muted-foreground" onClick={() => setPage(1)} disabled={effectiveFetching}>
                  1
                </button>
              )}
              {pageList[0] > 2 && <span className="px-2">…</span>}

              {pageList.map((p) => (
                <button key={p} className={`px-3 py-1 rounded-md text-sm ${p === page ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`} onClick={() => setPage(p)} disabled={effectiveFetching}>
                  {p}
                </button>
              ))}

              {pageList[pageList.length - 1] < totalPages - 1 && <span className="px-2">…</span>}
              {pageList[pageList.length - 1] < totalPages && (
                <button className="px-2 py-1 rounded-md text-sm text-muted-foreground" onClick={() => setPage(totalPages)} disabled={effectiveFetching}>
                  {totalPages}
                </button>
              )}
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages || effectiveFetching}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages || effectiveFetching}>
            {">>"}
          </Button>

          <div className="flex items-center space-x-2 ml-4">
            <label className="text-sm text-muted-foreground">Por página:</label>
            <select className="rounded-md border px-2 py-1 text-sm" value={limit} onChange={(e) => handleLimitChange(Number(e.target.value))}>
              {[5, 10, 20, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {data?.data && data.data.length === 0 && !queryFetching && (
        <div className="text-sm text-muted-foreground p-4">Nenhum registro encontrado.</div>
      )}

      <AtribuirDescontoModal
          open={isModalOpen}
          onOpenChange={(open) => {
              if(!open) setEditingId(null);
              setIsModalOpen(open);
          }}
          initial={modalInitial}
          onSubmit={handleSubmitAssign}
          isSubmitting={isCreatingAdd || isUpdatingAdd}
          isEditing={!!editingId}
      />
    </div>
  );
}
