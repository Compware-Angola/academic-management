import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Search, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { listInstituicao } from "@/services/finance/listar-todas-instituicao.service";
import { useListInstituicao } from "@/hooks/financa/use-listar-todas-instituicao";
import { useListInstituicaoTipo } from "@/hooks/financa/use-listar-instituicao";
import { useCreateInstituicao } from "@/hooks/financa/use-create-instituicao";

export default function TodasInstituicoes() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    instituicao: "",
    nif: "",
    contacto: "",
    endereco: "",
    sigla: "",
    tipo_instituicao: ""
  });

  const {
    data,
    isLoading: isLoading
  } = useListInstituicao()

  const {
      data: tiposInstituicao = [],
      isLoading: isLoadingTipos,
    } = useListInstituicaoTipo();

    const {
        mutateAsync: createInstituicao,
        isPending,
      } = useCreateInstituicao()

    const Instituicoes = data?.items ?? []


  const handleSubmit = async () => {
    if (!formData.instituicao || !formData.nif || !formData.sigla || !formData.tipo_instituicao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const payload = {
      instituicao: formData.instituicao,
      nif: formData.nif,
      contacto: formData.contacto,
      endereco: formData.endereco,
      sigla: formData.sigla,
      tipo_instituicao: parseInt(formData.tipo_instituicao)
    };

      await createInstituicao({
      payload: {
        instituicao: formData.instituicao,
        nif: formData.nif,
        tipoInstituicaoId: Number(formData.tipo_instituicao),
        contacto: formData.contacto || undefined,
        endereco: formData.endereco || undefined,
        sigla: formData.sigla || undefined,
      },
    })
    
    toast({
      title: "Sucesso",
      description: "Instituição criada com sucesso!"
    });

    setFormData({
      instituicao: "",
      nif: "",
      contacto: "",
      endereco: "",
      sigla: "",
      tipo_instituicao: ""
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Gestão de Crédito Educacional</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Todas Instituições</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Todas Instituições</h1>
      <p className="text-muted-foreground">Gestão de instituições parceiras de crédito educacional.</p>

      <Card>
  
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />Nova Instituição
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Instituições</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Instituição</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Instituicoes.map((item) => (
                <TableRow key={item.codigo}>
                  <TableCell className="font-mono">
                    {item.codigo}
                  </TableCell>

                  <TableCell className="font-medium">
                    {item.instituicao}
                  </TableCell>

                  <TableCell>
                    {item.sigla ?? "-"}
                  </TableCell>

                  <TableCell className="font-mono">
                    {item.nif}
                  </TableCell>

                  <TableCell>
                    {item.contacto ?? "-"}
                  </TableCell>

                  <TableCell className="max-w-xs truncate">
                    {item.endereco ?? "-"}
                  </TableCell>

                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
    </Table>
  </CardContent>
</Card>

      

      {/* Modal de Criação de Instituição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Instituição</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instituicao">Nome da Instituição *</Label>
              <Input
                id="instituicao"
                placeholder="Ex: UNIA"
                value={formData.instituicao}
                onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sigla">Sigla *</Label>
                <Input
                  id="sigla"
                  placeholder="Ex: HSL"
                  value={formData.sigla}
                  onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nif">NIF *</Label>
                <Input
                  id="nif"
                  placeholder="Ex: 12345678000190"
                  value={formData.nif}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_instituicao">Tipo de Instituição *</Label>
              <Select
                value={formData.tipo_instituicao}
                onValueChange={(value) => setFormData({ ...formData, tipo_instituicao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposInstituicao.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contacto">Contacto</Label>
              <Input
                id="contacto"
                placeholder="Ex: (51) 3333-4444"
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Ex: Av. Atlântica, 1500 - Luanda"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              Criar Instituição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
