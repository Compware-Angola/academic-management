import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Search, Plus, Edit, Trash2, FileText, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

export default function ServicosEmolumentos() {
    const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  
  const [filters, setFilters] = useState({
    anoLetivo: "",
  });
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    taxaIvaId: "",
    motivoIsencaoIvaCodigo: "",
    preco: "",
    descricao: "",
    tipoServico: "",
    estado: true,
    data: "",
    disponibilizarAluno: true,
    codigoGradeCurricular: "",
    mestrado: false,
    canal: "",
    poloId: "",
    cacuaco: false,
    codigoAnoLectivo: "",
    valorAnterior: "",
    visualizarNoPortal: true,
    sigla: "",
    estadoSolicitacao: "",
    tipoCandidatura: ""
  });

  const mockServicos = [
    { id: 1, codigo: "SRV001", descricao: "Taxa de Matrícula", valor: "25.000 Kz", categoria: "Matrícula" },
    { id: 2, codigo: "SRV002", descricao: "Certificado de Frequência", valor: "5.000 Kz", categoria: "Documentos" },
    { id: 3, codigo: "SRV003", descricao: "Declaração de Notas", valor: "3.500 Kz", categoria: "Documentos" },
    { id: 4, codigo: "SRV004", descricao: "Diploma", valor: "15.000 Kz", categoria: "Documentos" },
    { id: 5, codigo: "SRV005", descricao: "Cartão de Estudante", valor: "2.500 Kz", categoria: "Outros" },
  ];

  const mockMensalidades = [
    { id: 1, curso: "Engenharia Informática", grau: "Licenciatura", valorMensal: "45.000 Kz", valorAnual: "540.000 Kz", campus: "Luanda" },
    { id: 2, curso: "Direito", grau: "Licenciatura", valorMensal: "42.000 Kz", valorAnual: "504.000 Kz", campus: "Luanda" },
    { id: 3, curso: "Medicina", grau: "Licenciatura", valorMensal: "65.000 Kz", valorAnual: "780.000 Kz", campus: "Luanda" },
    { id: 4, curso: "Gestão de Empresas", grau: "Mestrado", valorMensal: "85.000 Kz", valorAnual: "1.020.000 Kz", campus: "Benguela" },
    { id: 5, curso: "Arquitectura", grau: "Licenciatura", valorMensal: "55.000 Kz", valorAnual: "660.000 Kz", campus: "Luanda" },
  ];

  const mockTaxasIva = [
    { id: 1, nome: "IVA 14%" },
    { id: 2, nome: "IVA 7%" },
    { id: 3, nome: "Isento" },
  ];

  const mockPolos = [
    { id: 1, nome: "Luanda" },
    { id: 2, nome: "Benguela" },
    { id: 3, nome: "Cacuaco" },
  ];

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.descricao || !formData.preco || !formData.tipoServico) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios (Descrição, Preço, Tipo de Serviço)",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Serviço criado com sucesso!"
    });
    setIsModalOpen(false);
    setFormData({
      taxaIvaId: "",
      motivoIsencaoIvaCodigo: "",
      preco: "",
      descricao: "",
      tipoServico: "",
      estado: true,
      data: "",
      disponibilizarAluno: true,
      codigoGradeCurricular: "",
      mestrado: false,
      canal: "",
      poloId: "",
      cacuaco: false,
      codigoAnoLectivo: "",
      valorAnterior: "",
      visualizarNoPortal: true,
      sigla: "",
      estadoSolicitacao: "",
      tipoCandidatura: ""
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Finanças</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Área Financeira</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Serviços e Emolumentos</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

   
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
           <h1 className="text-2xl font-bold">Serviços e Emolumentos</h1>
         
      <p className="text-muted-foreground">Gestão de serviços, emolumentos e mensalidades por curso.</p>
        </div>
        <div className="flex flex-wrap gap-2">
       <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />Novo Serviço
            </Button>
        </div>
      </div>
  
          
      <Tabs defaultValue="servicos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="servicos" className="gap-2">
            <FileText className="h-4 w-4" />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="mensalidades" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Mensalidades por Curso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="servicos" className="space-y-4 mt-4">
    <Card>
  <CardHeader>
    <CardTitle>Pesquisar Serviço</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      
      {/* Ano Letivo */}
      <div className="min-w-[200px]">
        <FormSelect
          label="Ano Letivo"
          disabled={isLoadingAcademicYear}
          loading={isLoadingAcademicYear}
          value={filters.anoLetivo}
          onChange={(v) =>
            setFilters({ ...filters, anoLetivo: v })
          }
          options={anosAcademicos}
          map={(a) => ({
            key: a.codigo,
            label: a.designacao,
            value: a.codigo,
          })}
        />
      </div>

      {/* Descrição */}
      <div className="flex-1">
        <Input
          placeholder="Descrição do serviço"
        />
      </div>

      {/* Botão */}
      <Button className="gap-2">
        <Search className="h-4 w-4" />
        Pesquisar
      </Button>

    </div>
  </CardContent>
</Card>


       

          <Card>
            <CardHeader><CardTitle>Lista de Serviços</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockServicos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.codigo}</TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>{item.valor}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell className="flex gap-1">
                        <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensalidades" className="space-y-4 mt-4">
          <Card>
 <CardHeader><CardTitle>Pesquisar Mensalidade</CardTitle></CardHeader>

  <CardContent>
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      
      {/* Ano Letivo */}
      <div className="min-w-[200px]">
        <FormSelect
          label="Ano Letivo"
          disabled={isLoadingAcademicYear}
          loading={isLoadingAcademicYear}
          value={filters.anoLetivo}
          onChange={(v) =>
            setFilters({ ...filters, anoLetivo: v })
          }
          options={anosAcademicos}
          map={(a) => ({
            key: a.codigo,
            label: a.designacao,
            value: a.codigo,
          })}
        />
      </div>

      {/* Descrição */}
      <div className="flex-1">
        <Input
          placeholder="Nome do curso"
        />
      </div>

      {/* Botão */}
      <Button className="gap-2">
        <Search className="h-4 w-4" />
        Pesquisar
      </Button>

    </div>
  </CardContent>
</Card>

     

        

          <Card>
            <CardHeader><CardTitle>Mensalidades por Curso</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Grau</TableHead>
                    <TableHead>Valor Mensal</TableHead>
                    <TableHead>Valor Anual</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMensalidades.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.curso}</TableCell>
                      <TableCell>{item.grau}</TableCell>
                      <TableCell>{item.valorMensal}</TableCell>
                      <TableCell>{item.valorAnual}</TableCell>
                      <TableCell>{item.campus}</TableCell>
                      <TableCell className="flex gap-1">
                        <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="destructive"><Trash2 className="h-3 w-3" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal Criar Serviço */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl! max-h-[90vh]!">
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* Descrição */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Input 
                  id="descricao" 
                  placeholder="Ex: Propina Mensal"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                />
              </div>

              {/* Sigla */}
              <div className="space-y-2">
                <Label htmlFor="sigla">Sigla</Label>
                <Input 
                  id="sigla" 
                  placeholder="Ex: PROP"
                  value={formData.sigla}
                  onChange={(e) => handleInputChange("sigla", e.target.value)}
                />
              </div>

              {/* Tipo de Serviço */}
              <div className="space-y-2">
                <Label>Tipo de Serviço *</Label>
                <Select value={formData.tipoServico} onValueChange={(v) => handleInputChange("tipoServico", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENSINO">Ensino</SelectItem>
                    <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
                    <SelectItem value="DOCUMENTO">Documento</SelectItem>
                    <SelectItem value="OUTRO">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (Kz) *</Label>
                <Input 
                  id="preco" 
                  type="number"
                  placeholder="25000"
                  value={formData.preco}
                  onChange={(e) => handleInputChange("preco", e.target.value)}
                />
              </div>

              {/* Valor Anterior */}
              <div className="space-y-2">
                <Label htmlFor="valorAnterior">Valor Anterior (Kz)</Label>
                <Input 
                  id="valorAnterior" 
                  type="number"
                  placeholder="20000"
                  value={formData.valorAnterior}
                  onChange={(e) => handleInputChange("valorAnterior", e.target.value)}
                />
              </div>

              {/* Taxa IVA */}
              <div className="space-y-2">
                <Label>Taxa IVA</Label>
                <Select value={formData.taxaIvaId} onValueChange={(v) => handleInputChange("taxaIvaId", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar taxa" /></SelectTrigger>
                  <SelectContent>
                    {mockTaxasIva.map((taxa) => (
                      <SelectItem key={taxa.id} value={String(taxa.id)}>{taxa.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Motivo Isenção IVA */}
              <div className="space-y-2">
                <Label htmlFor="motivoIsencaoIvaCodigo">Código Motivo Isenção IVA</Label>
                <Input 
                  id="motivoIsencaoIvaCodigo" 
                  type="number"
                  placeholder="101"
                  value={formData.motivoIsencaoIvaCodigo}
                  onChange={(e) => handleInputChange("motivoIsencaoIvaCodigo", e.target.value)}
                />
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input 
                  id="data" 
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange("data", e.target.value)}
                />
              </div>

              {/* Ano Lectivo */}
              <div className="space-y-2">
                <Label htmlFor="codigoAnoLectivo">Ano Lectivo</Label>
                <Select value={formData.codigoAnoLectivo} onValueChange={(v) => handleInputChange("codigoAnoLectivo", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar ano" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Polo */}
              <div className="space-y-2">
                <Label>Polo</Label>
                <Select value={formData.poloId} onValueChange={(v) => handleInputChange("poloId", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar polo" /></SelectTrigger>
                  <SelectContent>
                    {mockPolos.map((polo) => (
                      <SelectItem key={polo.id} value={String(polo.id)}>{polo.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Canal */}
              <div className="space-y-2">
                <Label>Canal</Label>
                <Select value={formData.canal} onValueChange={(v) => handleInputChange("canal", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar canal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Portal Académico</SelectItem>
                    <SelectItem value="2">Presencial</SelectItem>
                    <SelectItem value="3">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Código Grade Curricular */}
              <div className="space-y-2">
                <Label htmlFor="codigoGradeCurricular">Código Grade Curricular</Label>
                <Input 
                  id="codigoGradeCurricular" 
                  type="number"
                  placeholder="202"
                  value={formData.codigoGradeCurricular}
                  onChange={(e) => handleInputChange("codigoGradeCurricular", e.target.value)}
                />
              </div>

              {/* Estado Solicitação */}
              <div className="space-y-2">
                <Label>Estado Solicitação</Label>
                <Select value={formData.estadoSolicitacao} onValueChange={(v) => handleInputChange("estadoSolicitacao", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar estado" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Pendente</SelectItem>
                    <SelectItem value="2">Aprovado</SelectItem>
                    <SelectItem value="3">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo Candidatura */}
              <div className="space-y-2">
                <Label>Tipo Candidatura</Label>
                <Select value={formData.tipoCandidatura} onValueChange={(v) => handleInputChange("tipoCandidatura", v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Normal</SelectItem>
                    <SelectItem value="2">Transferência</SelectItem>
                    <SelectItem value="3">Mudança de Curso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Switches */}
              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="estado">Estado Activo</Label>
                  <Switch 
                    id="estado" 
                    checked={formData.estado}
                    onCheckedChange={(checked) => handleInputChange("estado", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="disponibilizarAluno">Disponibilizar ao Aluno</Label>
                  <Switch 
                    id="disponibilizarAluno" 
                    checked={formData.disponibilizarAluno}
                    onCheckedChange={(checked) => handleInputChange("disponibilizarAluno", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="visualizarNoPortal">Visualizar no Portal</Label>
                  <Switch 
                    id="visualizarNoPortal" 
                    checked={formData.visualizarNoPortal}
                    onCheckedChange={(checked) => handleInputChange("visualizarNoPortal", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="mestrado">Mestrado</Label>
                  <Switch 
                    id="mestrado" 
                    checked={formData.mestrado}
                    onCheckedChange={(checked) => handleInputChange("mestrado", checked)}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="cacuaco">Cacuaco</Label>
                  <Switch 
                    id="cacuaco" 
                    checked={formData.cacuaco}
                    onCheckedChange={(checked) => handleInputChange("cacuaco", checked)}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Criar Serviço</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
