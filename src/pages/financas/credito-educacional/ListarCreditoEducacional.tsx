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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Home, Search, Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryFetchCreditoEducacional } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional";

export default function ListarCreditoEducacional() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: creditoEducacionalResponse,
    isLoading: isLoadingCreditoEducational,
  } = useQueryFetchCreditoEducacional();

  const creditoEducacional = creditoEducacionalResponse?.items ?? [];
  const [formData, setFormData] = useState({
    designacao: "",
    codigoTipoDesconto: "",
    valorDesconto: "",
    codigoTipoCredito: "",
  });

  const mockData = [
    {
      id: 1,
      estudante: "Ana Silva",
      curso: "Eng. Informática",
      instituicao: "INAGBE",
      tipoBolsa: "Integral",
      valorTotal: "540.000 Kz",
      status: "Activo",
    },
    {
      id: 2,
      estudante: "Pedro Santos",
      curso: "Direito",
      instituicao: "Sonangol",
      tipoBolsa: "Parcial",
      valorTotal: "252.000 Kz",
      status: "Activo",
    },
  ];

  const tiposDesconto = [
    { codigo: 1, nome: "Percentagem" },
    { codigo: 2, nome: "Valor Fixo" },
  ];

  const tiposCredito = [
    { codigo: 1, nome: "Bolsa Integral" },
    { codigo: 2, nome: "Bolsa Parcial" },
    { codigo: 3, nome: "Crédito Educacional" },
  ];

  const handleSubmit = () => {
    // Payload conforme especificado
    const payload = {
      designacao: formData.designacao,
      codigoTipoDesconto: parseInt(formData.codigoTipoDesconto),
      valorDesconto: parseFloat(formData.valorDesconto),
      codigoTipoCredito: parseInt(formData.codigoTipoCredito),
    };

    console.log("Payload de criação:", payload);

    toast({
      title: "Crédito Educacional Criado",
      description: `O crédito "${formData.designacao}" foi criado com sucesso.`,
    });

    setIsModalOpen(false);
    setFormData({
      designacao: "",
      codigoTipoDesconto: "",
      valorDesconto: "",
      codigoTipoCredito: "",
    });
  };

  return (
    <div className="p-6 space-y-6">
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
            <BreadcrumbLink>Gestão de Crédito Educacional</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Listar Crédito Educacional</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Listar Crédito Educacional</h1>
      <p className="text-muted-foreground">
        Lista completa de créditos educacionais atribuídos.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input placeholder="Nome do estudante" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Instituição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Crédito
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créditos Educacionais</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Designação</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditoEducacional.map((item) => (
                <TableRow key={item.codigo}>
                  <TableCell>{item.designacao}</TableCell>
                  <TableCell>{item.valor_desconto}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para criar novo crédito educacional */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Crédito Educacional</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="designacao">Designação</Label>
              <Input
                id="designacao"
                placeholder="Ex: Bolsa de Mérito 2024"
                value={formData.designacao}
                onChange={(e) =>
                  setFormData({ ...formData, designacao: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipoDesconto">Tipo de Desconto</Label>
              <Select
                value={formData.codigoTipoDesconto}
                onValueChange={(value) =>
                  setFormData({ ...formData, codigoTipoDesconto: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de desconto" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDesconto.map((tipo) => (
                    <SelectItem
                      key={tipo.codigo}
                      value={tipo.codigo.toString()}
                    >
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="valorDesconto">Valor do Desconto (%)</Label>
              <Input
                id="valorDesconto"
                type="number"
                placeholder="Ex: 10"
                value={formData.valorDesconto}
                onChange={(e) =>
                  setFormData({ ...formData, valorDesconto: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipoCredito">Tipo de Crédito</Label>
              <Select
                value={formData.codigoTipoCredito}
                onValueChange={(value) =>
                  setFormData({ ...formData, codigoTipoCredito: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de crédito" />
                </SelectTrigger>
                <SelectContent>
                  {tiposCredito.map((tipo) => (
                    <SelectItem
                      key={tipo.codigo}
                      value={tipo.codigo.toString()}
                    >
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.designacao ||
                !formData.codigoTipoDesconto ||
                !formData.valorDesconto ||
                !formData.codigoTipoCredito
              }
            >
              Criar Crédito
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
