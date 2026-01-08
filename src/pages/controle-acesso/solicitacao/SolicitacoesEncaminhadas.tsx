import { useState } from "react";
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
import { Eye, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Solicitacao {
  id: number;
  numero: string;
  solicitante: string;
  servico: string;
  dataSubmissao: string;
  estado: "pendente" | "em_analise" | "aprovado" | "rejeitado";
  descricao: string;
  observacoes: string;
}

const mockServicos = [
  { id: "1", nome: "Declaração de Matrícula" },
  { id: "2", nome: "Certificado de Notas" },
  { id: "3", nome: "Histórico Escolar" },
  { id: "4", nome: "Carta de Recomendação" },
  { id: "5", nome: "Pedido de Equivalência" },
];

const mockEstados = [
  { id: "pendente", nome: "Pendente" },
  { id: "em_analise", nome: "Em Análise" },
  { id: "aprovado", nome: "Aprovado" },
  { id: "rejeitado", nome: "Rejeitado" },
];

const mockSolicitacoes: Solicitacao[] = [
  {
    id: 1,
    numero: "SOL-2024-001",
    solicitante: "João António Silva",
    servico: "Declaração de Matrícula",
    dataSubmissao: "2024-01-15",
    estado: "pendente",
    descricao: "Solicitação de declaração para fins de trabalho",
    observacoes: "",
  },
  {
    id: 2,
    numero: "SOL-2024-002",
    solicitante: "Maria Fernanda Costa",
    servico: "Certificado de Notas",
    dataSubmissao: "2024-01-14",
    estado: "em_analise",
    descricao: "Certificado para candidatura a mestrado",
    observacoes: "Aguardando validação das notas do último semestre",
  },
  {
    id: 3,
    numero: "SOL-2024-003",
    solicitante: "Pedro Manuel Santos",
    servico: "Histórico Escolar",
    dataSubmissao: "2024-01-13",
    estado: "aprovado",
    descricao: "Histórico completo para transferência",
    observacoes: "Documento pronto para retirada",
  },
  {
    id: 4,
    numero: "SOL-2024-004",
    solicitante: "Ana Beatriz Nunes",
    servico: "Pedido de Equivalência",
    dataSubmissao: "2024-01-12",
    estado: "rejeitado",
    descricao: "Equivalência de disciplinas do curso anterior",
    observacoes: "Documentação incompleta - falta programa das disciplinas",
  },
];

export default function SolicitacoesEncaminhadas() {
  const [servico, setServico] = useState("");
  const [estado, setEstado] = useState("");
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(mockSolicitacoes);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFiltrar = () => {
    let filtered = mockSolicitacoes;
    
    if (servico) {
      const servicoNome = mockServicos.find(s => s.id === servico)?.nome;
      filtered = filtered.filter(s => s.servico === servicoNome);
    }
    
    if (estado) {
      filtered = filtered.filter(s => s.estado === estado);
    }
    
    setSolicitacoes(filtered);
    setCurrentPage(1);
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pendente: "outline",
      em_analise: "secondary",
      aprovado: "default",
      rejeitado: "destructive",
    };
    
    const labels: Record<string, string> = {
      pendente: "Pendente",
      em_analise: "Em Análise",
      aprovado: "Aprovado",
      rejeitado: "Rejeitado",
    };
    
    return <Badge variant={variants[estado]}>{labels[estado]}</Badge>;
  };

  const columns = [
    { header: "Nº Solicitação", accessor: "numero" },
    { header: "Solicitante", accessor: "solicitante" },
    { header: "Serviço", accessor: "servico" },
    { header: "Data", accessor: "dataSubmissao" },
    {
      header: "Estado",
      accessor: "estado",
      cell: (row: Solicitacao) => getEstadoBadge(row.estado),
    },
    {
      header: "Ações",
      accessor: "acoes",
      cell: (row: Solicitacao) => (
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
        title="Solicitações Encaminhadas"
        subtitle="Gestão de solicitações encaminhadas pelos utilizadores"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Serviço</label>
              <Select value={servico} onValueChange={setServico}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {mockServicos.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {mockEstados.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleFiltrar} className="w-full">
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
        currentPage={currentPage}
        totalPages={Math.ceil(solicitacoes.length / 10)}
        onPageChange={setCurrentPage}
      />

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
          </DialogHeader>
          {selectedSolicitacao && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Número</p>
                  <p className="font-medium">{selectedSolicitacao.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  {getEstadoBadge(selectedSolicitacao.estado)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solicitante</p>
                <p className="font-medium">{selectedSolicitacao.solicitante}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-medium">{selectedSolicitacao.servico}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Submissão</p>
                <p className="font-medium">{selectedSolicitacao.dataSubmissao}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p className="font-medium">{selectedSolicitacao.descricao}</p>
              </div>
              {selectedSolicitacao.observacoes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium">{selectedSolicitacao.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
