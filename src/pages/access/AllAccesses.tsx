import { useMemo } from "react";
import { Switch } from "@/components/ui/switch";

import { useAuth } from "@/hooks/use-auth";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryAccesses } from "@/hooks/acess/use-query-accesses";
import { useMutationUpdateEstadoAcesso }
from "@/hooks/acess/use-mutation-update-estado.ts";
import { AcessoFormDialog } from "./components/CreateAcessModal";

export function ListarAcessos() {
  const [createOpen, setCreateOpen] = useState(false);

  const { user: userData } = useAuth();
  const estadoMutation = useMutationUpdateEstadoAcesso();

  // ----- Paginação -----
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  // ----- Filtros -----
  const [filterType, setFilterType] = useState<"sigla" | "designacao">("sigla");
  const [filterValue, setFilterValue] = useState("");
  const [apenasAtivos, setApenasAtivos] = useState<"all" | "true" | "false">("all"); 
// "" = todos | "true" = ativos | "false" = inativos
;


  // ----- Query -----
  const { data: acessos, isLoading } = useQueryAccesses({
    
    page: currentPage,
    limit: itemsPerPage,
    sigla: filterType === "sigla" ? filterValue : undefined,
    designacao: filterType === "designacao" ? filterValue : undefined,
     ...(apenasAtivos !== "all" && { apenasAtivos }),
  });

  const data = acessos?.data ?? [];
  const total = acessos?.total ?? 0;
  const totalPages = acessos?.totalPages ?? 1;


  const pdfData = useMemo(() => {
  if (!data.length) return null;

  const rows = data.map((a) => ({
    id: a.pk_acesso,
    designacao: a.designacao,
    sigla: a.sigla,
    modulo: a.modulonome,
    tipo: a.tipoacesso,
    data: a.dataativacao,
    estado: a.ativo ? "Ativo" : "Inativo",
  }));

  return {
    filtros: [
      `Filtro: ${filterType}`,
      `Valor: ${filterValue || "—"}`,
      `Estado: ${apenasAtivos ? "Ativos" : "Inativos"}`,
    ].join("  |  "),
    total: data.length,
    rows,
  };
}, [data, filterType, filterValue, apenasAtivos]);


const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Lista de Acessos"
    subtitle="Registos de acessos do sistema"
    infoSections={[
      {
        title: "Filtros Aplicados",
        content: pdfData.filtros,
      },
      {
        title: "Resumo",
        content: [`Total de acessos: ${pdfData.total}`],
      },
    ]}
    mainTable={{
      headers: [
        { key: "id", label: "ID", width: "6%" },
        { key: "designacao", label: "Designação", width: "26%" },
        { key: "sigla", label: "Sigla", width: "10%" },
        { key: "modulo", label: "Módulo", width: "18%" },
        { key: "tipo", label: "Tipo", width: "12%" },
        { key: "data", label: "Data Ativação", width: "14%" },
        {
          key: "estado",
          label: "Estado",
          width: "14%",
          align: "center",
        },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
    customFooter="Sistema de Gestão de Acessos"
  />
) : null;


  const handleSearch = () => {
    setCurrentPage(1); 
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <PageHeader title="Todos Acessos" />
        </div>


        {data.length > 0 && pdfContent && (
          <PDFActions
            document={pdfContent}
            fileName={`Acessos_${new Date().toISOString().slice(0, 10)}.pdf`}
            showDownload
            showPrint
          />
        )}
      </div>

      {/* 🔎 Filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
        <div className="w-full md:w-48">
          <label className="text-sm font-medium">Filtrar por</label>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as "sigla" | "designacao")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sigla">Sigla</SelectItem>
              <SelectItem value="designacao">Designação</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <label className="text-sm font-medium">Estado</label>
          <Select
            value={apenasAtivos}
            onValueChange={(v) => {
              setApenasAtivos(v as "all" | "true" | "false");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Ativos</SelectItem>
              <SelectItem value="false">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-80">
          <label className="text-sm font-medium">Pesquisar</label>
          <Input
            placeholder={`Digite a ${filterType}`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Button onClick={handleSearch}>Pesquisar</Button>
        <Button
            onClick={() => setCreateOpen(true)}
          >
            Criar Acesso
          </Button>
      </div>

      {/* 📋 Tabela */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Designação</TableHead>
              <TableHead>Sigla</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data Ativação</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  A carregar...
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((acesso) => (
                <TableRow key={acesso.pk_acesso}>
                  <TableCell>{acesso.pk_acesso}</TableCell>
                  <TableCell>{acesso.designacao}</TableCell>
                  <TableCell>{acesso.sigla}</TableCell>
                  <TableCell>{acesso.modulonome}</TableCell>
                  <TableCell>{acesso.tipoacesso}</TableCell>
                  <TableCell>{acesso.dataativacao}</TableCell>
                  <TableCell>
                    <TableCell>
                      <Switch
                        checked={Boolean(acesso.ativo)}
                        disabled={estadoMutation.isPending}
                        onCheckedChange={() =>
                          estadoMutation.mutate({
                            acessoId: acesso.pk_acesso,
                            userId: userData.user.pk_utilizador,
                          })
                        }
                      />
                    </TableCell>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nenhum acesso encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ⏮️ Paginação */}
      {data.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, total)} de {total} registos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm px-3 py-1">
              Página {currentPage} de {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <AcessoFormDialog
      open={createOpen}
      onClose={() => setCreateOpen(false)}
    />
    </div>
  );
}
