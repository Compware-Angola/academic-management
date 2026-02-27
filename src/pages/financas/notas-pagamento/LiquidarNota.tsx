import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data to simulate fetching the nota
const mockNotasPagamento = [
  {
    id: 1222303,
    numero: "1222303",
    estudante: "João Manuel Silva",
    matricula: "21390",
    curso: "Engenharia Informática",
    valor: 45000,
    dataEmissao: "2024-01-15",
    dataVencimento: "2024-02-15",
    status: "Pendente",
    referencia: "REF123456789",
    campus: "Luanda - Kinaxixi",
    anoLectivo: "2024/2025",
  },
  {
    id: 2,
    numero: "NP-2024-001235",
    estudante: "Maria Fernanda Costa",
    matricula: "21456",
    curso: "Gestão de Empresas",
    valor: 38000,
    dataEmissao: "2024-01-16",
    dataVencimento: "2024-02-16",
    status: "Pendente",
    referencia: "REF987654321",
    campus: "Luanda - Talatona",
    anoLectivo: "2024/2025",
  },
];

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

const mockAnosLectivos = [
  { id: 1, descricao: "2024/2025" },
  { id: 2, descricao: "2023/2024" },
  { id: 3, descricao: "2022/2023" },
];

const mockFormasPagamento = [
  "Depósito Bancário",
  "Transferência Bancária",
  "Multicaixa Express",
  "Numerário",
  "TPA",
  "Cheque",
];

const mockCanais = [
  "Balcão",
  "Online",
  "Multicaixa",
  "ATM",
  "Mobile Banking",
];

const mockTiposPagamento = [
  "Propina",
  "Taxa",
  "Emolumento",
  "Multa",
  "Outro",
];

const mockEstados = [
  "Liquidado",
  "Parcialmente Liquidado",
  "Anulado",
];

const mockStatusPagamento = [
  "Confirmado",
  "Pendente Confirmação",
  "Rejeitado",
];

const mockStatusMovimento = [
  "Processado",
  "Em Processamento",
  "Cancelado",
];

