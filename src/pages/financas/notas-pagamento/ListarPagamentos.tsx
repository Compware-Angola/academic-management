import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, Search, RefreshCw, FileDown, Printer, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Pagamento {
  id: number;
  nOperacao: string;
  estudante: string;
  matricula: string;
  curso: string;
  valorDepositado: number;
  formaPagamento: string;
  canal: string;
  caixa: string;
  dataBanco: string;
  dataRegisto: string;
  statusPagamento: string;
  statusMovimento: string;
  tipoPagamento: string;
  codigoFactura: string;
  contaMovimentada: string;
  utilizador: string;
  observacao: string;
}

const mockPagamentos: Pagamento[] = [
  {
    id: 1,
    nOperacao: "OPB-2024-000101",
    estudante: "João Manuel Silva",
    matricula: "21390",
    curso: "Engenharia Informática",
    valorDepositado: 45000,
    formaPagamento: "Transferência Bancária",
    canal: "Balcão",
    caixa: "CX-001",
    dataBanco: "2024-01-20",
    dataRegisto: "2024-01-20",
    statusPagamento: "Confirmado",
    statusMovimento: "Processado",
    tipoPagamento: "Propina",
    codigoFactura: "NP-2024-001234",
    contaMovimentada: "AO06.0055.0000.1234.5678",
    utilizador: "admin.financas",
    observacao: "Pagamento propina Janeiro",
  },
  {
    id: 2,
    nOperacao: "OPB-2024-000102",
    estudante: "Ana Beatriz Santos",
    matricula: "21234",
    curso: "Medicina",
    valorDepositado: 85000,
    formaPagamento: "Depósito Bancário",
    canal: "ATM",
    caixa: "CX-002",
    dataBanco: "2024-01-21",
    dataRegisto: "2024-01-21",
    statusPagamento: "Confirmado",
    statusMovimento: "Processado",
    tipoPagamento: "Propina",
    codigoFactura: "NP-2024-001237",
    contaMovimentada: "AO06.0055.0000.9876.5432",
    utilizador: "admin.financas",
    observacao: "Pagamento integral confirmado",
  },
  {
    id: 3,
    nOperacao: "OPB-2024-000103",
    estudante: "Carlos Eduardo Martins",
    matricula: "21567",
    curso: "Arquitectura",
    valorDepositado: 30000,
    formaPagamento: "Multicaixa Express",
    canal: "Mobile Banking",
    caixa: "CX-001",
    dataBanco: "2024-01-22",
    dataRegisto: "2024-01-22",
    statusPagamento: "Pendente Confirmação",
    statusMovimento: "Em Processamento",
    tipoPagamento: "Propina",
    codigoFactura: "NP-2024-001238",
    contaMovimentada: "AO06.0055.0000.4321.8765",
    utilizador: "caixa.01",
    observacao: "Aguardando confirmação do banco",
  },
  {
    id: 4,
    nOperacao: "OPB-2024-000104",
    estudante: "Maria Fernanda Costa",
    matricula: "21456",
    curso: "Gestão de Empresas",
    valorDepositado: 8000,
    formaPagamento: "Numerário",
    canal: "Balcão",
    caixa: "CX-003",
    dataBanco: "2024-01-23",
    dataRegisto: "2024-01-23",
    statusPagamento: "Confirmado",
    statusMovimento: "Processado",
    tipoPagamento: "Taxa",
    codigoFactura: "NP-2024-001235",
    contaMovimentada: "AO06.0055.0000.1111.2222",
    utilizador: "caixa.02",
    observacao: "Taxa de inscrição",
  },
  {
    id: 5,
    nOperacao: "OPB-2024-000105",
    estudante: "Pedro António Luís",
    matricula: "21789",
    curso: "Direito",
    valorDepositado: 52000,
    formaPagamento: "TPA",
    canal: "Balcão",
    caixa: "CX-001",
    dataBanco: "2024-01-24",
    dataRegisto: "2024-01-24",
    statusPagamento: "Rejeitado",
    statusMovimento: "Cancelado",
    tipoPagamento: "Propina",
    codigoFactura: "NP-2024-001236",
    contaMovimentada: "AO06.0055.0000.3333.4444",
    utilizador: "admin.financas",
    observacao: "Transação rejeitada pelo terminal",
  },
  {
    id: 6,
    nOperacao: "OPB-2024-000106",
    estudante: "Luísa Maria Gomes",
    matricula: "21890",
    curso: "Psicologia",
    valorDepositado: 35000,
    formaPagamento: "Transferência Bancária",
    canal: "Online",
    caixa: "CX-002",
    dataBanco: "2024-01-25",
    dataRegisto: "2024-01-25",
    statusPagamento: "Confirmado",
    statusMovimento: "Processado",
    tipoPagamento: "Propina",
    codigoFactura: "NP-2024-001240",
    contaMovimentada: "AO06.0055.0000.5555.6666",
    utilizador: "caixa.01",
    observacao: "Propina Fevereiro paga antecipadamente",
  },
  {
    id: 7,
    nOperacao: "OPB-2024-000107",
    estudante: "Ricardo José Ferreira",
    matricula: "21345",
    curso: "Engenharia Civil",
    valorDepositado: 5000,
    formaPagamento: "Cheque",
    canal: "Balcão",
    caixa: "CX-003",
    dataBanco: "2024-01-26",
    dataRegisto: "2024-01-26",
    statusPagamento: "Pendente Confirmação",
    statusMovimento: "Em Processamento",
    tipoPagamento: "Emolumento",
    codigoFactura: "NP-2024-001241",
    contaMovimentada: "AO06.0055.0000.7777.8888",
    utilizador: "admin.financas",
    observacao: "Emolumento de declaração",
  },
];

