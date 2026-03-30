import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Check, Eye, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Solicitacao } from "@/services/access/solicitacao/fetch-solicitacao.service";
import { useQueryListarSolicitacoes } from "@/hooks/acess/use-query-listar-solicitacoes";
import { ESTADOS, getEstadoBadge } from "./components/estado-badge";
import { useRejectSolicitacao } from "@/hooks/acess/use-mutation-reject-solicitacao";
import { useAprovarSolicitacao } from "@/hooks/acess/use-mutation-accept-solicitacao";
import { useAuth } from "@/hooks/use-auth";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryServicos } from "@/hooks/acess/use-query-listar-servicos-solicitacao";



/* ---------- FILTROS ---------- */


export default function SolicitacoesEncaminhadas() {
  const [codigoAnoLectivo, setCodigoAnoLectivo] = useState<string>("");

  const [serviceId, setServiceId] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSolicitacao, setSelectedSolicitacao] =
    useState<Solicitacao | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  /* ---------- QUERY ---------- */
const { data: anosAcademicos } = useQueryAnoAcademico();
const { data: servicos } = useQueryServicos({codigo_ano_lectivo: 23});


const { data, isLoading, isFetching } = useQueryListarSolicitacoes({
  serviceId:
    serviceId && serviceId !== "all"
      ? Number(serviceId)
      : undefined,
  estado: estado === "all" ? undefined : estado,
  page: currentPage,
  limit: 10,
});


//console.log("SOLICITACAO: ", data)

const { mutate: rejectMutate } = useRejectSolicitacao()
const { mutate: approveMutate } = useAprovarSolicitacao()

const {user:userData} = useAuth()
const userIdLogado =userData.user.pk_utilizador

function handleAprovar(row: Solicitacao) {

  approveMutate({
    solicitacaoId: row.codigo_solicitacao,
    userId: userIdLogado,
    descricao:  String(row.descricao ?? row.descricao_servico ?? "")
  })
 
}

function handleRejeitar(row: Solicitacao) {

  
  rejectMutate({
    solicitacaoId: row.codigo_solicitacao,
    userId: userIdLogado,
    descricao:  String(row.descricao ?? row.descricao_servico ?? "")
  })

}


  /* ---------- MAP DATA ---------- */
  const solicitacoes = useMemo(() => {
    return (
      data?.data.map((item) => ({
        ...item,
        numero: item.codigo,
        solicitante: item.nome_remetente,
        servico: item.descricao_servico,
        dataSubmissao: item.data_solicitacao,
      })) ?? []
    );
  }, [data]);


  /* ---------- COLUMNS ---------- */
  const columns = [
    { header: "Código", accessor: "codigo" },
    { header: "Remetente", accessor: "nome_remetente" },
    { header: "Serviço", accessor: "descricao_servico" },
    { header: "Data", accessor: "data_solicitacao" },
    {
      header: "Estado",
      accessor: "estado",
      cell: (row: Solicitacao) => getEstadoBadge(row.estado),
    },
    {
      header: "Ações",
      accessor: "acoes",
     cell: (row: Solicitacao) => (
  <div className="flex items-center gap-2">
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

      { row.estado === "solicitacao encaminhada" && (
        <>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSolicitacao(row);
              handleAprovar(row);
            }}
          >
          <Check className="h-4 w-4 mr-1 text-green-600" />
          Aprovar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedSolicitacao(row);
            handleRejeitar(row);
          }}
        >
          <X className="h-4 w-4 mr-1 text-red-600" />
          Rejeitar
        </Button>

        </>
          )
        }

  </div>
),

    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitações Encaminhadas"
        subtitle="Gestão de solicitações encaminhadas pelos utilizadores"
      />

      {/* ---------- FILTROS ---------- */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Serviço</label>

              <Select value={serviceId} onValueChange={setServiceId}>
  <SelectTrigger>
    <SelectValue placeholder="Todos os serviços" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="all">Todos</SelectItem>

    {servicos?.map((servico) => (
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
              <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os estados" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>

                {ESTADOS.map((e) => (
                  <SelectItem key={e.value} value={e.value}>
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            </div>

            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={() => setCurrentPage(1)}
              >
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------- TABELA ---------- */}
      <DataTable
        columns={columns}
        data={solicitacoes}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />

      {/* ---------- MODAL ---------- */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
          </DialogHeader>

          {selectedSolicitacao && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Código</p>
                  <p className="font-medium">
                    {selectedSolicitacao.codigo}
                  </p>
                </div>
                {getEstadoBadge(selectedSolicitacao.estado)}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Remetente</p>
                <p className="font-medium">
                  {selectedSolicitacao.nome_remetente}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-medium">
                  {selectedSolicitacao.descricao_servico}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="font-medium">
                  {selectedSolicitacao.descricao}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
