import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Home,
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import {
  useQueryMonthlyFeeTipoServico,
  useQueryTiposServicoAll,
} from "@/hooks/financas/use-query-tipo-service";
import {
  TipoServicoPayload,
  UpdateTipoServicoPayload,
} from "@/services/financas/create-and-update-service.service";
import {
  useCreateTipoServico,
  useUpdateTipoServico,
} from "@/hooks/financas/use-query-create-and-update-service";
import { usePoloDropdown } from "@/hooks/shared/use-query-fetch-polo";
import { useTipoTaxaDropdown } from "@/hooks/shared/use-query-fetch-tipo-taxa";
import { useMotivoIsencaoDropdown } from "@/hooks/shared/use-query-fetch-motivo-insencao";


type ServicoFormData = {
  descricao: string;
  preco: number;
  sigla: string;
  tipoServico: string;
  estado: boolean;
  poloId: number;
  codigoAnoLectivo: number;
  taxaIvaId: number;
  motivoIsencaoIvaCodigo: number;
  disponibilizarAluno: boolean;
  visualizarNoPortal: boolean;
  canal: number;
  mestrado: boolean;
  cacuaco: boolean;
  valorAnterior: number;
  estadoSolicitacao: number;
  tipoCandidatura: number;
  codigoGradeCurricular: number | null;
  cursoDescricao?: string;
  grau?: string;
};

const initialForm: ServicoFormData = {
  descricao: "",
  preco: 0,
  sigla: "",
  tipoServico: "MENSAL",
  estado: true,
  poloId: 1,
  codigoAnoLectivo: 0,
  taxaIvaId: 1,
  motivoIsencaoIvaCodigo: 0,
  disponibilizarAluno: true,
  visualizarNoPortal: true,
  canal: 1,
  mestrado: false,
  cacuaco: false,
  valorAnterior: 0,
  estadoSolicitacao: 1,
  tipoCandidatura: 1,
  codigoGradeCurricular: null,
};

