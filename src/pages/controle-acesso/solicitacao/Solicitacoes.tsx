import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useQueryListarAllSolicitacoes } from "@/hooks/acess/use-query-listar-all-solicitacoes";
import { useQueryServicos } from "@/hooks/acess/use-query-listar-servicos-solicitacao";
import { useAuth } from "@/hooks/use-auth";

const ESTADOS_SOLICITACAO = [
  { value: "Solicitações Pendentes", label: "Solicitações Pendentes" },
  { value: "Solicitações Respondidas", label: "Solicitações Respondidas" },
  { value: "solicitacao encaminhada", label: "Solicitação Encaminhada" },
];

type SolicitacaoItem = {
  codigo_solicitacao: number;
  matricula: number;
  nome: string;
  curso: string;
  servico: string;
  data_solicitacao: string;
};

export default function Solicitacoes() {
  const [selectedSolicitacao, setSelectedSolicitacao] =
    useState<SolicitacaoItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [serviceId, setServiceId] = useState("404");
  const [estadoSolicitacao, setEstadoSolicitacao] = useState(
    "Solicitações Respondidas"
  );

  const { user } = useAuth();
  const userIdLogado = user?.user?.pk_utilizador;

  const { data: servicos } = useQueryServicos({
    codigo_ano_lectivo: 23,
  });

  const { data, isLoading, isFetching } = useQueryListarAllSolicitacoes({
    page: currentPage,
    limit: 10,
    estadoSolicitacao,
    tipoServicoSelecionado: Number(serviceId),
    userId: Number(userIdLogado),
  });

  const solicitacoes = data?.data ?? [];

  function formatDate(dateString: string) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const exportRows = useMemo(
    () =>
      solicitacoes.map((item: SolicitacaoItem) => ({
        nome: item.nome,
        matricula: item.matricula,
        servico: item.servico,
        curso: item.curso ?? "—",
        data: formatDate(item.data_solicitacao),
      })),
    [solicitacoes]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Todas as Solicitações"
        subtitle="Listagem completa de solicitações"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${data?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "nome", label: "Nome", width: "25%" },
            { key: "matricula", label: "Matrícula", width: "15%" },
            { key: "servico", label: "Serviço", width: "25%" },
            { key: "curso", label: "Curso", width: "20%" },
            { key: "data", label: "Data", width: "15%" },
          ],
          rows: exportRows,
          headerBackground: "#0D1B48",
        }}
        footerNotice="Documento gerado automaticamente pelo sistema."
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Todas as Solicitações",
          subtitle: "Listagem completa de solicitações",
          infoSections: [
            {
              title: "Resumo",
              content: `Total de registos: ${data?.total ?? exportRows.length}`,
            },
          ],
          mainTable: {
            headers: [
              { key: "nome", label: "Nome", width: 30 },
              { key: "matricula", label: "Matrícula", width: 20 },
              { key: "servico", label: "Serviço", width: 30 },
              { key: "curso", label: "Curso", width: 25 },
              { key: "data", label: "Data", width: 20 },
            ],
            rows: exportRows,
          },
          footerNotice: "Documento gerado automaticamente pelo sistema.",
          primaryColor: "#0D1B48",
        }
      : null;

  const columns = [
    { header: "Matrícula", accessor: "matricula" },
    { header: "Nome", accessor: "nome" },
    {
      header: "Curso",
      accessor: "curso",
      cell: (row: SolicitacaoItem) => row.curso ?? "—",
    },
    { header: "Serviço", accessor: "servico" },
    {
      header: "Data de Solicitação",
      accessor: "data_solicitacao",
      cell: (row: SolicitacaoItem) => formatDate(row.data_solicitacao),
    },
    {
      header: "Ações",
      accessor: "acoes",
      cell: (row: SolicitacaoItem) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedSolicitacao(row);
            setShowDetails(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Todas as Solicitações"
        subtitle="Listagem completa"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Solicitacoes_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Solicitacoes_${new Date()
                  .toISOString()
                  .slice(0, 10)}.xlsx`}
                showDownload
              />
            )}
          </>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Serviço</label>
              <Select
                value={serviceId}
                onValueChange={(value) => {
                  setServiceId(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os serviços" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="404">Todos</SelectItem>

                  {servicos?.map((servico: any) => (
                    <SelectItem
                      key={servico.CODIGO}
                      value={String(servico.CODIGO)}
                    >
                      {servico.DESCRICAO}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={estadoSolicitacao}
                onValueChange={(value) => {
                  setEstadoSolicitacao(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>

                <SelectContent>
                  {ESTADOS_SOLICITACAO.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={() => setCurrentPage(1)}>
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={solicitacoes}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
          </DialogHeader>

          {selectedSolicitacao && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Código</p>
                <p className="font-medium">
                  {selectedSolicitacao.codigo_solicitacao}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{selectedSolicitacao.nome}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Matrícula</p>
                <p className="font-medium">{selectedSolicitacao.matricula}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-medium">{selectedSolicitacao.servico}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Curso</p>
                <p className="font-medium">
                  {selectedSolicitacao.curso ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Data de Solicitação
                </p>
                <p className="font-medium">
                  {formatDate(selectedSolicitacao.data_solicitacao)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}