const mockFormasPagamento = [
  "Depósito Bancário",
  "Transferência Bancária",
  "Multicaixa Express",
  "Numerário",
  "TPA",
  "Cheque",
];

const mockCaixas = ["CX-001", "CX-002", "CX-003"];

const mockStatusPagamento = ["Confirmado", "Pendente Confirmação", "Rejeitado"];

const mockStatusMovimento = ["Processado", "Em Processamento", "Cancelado"];

const mockCanais = ["Balcão", "Online", "Multicaixa", "ATM", "Mobile Banking"];

const mockTiposPagamento = ["Propina", "Taxa", "Emolumento", "Multa", "Outro"];

const getStatusPagamentoBadge = (status: string) => {
  switch (status) {
    case "Confirmado":
      return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
    case "Pendente Confirmação":
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
    case "Rejeitado":
      return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getStatusMovimentoBadge = (status: string) => {
  switch (status) {
    case "Processado":
      return <Badge variant="outline" className="border-green-500 text-green-600">{status}</Badge>;
    case "Em Processamento":
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{status}</Badge>;
    case "Cancelado":
      return <Badge variant="outline" className="border-red-500 text-red-600">{status}</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("pt-AO");
};

export default function ListarPagamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroFormaPagamento, setFiltroFormaPagamento] = useState<string>("all");
  const [filtroCaixa, setFiltroCaixa] = useState<string>("all");
  const [filtroStatusPagamento, setFiltroStatusPagamento] = useState<string>("all");
  const [filtroStatusMovimento, setFiltroStatusMovimento] = useState<string>("all");
  const [filtroCanal, setFiltroCanal] = useState<string>("all");
  const [filtroTipoPagamento, setFiltroTipoPagamento] = useState<string>("all");
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = mockPagamentos.filter((p) => {
    const matchSearch =
      p.nOperacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.estudante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigoFactura.toLowerCase().includes(searchTerm.toLowerCase());

    const matchForma = filtroFormaPagamento === "all" || p.formaPagamento === filtroFormaPagamento;
    const matchCaixa = filtroCaixa === "all" || p.caixa === filtroCaixa;
    const matchStatusPag = filtroStatusPagamento === "all" || p.statusPagamento === filtroStatusPagamento;
    const matchStatusMov = filtroStatusMovimento === "all" || p.statusMovimento === filtroStatusMovimento;
    const matchCanal = filtroCanal === "all" || p.canal === filtroCanal;
    const matchTipo = filtroTipoPagamento === "all" || p.tipoPagamento === filtroTipoPagamento;

    return matchSearch && matchForma && matchCaixa && matchStatusPag && matchStatusMov && matchCanal && matchTipo;
  });

  const handleLimparFiltros = () => {
    setSearchTerm("");
    setFiltroFormaPagamento("all");
    setFiltroCaixa("all");
    setFiltroStatusPagamento("all");
    setFiltroStatusMovimento("all");
    setFiltroCanal("all");
    setFiltroTipoPagamento("all");
  };

  const totalDepositado = filteredData.reduce((sum, p) => sum + p.valorDepositado, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Listagem de Pagamentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Listagem de Pagamentos</h1>
        <p className="text-muted-foreground">
          Todos os pagamentos registados no sistema com detalhes de caixa, forma de pagamento e estado.
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nº operação, estudante, matrícula ou código factura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros em grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Select value={filtroFormaPagamento} onValueChange={setFiltroFormaPagamento}>
              <SelectTrigger>
                <SelectValue placeholder="Forma Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Formas</SelectItem>
                {mockFormasPagamento.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroCaixa} onValueChange={setFiltroCaixa}>
              <SelectTrigger>
                <SelectValue placeholder="Caixa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Caixas</SelectItem>
                {mockCaixas.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroStatusPagamento} onValueChange={setFiltroStatusPagamento}>
              <SelectTrigger>
                <SelectValue placeholder="Status Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {mockStatusPagamento.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroStatusMovimento} onValueChange={setFiltroStatusMovimento}>
              <SelectTrigger>
                <SelectValue placeholder="Status Movimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Movimentos</SelectItem>
                {mockStatusMovimento.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroCanal} onValueChange={setFiltroCanal}>
              <SelectTrigger>
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Canais</SelectItem>
                {mockCanais.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroTipoPagamento} onValueChange={setFiltroTipoPagamento}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {mockTiposPagamento.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleLimparFiltros}>
              Limpar Filtros
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-3 w-3" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Total de Pagamentos</p>
            <p className="text-2xl font-bold">{filteredData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Total Depositado</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalDepositado)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Confirmados</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredData.filter((p) => p.statusPagamento === "Confirmado").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Exportar Excel
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Operação</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Forma Pgto.</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Caixa</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data Banco</TableHead>
                <TableHead>Status Pgto.</TableHead>
                <TableHead>Status Mov.</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhum pagamento encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((pag) => (
                  <TableRow key={pag.id}>
                    <TableCell className="font-mono font-medium text-sm">{pag.nOperacao}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{pag.estudante}</p>
                        <p className="text-xs text-muted-foreground font-mono">{pag.matricula}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{pag.formaPagamento}</TableCell>
                    <TableCell className="text-sm">{pag.canal}</TableCell>
                    <TableCell className="font-mono text-sm">{pag.caixa}</TableCell>
                    <TableCell className="font-medium font-mono text-sm">{formatCurrency(pag.valorDepositado)}</TableCell>
                    <TableCell className="text-sm">{formatDate(pag.dataBanco)}</TableCell>
                    <TableCell>{getStatusPagamentoBadge(pag.statusPagamento)}</TableCell>
                    <TableCell>{getStatusMovimentoBadge(pag.statusMovimento)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Ver Detalhes"
                        onClick={() => {
                          setSelectedPagamento(pag);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl! max-h-[90vh]! overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Detalhes do Pagamento
              {selectedPagamento && (
                <span className="font-mono text-muted-foreground">{selectedPagamento.nOperacao}</span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedPagamento && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusPagamentoBadge(selectedPagamento.statusPagamento)}
                  {getStatusMovimentoBadge(selectedPagamento.statusMovimento)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor Depositado</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(selectedPagamento.valorDepositado)}</p>
                </div>
              </div>

              <Separator />

              {/* Dados do Estudante */}
              <div>
                <h3 className="font-semibold mb-3">Dados do Estudante</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estudante</p>
                    <p className="font-medium">{selectedPagamento.estudante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Matrícula</p>
                    <p className="font-medium font-mono">{selectedPagamento.matricula}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Curso</p>
                    <p className="font-medium">{selectedPagamento.curso}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dados do Pagamento */}
              <div>
                <h3 className="font-semibold mb-3">Dados do Pagamento</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nº Operação</p>
                    <p className="font-medium font-mono">{selectedPagamento.nOperacao}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Código Factura</p>
                    <p className="font-medium font-mono">{selectedPagamento.codigoFactura}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Pagamento</p>
                    <p className="font-medium">{selectedPagamento.tipoPagamento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                    <p className="font-medium">{selectedPagamento.formaPagamento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Canal</p>
                    <p className="font-medium">{selectedPagamento.canal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Caixa</p>
                    <p className="font-medium font-mono">{selectedPagamento.caixa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conta Movimentada</p>
                    <p className="font-medium font-mono text-sm">{selectedPagamento.contaMovimentada}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Banco</p>
                    <p className="font-medium">{formatDate(selectedPagamento.dataBanco)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Registo</p>
                    <p className="font-medium">{formatDate(selectedPagamento.dataRegisto)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Controlo */}
              <div>
                <h3 className="font-semibold mb-3">Controlo</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Utilizador</p>
                    <p className="font-medium font-mono">{selectedPagamento.utilizador}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status Pagamento</p>
                    {getStatusPagamentoBadge(selectedPagamento.statusPagamento)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status Movimento</p>
                    {getStatusMovimentoBadge(selectedPagamento.statusMovimento)}
                  </div>
                </div>
              </div>

              {/* Observação */}
              {selectedPagamento.observacao && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Observação</h3>
                    <p className="text-muted-foreground">{selectedPagamento.observacao}</p>
                  </div>
                </>
              )}

              {/* Ações */}
              <Separator />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir Comprovativo
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileDown className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