export default function ServicosEmolumentos() {
  const { toast } = useToast();
  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  // Filtros SEPARADOS para cada aba
  const [servicosFilters, setServicosFilters] = useState({ anoLetivo: "", descricao: "", polo: "" });
  const [mensalidadesFilters, setMensalidadesFilters] = useState({ anoLetivo: "", descricao: "", polo: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<ServicoFormData>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCodigo, setEditingCodigo] = useState<number | null>(null);
  const [currentContext, setCurrentContext] = useState<"servico" | "mensalidade">("servico");

  const [servicosPage, setServicosPage] = useState(1);
  const [mensalidadesPage, setMensalidadesPage] = useState(1);
  const pageLimit = 10;

  // Query para SERVIÇOS (usa servicosFilters)
  const { data: tiposServico, isLoading: isLoadingServicos } = useQueryTiposServicoAll({
    codigoAnoLectivo: servicosFilters.anoLetivo ? Number(servicosFilters.anoLetivo) : undefined,
    polo: servicosFilters.polo ? Number(servicosFilters.polo) : undefined,
    descricao: servicosFilters.descricao.trim() || undefined,
    page: servicosPage,
    limit: pageLimit,
  });

  // Query para MENSALIDADES (usa mensalidadesFilters)
  const { data: mensalidades, isLoading: isLoadingMensalidades } = useQueryMonthlyFeeTipoServico({
    codigoAnoLectivo: mensalidadesFilters.anoLetivo ? Number(mensalidadesFilters.anoLetivo) : undefined,
    polo: mensalidadesFilters.polo ? Number(mensalidadesFilters.polo) : undefined,
    descricao: mensalidadesFilters.descricao.trim() || undefined,
    page: mensalidadesPage,
    limit: pageLimit,
  });
  //Query Polo
  const { data: polos, isLoading: LoadingPolo } = usePoloDropdown()

  //Query Taxa 
  const { data: taxa, isLoading: LoadingTaxa } = useTipoTaxaDropdown()

  // Query Motivo insenção

  const { data: motivos, isLoading: LoadingMotivos } = useMotivoIsencaoDropdown()

  const createMutation = useCreateTipoServico();
  const updateMutation = useUpdateTipoServico(editingCodigo ?? 0);

  useEffect(() => {
    if (!modalOpen) {
      setFormData(initialForm);
      setIsEditing(false);
      setEditingCodigo(null);
      setCurrentContext("servico");
    }
  }, [modalOpen]);

  const openCreateModal = () => {
    setFormData({
      ...initialForm,
      codigoAnoLectivo: servicosFilters.anoLetivo ? Number(servicosFilters.anoLetivo) : 0,
      tipoServico: "MENSAL",
    });
    setIsEditing(false);
    setCurrentContext("servico");
    setModalOpen(true);
  };

  const openEditModal = (item: any, context: "servico" | "mensalidade") => {
    setFormData({
      descricao: item.descricao || "",
      preco: Number(item.preco) || 0,
      sigla: item.sigla || (item.descricao ? item.descricao.slice(0, 4).toUpperCase() : ""),
      tipoServico: item.tiposervico ,
      estado:
        item.estado === "Ativo" ||
        item.estado === true ||
        String(item.estado || "").toLowerCase() === "ativo",
      poloId: item.polo_id || 1,
      codigoAnoLectivo: item.codigo_ano_lectivo || 0,
      taxaIvaId: item.taxa_iva_id || 1,
      motivoIsencaoIvaCodigo: item.motivo_isencao_iva_codigo || 0,
      disponibilizarAluno: item.disponibilizar_aluno ?? true,
      visualizarNoPortal: item.visualizar_no_portal ?? true,
      canal: item.canal || 1,
      mestrado: item.mestrado ?? false,
      cacuaco: item.cacuaco ?? false,
      valorAnterior: Number(item.valorAnterior) || 0,
      estadoSolicitacao: item.estadoSolicitacao || 1,
      tipoCandidatura: item.tipoCandidatura || 1,
      codigoGradeCurricular: item.codigoGradeCurricular || null,
      cursoDescricao: context === "mensalidade" ? item.descricao : undefined,
      grau: context === "mensalidade" ? (item.mestrado ? "Mestrado" : "Licenciatura") : undefined,
    });

    setIsEditing(true);
    setEditingCodigo(item.codigo);
    setCurrentContext(context);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "A descrição é obrigatória",
        variant: "destructive",
      });
      return;
    }
    if (formData.preco <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }
    if (!formData.codigoAnoLectivo) {
      toast({
        title: "Erro",
        description: "Selecione o ano letivo",
        variant: "destructive",
      });
      return;
    }

    if (isEditing) {
      const payload: UpdateTipoServicoPayload = {
        descricao: formData.descricao,
        preco: formData.preco,
        estado: formData.estado,
        poloId: formData.poloId,
        codigoAnoLectivo: formData.codigoAnoLectivo,
        taxaIvaId: formData.taxaIvaId,
        motivoIsencaoIvaCodigo: formData.motivoIsencaoIvaCodigo,
        tipoServico:formData.tipoServico
      };

      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description:
              currentContext === "servico" ? "Serviço atualizado" : "Mensalidade atualizada",
          });
          setModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Não foi possível atualizar",
            variant: "destructive",
          });
        },
      });
    } else {
      const payload: TipoServicoPayload = {
        ...formData,
        data: new Date().toISOString().split("T")[0],
        sigla:
          formData.sigla.trim() ||
          formData.descricao.slice(0, 4).toUpperCase() ||
          "SERV",
      };

      createMutation.mutate(payload, {
        onSuccess: () => {
          toast({ title: "Sucesso", description: "Serviço criado com sucesso" });
          setModalOpen(false);
        },
        onError: () => {
          toast({
            title: "Erro",
            description: "Não foi possível criar o serviço",
            variant: "destructive",
          });
        },
      });
    }
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
            <BreadcrumbLink>Área Financeira</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Serviços e Emolumentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Serviços e Emolumentos</h1>
          <p className="text-muted-foreground">
            Gestão de serviços, emolumentos e mensalidades por curso.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Novo Serviço
        </Button>
      </div>

      <Tabs defaultValue="servicos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="servicos" className="gap-2">
            <FileText className="h-4 w-4" /> Serviços
          </TabsTrigger>
          <TabsTrigger value="mensalidades" className="gap-2">
            <GraduationCap className="h-4 w-4" /> Mensalidades por Curso
          </TabsTrigger>
        </TabsList>

        {/* SERVIÇOS */}
        <TabsContent value="servicos" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pesquisar Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-end flex-wrap">
                <div className="min-w-[220px]">
                  <FormSelect
                    label="Ano Letivo"
                    value={servicosFilters.anoLetivo}
                    onChange={(v) => {
                      setServicosFilters((prev) => ({ ...prev, anoLetivo: v }));
                      setServicosPage(1);
                    }}
                    options={anosAcademicos ?? []}
                    map={(a) => ({
                      key: String(a.codigo),
                      label: a.designacao,
                      value: String(a.codigo),
                    })}
                    disabled={isLoadingAcademicYear}
                    placeholder="Selecione o ano..."
                  />
                </div>
                <div className="min-w-[220px]">
                  <FormSelect
                    label="Polo"
                    value={servicosFilters.polo}
                    onChange={(v) => {
                      setServicosFilters((prev) => ({ ...prev, polo: v }));
                      setServicosPage(1);
                    }}
                    options={polos ?? []}
                    map={(a) => ({
                      key: String(a.id),
                      label: a.designacao,
                      value: String(a.id),
                    })}
                    disabled={LoadingPolo}
                    placeholder="Selecione o Campus..."
                  />
                </div>

                <div className="flex-1 min-w-[300px]">
                  <Label>Descrição</Label>
                  <Input
                    placeholder="Filtrar por descrição do serviço..."
                    value={servicosFilters.descricao}
                    onChange={(e) => {
                      setServicosFilters((prev) => ({ ...prev, descricao: e.target.value }));
                      setServicosPage(1);
                    }}
                  />
                </div>

                <Button className="mt-6 md:mt-0">
                  <Search className="mr-2 h-4 w-4" />
                  Pesquisar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingServicos ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        A carregar serviços...
                      </TableCell>
                    </TableRow>
                  ) : !tiposServico?.data?.length ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum serviço encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    tiposServico.data.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>{Number(item.preco).toLocaleString()} kz</TableCell>
                        <TableCell>{item.tiposervico || "—"}</TableCell>
                        <TableCell>{item.polo || "—"}</TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(item, "servico")}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          {/* 
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                          */}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {tiposServico && tiposServico.lastPage > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    disabled={servicosPage === 1}
                    onClick={() => setServicosPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {servicosPage} de {tiposServico.lastPage}
                  </span>
                  <Button
                    variant="outline"
                    disabled={servicosPage >= tiposServico.lastPage}
                    onClick={() => setServicosPage((p) => p + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* MENSALIDADES */}
        <TabsContent value="mensalidades" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pesquisar Mensalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-end flex-wrap">
                <div className="min-w-[220px]">
                  <FormSelect
                    label="Ano Letivo"
                    value={mensalidadesFilters.anoLetivo}
                    onChange={(v) => {
                      setMensalidadesFilters((prev) => ({ ...prev, anoLetivo: v }));
                      setMensalidadesPage(1);
                    }}
                    options={anosAcademicos ?? []}
                    map={(a) => ({
                      key: String(a.codigo),
                      label: a.designacao,
                      value: String(a.codigo),
                    })}
                    disabled={isLoadingAcademicYear}
                  />
                </div>
                <div className="min-w-[220px]">
                  <FormSelect
                    label="Polo"
                    value={mensalidadesFilters.polo}
                    onChange={(v) => {
                      setMensalidadesFilters((prev) => ({ ...prev, polo: v }));
                      setMensalidadesPage(1);
                    }}
                    options={polos ?? []}
                    map={(a) => ({
                      key: String(a.id),
                      label: a.designacao,
                      value: String(a.id),
                    })}
                    disabled={LoadingPolo}
                    placeholder="Selecione o Campus..."
                  />
                </div>

                <div className="flex-1 min-w-[300px]">
                  <Label> Curso</Label>
                  <Input
                    placeholder="Filtrar pelo nome do curso..."
                    value={mensalidadesFilters.descricao}
                    onChange={(e) => {
                      setMensalidadesFilters((prev) => ({ ...prev, descricao: e.target.value }));
                      setMensalidadesPage(1);
                    }}
                  />
                </div>

                <Button className="mt-6 md:mt-0">
                  <Search className="mr-2 h-4 w-4" />
                  Pesquisar
                </Button>
              </div>
            </CardContent>

            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Grau</TableHead>
                    <TableHead>Valor Mensal</TableHead>
                    <TableHead>Valor Anual (estimado)</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingMensalidades ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        A carregar mensalidades...
                      </TableCell>
                    </TableRow>
                  ) : !mensalidades?.data?.length ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhuma mensalidade encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    mensalidades.data.map((item) => (
                      <TableRow key={item.codigo}>
                         {item.descricao.replace(/propina/gi, "Mensalidade")}
                        <TableCell>{item.mestrado ? "Mestrado" : "Licenciatura"}</TableCell>
                        <TableCell>{Number(item.preco).toLocaleString()} kz</TableCell>
                        <TableCell>{Number(item.preco * 10).toLocaleString()} kz</TableCell>
                        <TableCell>{item.polo || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(item, "mensalidade")}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {mensalidades && mensalidades.lastPage > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    disabled={mensalidadesPage === 1}
                    onClick={() => setMensalidadesPage((p) => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {mensalidadesPage} de {mensalidades.lastPage}
                  </span>
                  <Button
                    variant="outline"
                    disabled={mensalidadesPage >= mensalidades.lastPage}
                    onClick={() => setMensalidadesPage((p) => p + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl! max-h-[92vh]! overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? currentContext === "servico"
                  ? "Editar Serviço"
                  : "Editar Mensalidade"
                : "Criar Novo Serviço"}
            </DialogTitle>
            {isEditing && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentContext === "servico" ? "Serviço" : "Mensalidade"} – Código: {editingCodigo}
              </p>
            )}
          </DialogHeader>

          <ScrollArea className="max-h-[68vh] pr-4 -mr-4">
            <div className="grid gap-6 py-4 md:grid-cols-2">
              {/* Coluna esquerda */}
              <div className="space-y-5">
                {/* Descrição - sempre visível */}
                <div>
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                    placeholder={
                      currentContext === "mensalidade"
                        ? "Ex: Propina Mensal - Licenciatura em Engenharia Informática"
                        : "Ex: Matrícula 2025/2026, Taxa de Exame Especial, etc"
                    }
                  />
                </div>

                {/* Preço - sempre visível */}
                <div>
                  <Label htmlFor="preco">Preço (Kz) *</Label>
                  <Input
                    id="preco"
                    type="number"
                    min={0}
                    step={100}
                    value={formData.preco}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preco: Number(e.target.value) || 0 }))}
                  />
                </div>

                {/* Sigla - só aparece ao criar */}
                {!isEditing && (
                  <div>
                    <Label htmlFor="sigla">Sigla</Label>
                    <Input
                      id="sigla"
                      maxLength={10}
                      value={formData.sigla}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sigla: e.target.value.toUpperCase() }))}
                      placeholder="Ex: PROP, MATR, EXAM"
                    />
                  </div>
                )}

                {/* Tipo de Serviço - só aparece ao criar */}
               
                  <div>
                    <Label>Tipo de Serviço *</Label>
                    <FormSelect
                      value={String(formData.tipoServico || "")}
                      onChange={(v) => setFormData((prev) => ({ ...prev, tipoServico: v || "" }))}
                      options={[
                        { codigo: 1, label: "Mensal", value: "MENSAL" },
                        { codigo: 2, label: "Anual", value: "ANUAL" },
                        { codigo: 3, label: "Semestral", value: "SEMESTRAL" },
                      ]}
                      map={(a) => ({
                        key: String(a.codigo),
                        label: a.label,
                        value: String(a.value),
                      })}
                      placeholder="Selecione a Periodicidade"
                    />
                  </div>
               

                {/* Ano Letivo */}
                <div>
                  <Label>Ano Letivo *</Label>
                  <FormSelect
                    value={String(formData.codigoAnoLectivo || "")}
                    onChange={(v) => setFormData((prev) => ({ ...prev, codigoAnoLectivo: Number(v) || 0 }))}
                    options={anosAcademicos ?? []}
                    map={(a) => ({
                      key: String(a.codigo),
                      label: a.designacao,
                      value: String(a.codigo),
                    })}
                    placeholder="Selecione o ano letivo"
                  // disabled={isEditing && currentContext === "mensalidade"} // opcional: travar se for mensalidade
                  />
                </div>

                {/* Polo / Campus */}
                <div>
                  <Label htmlFor="poloId">Polo / Campus</Label>
                  <FormSelect
                    value={String(formData.poloId || "")}
                    onChange={(v) => setFormData((prev) => ({ ...prev, poloId: Number(v) || 0 }))}
                    options={polos ?? []}
                    map={(a) => ({
                      key: String(a.id),
                      label: a.designacao,
                      value: String(a.id),
                    })}
                    placeholder="Selecione o campus"
                  // disabled={isEditing && currentContext === "mensalidade"} // opcional: travar se for mensalidade
                  />
                </div>
              </div>

              {/* Coluna direita */}
              <div className="space-y-5">
                {/* Estado (Ativo/Inativo) */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="estado">Ativo</Label>
                  <Switch
                    id="estado"
                    checked={formData.estado}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, estado: checked }))}
                  />
                </div>

                {/* Campos que aparecem SOMENTE no modo EDIÇÃO */}
                {isEditing && (
                  <>
                    <div>
                      <Label htmlFor="taxaIva">Taxa IVA ID</Label>

                      <FormSelect
                        value={String(formData.taxaIvaId || "")}
                        onChange={(v) => setFormData((prev) => ({ ...prev, taxaIvaId: Number(v) || 0 }))}
                        options={taxa ?? []}
                        map={(a) => ({
                          key: String(a.id),
                          label: a.descricao,
                          value: String(a.id),
                        })}
                        placeholder="Selecione a Taxa"
                     
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivoIsencao">Motivo Isenção IVA</Label>

                      <FormSelect
                        value={String(formData.motivoIsencaoIvaCodigo || "")}
                        onChange={(v) => setFormData((prev) => ({ ...prev, motivoIsencaoIvaCodigo: Number(v) || 0 }))}
                        options={motivos ?? []}
                        map={(a) => ({
                          key: String(a.codigo),
                          label: a.descricao,
                          value: String(a.codigo),
                        })}
                        placeholder="Selecione a Taxa"
                      
                      />
                    </div>
                  </>
                )}

                {/* Campos que SÓ aparecem ao CRIAR */}
                {!isEditing && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Disponibilizar ao Aluno</Label>
                      <Switch
                        checked={formData.disponibilizarAluno}
                        onCheckedChange={(v) => setFormData((p) => ({ ...p, disponibilizarAluno: v }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Visualizar no Portal</Label>
                      <Switch
                        checked={formData.visualizarNoPortal}
                        onCheckedChange={(v) => setFormData((p) => ({ ...p, visualizarNoPortal: v }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Mestrado</Label>
                      <Switch
                        checked={formData.mestrado}
                        onCheckedChange={(v) => setFormData((p) => ({ ...p, mestrado: v }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="valorAnterior">Valor Anterior</Label>
                      <Input
                        id="valorAnterior"
                        type="number"
                        value={formData.valorAnterior}
                        onChange={(e) => setFormData((prev) => ({ ...prev, valorAnterior: Number(e.target.value) || 0 }))}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "A guardar..."
                : isEditing
                  ? currentContext === "servico"
                    ? "Atualizar Serviço"
                    : "Atualizar Mensalidade"
                  : "Criar Serviço"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}