export default function LiquidarNota() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the nota from mock data
  const nota = mockNotasPagamento.find((n) => n.numero === codigo);

  const [formData, setFormData] = useState({
    n_operacao_bancaria: "",
    n_operacao_bancaria2: "",
    observacao: "",
    ano_lectivo: nota?.anoLectivo === "2024/2025" ? "1" : "",
    total_geral: nota?.valor?.toString() || "",
    data_banco: "",
    codigo_preinscricao: nota?.matricula || "",
    forma_pagamento: "",
    valor_depositado: nota?.valor?.toString() || "",
    conta_movimentada: "",
    utilizador: "",
    data_registo: new Date().toISOString().split("T")[0],
    canal: "",
    nome_documento: "",
    nome_documento2: "",
    estado: "",
    tipo_pagamento: "",
    codigo_factura: nota?.numero || "",
    instituicao_id: "",
    caixa_id: "",
    status_pagamento: "",
    data_operacao: "",
    status_movimento: "",
    info_adicional: "",
    corrente: "",
    feito_com_reserva: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.forma_pagamento) {
      toast({ title: "Erro", description: "Selecione a forma de pagamento.", variant: "destructive" });
      return;
    }
    if (!formData.valor_depositado || Number(formData.valor_depositado) <= 0) {
      toast({ title: "Erro", description: "Informe o valor depositado.", variant: "destructive" });
      return;
    }
    if (!formData.data_banco) {
      toast({ title: "Erro", description: "Informe a data do banco.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Sucesso", description: "Nota de pagamento liquidada com sucesso!" });
      navigate("/financas/notas-pagamento");
    }, 1500);
  };

  if (!nota) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground text-lg">Nota de pagamento não encontrada.</p>
            <Button variant="outline" className="mt-4 gap-2" onClick={() => navigate("/financas/notas-pagamento")}>
              <ArrowLeft className="h-4 w-4" />
              Voltar às Notas de Pagamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <BreadcrumbLink asChild>
              <Link to="/financas/notas-pagamento">Notas de Pagamento</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Liquidar Nota</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/financas/notas-pagamento")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Liquidar Nota de Pagamento</h1>
          <p className="text-muted-foreground">
            Preencha os dados para liquidar a nota <span className="font-mono font-semibold">{nota.numero}</span>
          </p>
        </div>
      </div>

      {/* Resumo da Nota */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo da Nota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nº da Nota</p>
              <p className="font-medium font-mono">{nota.numero}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estudante</p>
              <p className="font-medium">{nota.estudante}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Matrícula</p>
              <p className="font-medium font-mono">{nota.matricula}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="font-bold text-primary text-lg">{formatCurrency(nota.valor)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Curso</p>
              <p className="font-medium">{nota.curso}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Campus</p>
              <p className="font-medium">{nota.campus}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emissão</p>
              <p className="font-medium">{formatDate(nota.dataEmissao)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge className="bg-yellow-500 hover:bg-yellow-600">{nota.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Liquidação */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados da Operação Bancária</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="n_operacao_bancaria">Nº Operação Bancária</Label>
                <Input id="n_operacao_bancaria" placeholder="Ex: OPB-001234" value={formData.n_operacao_bancaria} onChange={(e) => handleChange("n_operacao_bancaria", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="n_operacao_bancaria2">Nº Operação Bancária 2</Label>
                <Input id="n_operacao_bancaria2" placeholder="Ex: OPB-005678" value={formData.n_operacao_bancaria2} onChange={(e) => handleChange("n_operacao_bancaria2", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_banco">Data Banco *</Label>
                <Input id="data_banco" type="date" value={formData.data_banco} onChange={(e) => handleChange("data_banco", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_operacao">Data da Operação</Label>
                <Input id="data_operacao" type="date" value={formData.data_operacao} onChange={(e) => handleChange("data_operacao", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_registo">Data de Registo</Label>
                <Input id="data_registo" type="date" value={formData.data_registo} onChange={(e) => handleChange("data_registo", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conta_movimentada">Conta Movimentada</Label>
                <Input id="conta_movimentada" placeholder="Ex: AO06.0000.0000.0000.0000" value={formData.conta_movimentada} onChange={(e) => handleChange("conta_movimentada", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Dados do Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
                <Select value={formData.forma_pagamento} onValueChange={(v) => handleChange("forma_pagamento", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar forma" /></SelectTrigger>
                  <SelectContent>
                    {mockFormasPagamento.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_pagamento">Tipo de Pagamento</Label>
                <Select value={formData.tipo_pagamento} onValueChange={(v) => handleChange("tipo_pagamento", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar tipo" /></SelectTrigger>
                  <SelectContent>
                    {mockTiposPagamento.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="canal">Canal</Label>
                <Select value={formData.canal} onValueChange={(v) => handleChange("canal", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar canal" /></SelectTrigger>
                  <SelectContent>
                    {mockCanais.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor_depositado">Valor Depositado *</Label>
                <Input id="valor_depositado" type="number" min="0" step="0.01" value={formData.valor_depositado} onChange={(e) => handleChange("valor_depositado", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_geral">Total Geral</Label>
                <Input id="total_geral" type="number" min="0" step="0.01" value={formData.total_geral} onChange={(e) => handleChange("total_geral", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo_factura">Código Factura</Label>
                <Input id="codigo_factura" value={formData.codigo_factura} readOnly className="bg-muted" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo_preinscricao">Código Pré-Inscrição</Label>
                <Input id="codigo_preinscricao" value={formData.codigo_preinscricao} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano_lectivo">Ano Lectivo</Label>
                <Select value={formData.ano_lectivo} onValueChange={(v) => handleChange("ano_lectivo", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar ano" /></SelectTrigger>
                  <SelectContent>
                    {mockAnosLectivos.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>{a.descricao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instituicao_id">ID Instituição</Label>
                <Input id="instituicao_id" placeholder="Ex: 1" value={formData.instituicao_id} onChange={(e) => handleChange("instituicao_id", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Estado e Controlo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(v) => handleChange("estado", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar estado" /></SelectTrigger>
                  <SelectContent>
                    {mockEstados.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status_pagamento">Status Pagamento</Label>
                <Select value={formData.status_pagamento} onValueChange={(v) => handleChange("status_pagamento", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar status" /></SelectTrigger>
                  <SelectContent>
                    {mockStatusPagamento.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status_movimento">Status Movimento</Label>
                <Select value={formData.status_movimento} onValueChange={(v) => handleChange("status_movimento", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar status" /></SelectTrigger>
                  <SelectContent>
                    {mockStatusMovimento.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caixa_id">ID Caixa</Label>
                <Input id="caixa_id" placeholder="Ex: CX-001" value={formData.caixa_id} onChange={(e) => handleChange("caixa_id", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="utilizador">Utilizador</Label>
                <Input id="utilizador" placeholder="Nome do utilizador" value={formData.utilizador} onChange={(e) => handleChange("utilizador", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="corrente">Corrente</Label>
                <Select value={formData.corrente} onValueChange={(v) => handleChange("corrente", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feito_com_reserva">Feito com Reserva</Label>
                <Select value={formData.feito_com_reserva} onValueChange={(v) => handleChange("feito_com_reserva", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Documentos e Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_documento">Nome Documento</Label>
                <Input id="nome_documento" placeholder="Nome do comprovativo" value={formData.nome_documento} onChange={(e) => handleChange("nome_documento", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome_documento2">Nome Documento 2</Label>
                <Input id="nome_documento2" placeholder="Documento adicional" value={formData.nome_documento2} onChange={(e) => handleChange("nome_documento2", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="info_adicional">Informação Adicional</Label>
                <Textarea id="info_adicional" placeholder="Informações complementares..." rows={3} value={formData.info_adicional} onChange={(e) => handleChange("info_adicional", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacao">Observação</Label>
                <Textarea id="observacao" placeholder="Observações sobre a liquidação..." rows={3} value={formData.observacao} onChange={(e) => handleChange("observacao", e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Separator className="my-6" />
        <div className="flex justify-between">
          <Button type="button" variant="outline" className="gap-2" onClick={() => navigate("/financas/notas-pagamento")}>
            <ArrowLeft className="h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSubmitting ? "A processar..." : "Liquidar Nota"}
          </Button>
        </div>
      </form>
    </div>
  );
}
