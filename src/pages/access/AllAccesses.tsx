import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { PageHeader } from "@/components/common/PageHeader";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

import { useAuth } from "@/hooks/use-auth";
import { useQueryAccesses } from "@/hooks/acess/use-query-accesses";
import { useMutationUpdateEstadoAcesso } from "@/hooks/acess/use-mutation-update-estado";
import { AcessoFormDialog } from "./components/CreateAcessModal";
import { format } from "date-fns";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

export function ListarAcessos() {
  const PASSWORD = "123456";

  const { user: userData } = useAuth();
  const estadoMutation = useMutationUpdateEstadoAcesso();

  const [createOpen, setCreateOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  const [filterType, setFilterType] = useState<"sigla" | "designacao">("sigla");
  const [filterValue, setFilterValue] = useState("");
  const [apenasAtivos, setApenasAtivos] = useState<"all" | "true" | "false">(
    "all",
  );

  const handleSearch = () => {
    setCurrentPage(1);
  };

  function handleConfirmPassword() {
    if (password === PASSWORD) {
      setPassword("");
      setPasswordError("");
      setPasswordModalOpen(false);
      setCreateOpen(true);
    } else {
      setPasswordError("Senha incorreta");
    }
  }

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

  // ─── PDF ────────────────────────────────────────────────
  const pdfData = useMemo(() => {
    if (!data.length) return null;

    return {
      filtros: [
        `Filtro: ${filterType}`,
        `Valor: ${filterValue || "—"}`,
        `Estado: ${apenasAtivos === "all" ? "Todos" : apenasAtivos === "true" ? "Ativos" : "Inativos"}`,
      ].join(" | "),
      total: data.length,
      rows: data.map((a) => ({
        id: a.pk_acesso,
        designacao: a.designacao,
        sigla: a.sigla,
        modulo: a.modulonome,
        tipo: a.tipoacesso,
        data: a.dataativacao,
        estado: a.ativo ? "Ativo" : "Inativo",
      })),
    };
  }, [data, filterType, filterValue, apenasAtivos]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Lista de Acessos"
      subtitle="Registos de acessos do sistema"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de acessos: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "id", label: "ID", width: "6%" },
          { key: "designacao", label: "Designação", width: "26%" },
          { key: "sigla", label: "Sigla", width: "10%" },
          { key: "modulo", label: "Módulo", width: "18%" },
          { key: "tipo", label: "Tipo", width: "12%" },
          { key: "data", label: "Data Ativação", width: "14%" },
          { key: "estado", label: "Estado", width: "14%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  // ─── EXCEL PROPS (paralelo ao pdfContent) ───────────────
  const excelProps = {
    documentTitle: "Lista de Acessos",
    subtitle: "Registos de acessos do sistema",
    infoSections: [
      {
        title: "Filtros Aplicados",
        content: "Filtro: sigla | Valor: ADM | Estado: Todos",
      },
      { title: "Resumo", content: ["Total de acessos: 42"] },
    ],
    mainTable: {
      headers: [
        { key: "id", label: "ID", width: 10 },
        { key: "designacao", label: "Designação", width: 40 },
        { key: "sigla", label: "Sigla", width: 12 },
        { key: "modulo", label: "Módulo", width: 25 },
        { key: "tipo", label: "Tipo", width: 15 },
        { key: "data", label: "Data Ativação", width: 18 },
        { key: "estado", label: "Estado", width: 12 },
      ],
      rows: data.map((item) => ({
        id: item.pk_acesso,
        designacao: item.designacao,
        sigla: item.sigla,
        modulo: item.modulonome,
        tipo: item.tipoacesso,
        data: item.dataativacao,
        estado: item.ativo ? "Ativo" : "Inativo",
      })),
      headerBackground: "#0D1B48",
    },
    footerNotice: "Documento gerado automaticamente pelo sistema.",
    primaryColor: "#0D1B48",
  };

  const baseFileName = `Acessos_${new Date().toISOString().slice(0, 10)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Todos Acessos" />

        {data.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {/* PDF */}
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`${baseFileName}.pdf`}
                showDownload
                showPrint
              />
            )}

            {/* Excel */}
            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`${baseFileName}.xlsx`}
                showDownload
              />
            )}
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
        <div className="w-full md:w-48">
          <label className="text-sm font-medium">Filtrar por</label>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as "sigla" | "designacao")}
          >
            <SelectTrigger>
              <SelectValue />
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
              <SelectValue />
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

        <Button onClick={() => setPasswordModalOpen(true)}>Criar Acesso</Button>
      </div>

      {/* Tabela */}
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

      {/* Paginação */}
      {data.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, total)} de {total}
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

      {/* Modal Senha */}
      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmação de Segurança</DialogTitle>
          </DialogHeader>

          <Input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPassword("");
                setPasswordError("");
                setPasswordModalOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmPassword}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Criar Acesso */}
      <AcessoFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
