import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Search, Plus, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useListInstituicao } from "@/hooks/financa/use-listar-todas-instituicao";
import { useListInstituicaoTipo } from "@/hooks/financa/use-listar-instituicao";
import { useCreateInstituicao } from "@/hooks/financa/use-create-instituicao";

export default function TodasInstituicoes() {
  const { toast } = useToast();

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal e form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    instituicao: "",
    nif: "",
    contacto: "",
    endereco: "",
    sigla: "",
    tipo_instituicao: ""
  });

  // Dados da API
  const { data, isLoading: isLoadingInstituicoes } = useListInstituicao();
  const { data: tiposInstituicao = [], isLoading: isLoadingTipos } = useListInstituicaoTipo();
  const { mutateAsync: createInstituicao, isPending: isCreating } = useCreateInstituicao();

  const allInstituicoes = data?.items ?? [];
  const totalPages = Math.ceil(allInstituicoes.length / itemsPerPage);
  const paginatedInstituicoes = allInstituicoes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

   // Pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  // Funções de paginação
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const filteredInstituicoes = useMemo(() => {
    if (!searchTerm) return allInstituicoes;
    return allInstituicoes.filter((inst) =>
      inst.instituicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.nif.includes(searchTerm)
    );
  }, [searchTerm, allInstituicoes]);

  // Submit de criação
  const handleSubmit = async () => {
    if (!formData.instituicao || !formData.nif || !formData.sigla || !formData.tipo_instituicao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      await createInstituicao({
        payload: {
          instituicao: formData.instituicao,
          nif: formData.nif,
          tipoInstituicaoId: Number(formData.tipo_instituicao),
          contacto: formData.contacto || undefined,
          endereco: formData.endereco || undefined,
          sigla: formData.sigla || undefined,
        },
      });

      toast({
        title: "Sucesso",
        description: "Instituição criada com sucesso!"
      });

      // Resetar form e fechar modal
      setFormData({
        instituicao: "",
        nif: "",
        contacto: "",
        endereco: "",
        sigla: "",
        tipo_instituicao: ""
      });
      setIsModalOpen(false);

      // Resetar página para 1 para ver a nova instituição
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

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
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Gestão de Crédito Educacional</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Todas Instituições</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Todas Instituições</h1>
      <p className="text-muted-foreground">Gestão de instituições parceiras de crédito educacional.</p>

      {/* Pesquisa */}
      
       <Card>
        <CardHeader><CardTitle>Pesquisar</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Nome da instituição ou NIF"
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // resetar página ao pesquisar
              }}
            />
            <Button className="gap-2"><Search className="h-4 w-4" />Pesquisar</Button>
          </div>
        </CardContent>
      </Card>


      {/* Botão Criar */}
      <div className="flex gap-2">
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />Nova Instituição
        </Button>
      </div>

      {/* Tabela de Instituições */}
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
              {paginatedInstituicoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInstituicoes.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell className="font-mono">{item.codigo}</TableCell>
                    <TableCell className="font-medium">{item.instituicao}</TableCell>
                    <TableCell>{item.sigla ?? "-"}</TableCell>
                    <TableCell className="font-mono">{item.nif}</TableCell>
                    <TableCell>{item.contacto ?? "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.endereco ?? "-"}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Próxima <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
            <Button onClick={handleSubmit} disabled={isCreating}>
              Criar Instituição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
