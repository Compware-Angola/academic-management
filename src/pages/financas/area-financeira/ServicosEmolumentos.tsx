import { useState, useEffect } from "react";
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
  DownloadCloud,
  X,
  RotateCcw,
  Save,
  Pencil,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
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
import ImportarServicos from "./components/Importar-servicos";
import { useQueryFetchSiglaTipoServicos } from "@/hooks/sigla-tipo-servicos/use-sigla-tipo-servicos";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useCursos } from "@/hooks/use-cursos";
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
  categoria: "MENSALIDADE" | "OUTRO" | "";
};

const initialForm: ServicoFormData = {
  descricao: "",
  preco: undefined as number | undefined,
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
  categoria: "",

  valorAnterior: undefined as number | undefined,
  estadoSolicitacao: 1,
  tipoCandidatura: 1,
  codigoGradeCurricular: null,
};
export default function ServicosEmolumentos() {
  const { toast } = useToast();
  const { data: anosAcademicos } = useQueryAnoAcademico();

  // Filtros SEPARADOS para cada aba
  const [servicosFilters, setServicosFilters] = useState({
    tipoCandidatura: "",
    anoLetivo: "",
    descricao: "",
    polo: "",
  });
  const [mensalidadesFilters, setMensalidadesFilters] = useState({
    tipoCandidatura: "",
    anoLetivo: "",
    descricao: "",
    polo: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<ServicoFormData>(initialForm);
  const [editData, setEditData] = useState<ServicoFormData>(initialForm);

  const [isEditing, setIsEditing] = useState(false);
  const [editingCodigo, setEditingCodigo] = useState<number | null>(null);
  const [currentContext, setCurrentContext] = useState<
    "servico" | "mensalidade"
  >("servico");

  const [servicosPage, setServicosPage] = useState(1);
  const [mensalidadesPage, setMensalidadesPage] = useState(1);
  const pageLimit = 10;

  const { data: siglaTipoServicos = [], isLoading } =
    useQueryFetchSiglaTipoServicos(undefined);

  // Query para SERVIÇOS (usa servicosFilters)
  const { data: tiposServico, isLoading: isLoadingServicos } =
    useQueryTiposServicoAll({
      codigoAnoLectivo: servicosFilters.anoLetivo
        ? Number(servicosFilters.anoLetivo)
        : undefined,
      polo: servicosFilters.polo ? Number(servicosFilters.polo) : undefined,
      descricao: servicosFilters.descricao.trim() || undefined,
      page: servicosPage,
      limit: pageLimit,
    });

  // Query para MENSALIDADES (usa mensalidadesFilters)
  const { data: mensalidades, isLoading: isLoadingMensalidades } =
    useQueryMonthlyFeeTipoServico({
      codigoAnoLectivo: mensalidadesFilters.anoLetivo
        ? Number(mensalidadesFilters.anoLetivo)
        : undefined,
      polo: mensalidadesFilters.polo
        ? Number(mensalidadesFilters.polo)
        : undefined,
      descricao: mensalidadesFilters.descricao.trim() || undefined,
      page: mensalidadesPage,
      limit: pageLimit,
    });
  const { data: tiposCandidatura = [], isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();

  console.log("Tipos de candidatura:", tiposCandidatura);
  //Query Polo
  const { data: polos, isLoading: LoadingPolo } = usePoloDropdown();

  //Query Taxa
  const { data: taxa, isLoading: LoadingTaxa } = useTipoTaxaDropdown();

  // Query Motivo insenção

  const { data: motivos, isLoading: LoadingMotivos } =
    useMotivoIsencaoDropdown();

  const createMutation = useCreateTipoServico();
  const updateMutation = useUpdateTipoServico(editingCodigo ?? 0);

  const { data: cursos = [] } = useCursos({
    tipoCandidaturaId: formData.tipoCandidatura,
  });
  const cursoNome = cursos.find(
    (c) => String(c.codigo) === formData.cursoDescricao,
  )?.designacao;

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
      codigoAnoLectivo: servicosFilters.anoLetivo
        ? Number(servicosFilters.anoLetivo)
        : 0,
      tipoServico: "MENSAL",
    });
    setIsEditing(false);
    setCurrentContext("servico");
    setModalOpen(true);
  };

  const openEditModal = (item: any, context: "servico" | "mensalidade") => {
    setFormData({
      descricao: item.descricao || "",
      preco: Number(item.preco) || undefined,
      sigla:
        item.sigla ||
        (item.descricao ? item.descricao.slice(0, 4).toUpperCase() : ""),
      tipoServico: item.tiposervico.toUpperCase(),
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
      valorAnterior: Number(item.valorAnterior) || undefined,
      estadoSolicitacao: item.estadoSolicitacao || 1,
      tipoCandidatura: item.tipo_candidatura || 1,
      codigoGradeCurricular: item.codigoGradeCurricular || null,
      cursoDescricao: context === "mensalidade" ? item.descricao : undefined,
      grau:
        context === "mensalidade"
          ? item.mestrado
            ? "Mestrado"
            : "Licenciatura"
          : undefined,
      categoria: "",
    });
    setEditData({
      descricao: item.descricao || "",
      preco: Number(item.preco) || undefined,
      sigla:
        item.sigla ||
        (item.descricao ? item.descricao.slice(0, 4).toUpperCase() : ""),
      tipoServico: item.tiposervico.toUpperCase(),
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
      valorAnterior: Number(item.valorAnterior) || undefined,
      estadoSolicitacao: item.estadoSolicitacao || 1,
      tipoCandidatura: item.tipo_candidatura || 1,
      codigoGradeCurricular: item.codigoGradeCurricular || null,
      cursoDescricao: context === "mensalidade" ? item.descricao : undefined,
      grau:
        context === "mensalidade"
          ? item.mestrado
            ? "Mestrado"
            : "Licenciatura"
          : undefined,
      categoria: "",
    });

    setIsEditing(true);
    setEditingCodigo(item.codigo);
    setCurrentContext(context);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!isEditing && !formData.categoria) {
      toast({
        title: "Erro",
        description: "A categoria é obrigatória",
        variant: "destructive",
      });
      return;
    }
    if (
      !isEditing &&
      formData.categoria === "MENSALIDADE" &&
      !formData.cursoDescricao
    ) {
      toast({
        title: "Erro",
        description: "Selecione o curso para a mensalidade",
        variant: "destructive",
      });
      return;
    }
    if (!formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "A descrição é obrigatória",
        variant: "destructive",
      });
      return;
    }
    if (!formData.preco || formData.preco <= 0) {
      toast({
        title: "Erro",
        description: "O preço deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }
    if (!isEditing && !formData.sigla) {
      toast({
        title: "Erro",
        description: "Selecione a descrição da sigla",
        variant: "destructive",
      });
      return;
    }
    if (!formData.tipoServico) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de serviço",
        variant: "destructive",
      });
      return;
    }
    if (!formData.tipoCandidatura) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de candidatura",
        variant: "destructive",
      });
      return;
    }
    if (!formData.poloId) {
      toast({
        title: "Erro",
        description: "Selecione o polo / campus",
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
        tipoServico: formData.tipoServico,
      };

      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description:
              currentContext === "servico"
                ? "Serviço atualizado"
                : "Mensalidade atualizada",
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
      const { categoria, grau, cursoDescricao, ...rest } = formData;

      const payload: TipoServicoPayload = {
        ...rest,
        descricao:
          categoria === "MENSALIDADE"
            ? rest.descricao.replace(/^Mensalidade\s+/i, "Propina ")
            : rest.descricao,
        data: new Date().toISOString().split("T")[0],
        sigla:
          rest.sigla.trim() ||
          rest.descricao.slice(0, 4).toUpperCase() ||
          "SERV",
      };

      createMutation.mutate(payload, {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Serviço criado com sucesso",
          });
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
  function setData(u: string) {
    const itemEncontrado = siglaTipoServicos?.find((item) => item.sigla === u);

    setFormData((prev) => ({
      ...prev,
      sigla: u,
      descricao:
        prev.categoria === "MENSALIDADE"
          ? prev.descricao
          : (itemEncontrado?.descricao ?? prev.descricao),
    }));
  }

  const handleReset = () => {
    if (isEditing && editData) {
      setFormData(editData);
    } else {
      setFormData(initialForm);
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
        <TabsList className="grid w-full max-w-3xl grid-cols-3">
          <TabsTrigger value="servicos" className="gap-2">
            <FileText className="h-4 w-4" /> Serviços
          </TabsTrigger>
          <TabsTrigger value="mensalidades" className="gap-2">
            <GraduationCap className="h-4 w-4" /> Mensalidades por Curso
          </TabsTrigger>
          <TabsTrigger value="import-servico" className="gap-2">
            <DownloadCloud className="h-4 w-4" /> Importação de Serviços
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
                    label="Tipo de Candidatura"
                    value={servicosFilters.tipoCandidatura}
                    onChange={(v) => {
                      setServicosFilters((prev) => ({
                        ...prev,
                        tipoCandidatura: v,
                        anoLetivo: "",
                      }));
                      setServicosPage(1);
                    }}
                    options={tiposCandidatura}
                    loading={isLoadingTiposCandidatura}
                    map={(tipo) => ({
                      key: tipo.codigo,
                      label: tipo.designacao,
                      value: tipo.codigo,
                    })}
                    placeholder="Selecione o tipo..."
                  />
                </div>
                <div className="min-w-[220px]">
                  <AcademicYearsAvailableForOperationSelect
                    label={
                      formData.tipoCandidatura === 2 ? "Ciclo" : "Ano Letivo"
                    }
                    value={servicosFilters.anoLetivo}
                    onChangeValue={(v) => {
                      setServicosFilters((prev) => ({ ...prev, anoLetivo: v }));
                      setServicosPage(1);
                    }}
                    tipoCandidaturaId={
                      parseFilter(servicosFilters.tipoCandidatura) ?? 1
                    }
                    onlyConfigurable={false}
                    disabled={!servicosFilters.tipoCandidatura}
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
                      setServicosFilters((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }));
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
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum serviço encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    tiposServico.data.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell className="font-medium">
                          {item.codigo}
                        </TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>
                          {Number(item.preco).toLocaleString()} kz
                        </TableCell>
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
                    label="Tipo de Candidatura"
                    value={mensalidadesFilters.tipoCandidatura}
                    onChange={(v) => {
                      setMensalidadesFilters((prev) => ({
                        ...prev,
                        tipoCandidatura: v,
                        anoLetivo: "",
                      }));
                      setMensalidadesPage(1);
                    }}
                    options={tiposCandidatura}
                    loading={isLoadingTiposCandidatura}
                    map={(tipo) => ({
                      key: tipo.codigo,
                      label: tipo.designacao,
                      value: tipo.codigo,
                    })}
                    placeholder="Selecione o tipo..."
                  />
                </div>
                <div className="min-w-[220px]">
                  <AcademicYearsAvailableForOperationSelect
                    label="Ano Letivo"
                    value={mensalidadesFilters.anoLetivo}
                    onChangeValue={(v) => {
                      setMensalidadesFilters((prev) => ({
                        ...prev,
                        anoLetivo: v,
                      }));
                      setMensalidadesPage(1);
                    }}
                    tipoCandidaturaId={
                      parseFilter(mensalidadesFilters.tipoCandidatura) ?? 1
                    }
                    onlyConfigurable={false}
                    disabled={!mensalidadesFilters.tipoCandidatura}
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
                      setMensalidadesFilters((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }));
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
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhuma mensalidade encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    mensalidades.data.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>
                          {" "}
                          {item.descricao.replace(/propina/gi, "Mensalidade")}
                        </TableCell>
                        <TableCell>
                          {item.mestrado.toUpperCase() == "NAO"
                            ? "Licenciatura"
                            : "Mestrado"}
                        </TableCell>
                        <TableCell>
                          {Number(item.preco).toLocaleString()} kz
                        </TableCell>
                        <TableCell>
                          {Number(item.preco * 10).toLocaleString()} kz
                        </TableCell>
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
                    onClick={() =>
                      setMensalidadesPage((p) => Math.max(1, p - 1))
                    }
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
        <TabsContent value="import-servico" className="space-y-6 mt-6">
          <ImportarServicos />
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl! max-h-[92vh]! overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-medium">
              {isEditing
                ? currentContext === "servico"
                  ? "Editar Serviço"
                  : "Editar Mensalidade"
                : "Criar Novo Serviço"}
            </DialogTitle>
            {isEditing && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentContext === "servico" ? "Serviço" : "Mensalidade"} –
                Código: {editingCodigo}
              </p>
            )}
            {!isEditing && (
              <p className="text-sm text-muted-foreground mt-1">
                Preencha os dados do serviço académico
              </p>
            )}
          </DialogHeader>

          <ScrollArea className="max-h-[68vh] px-6">
            <div className="space-y-6 py-4">
              {/* ─── Informações básicas ─── */}
              <section>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Informações básicas
                </h3>
                <div className="rounded-xl border bg-card p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Descrição */}
                    <div className="md:col-span-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="descricao">
                          Descrição <span className="text-destructive">*</span>
                        </Label>
                        {!isEditing && formData.categoria !== "MENSALIDADE" && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="w-3 h-3" />
                            Preenchido pela sigla
                          </span>
                        )}
                        {!isEditing && formData.categoria === "MENSALIDADE" && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Pencil className="w-3 h-3" />
                            Editável
                          </span>
                        )}
                      </div>
                      <Input
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            descricao: e.target.value,
                          }))
                        }
                        disabled={
                          !isEditing && formData.categoria !== "MENSALIDADE"
                        }
                        className={
                          !isEditing && formData.categoria !== "MENSALIDADE"
                            ? "bg-muted text-muted-foreground"
                            : ""
                        }
                        placeholder={
                          currentContext === "mensalidade"
                            ? "Ex: Propina Mensal - Licenciatura em Engenharia Informática"
                            : "Ex: Matrícula 2025/2026, Taxa de Exame Especial, etc"
                        }
                      />
                      {!isEditing && (
                        <p className="text-xs text-muted-foreground">
                          {formData.categoria === "MENSALIDADE"
                            ? "A descrição pode ser editada porque o tipo é mensalidade."
                            : "Selecione uma sigla para preencher a descrição automaticamente."}
                        </p>
                      )}
                    </div>
                    {/* Categoria — criação */}
                    {!isEditing && (
                      <div className="space-y-1.5">
                        <Label>
                          Categoria <span className="text-destructive">*</span>
                        </Label>
                        <FormSelect
                          value={String(formData.categoria || "")}
                          onChange={(v) => {
                            const categoria = v as "MENSALIDADE" | "OUTRO" | "";
                            setFormData((prev) => ({
                              ...prev,
                              categoria,
                              sigla: categoria === "MENSALIDADE" ? "PROP" : "",
                              cursoDescricao: undefined,
                              descricao: "",
                            }));
                          }}
                          options={[
                            {
                              codigo: 1,
                              label: "Mensalidade",
                              value: "MENSALIDADE",
                            },
                            {
                              codigo: 2,
                              label: "Outro Serviço",
                              value: "OUTRO",
                            },
                          ]}
                          map={(a) => ({
                            key: String(a.codigo),
                            label: a.label,
                            value: String(a.value),
                          })}
                          placeholder="Selecione a categoria"
                        />
                      </div>
                    )}
                    {!isEditing && formData.categoria === "MENSALIDADE" && (
                      <CourseSelect
                        value={formData.cursoDescricao}
                        showDefaultItem={false}
                        onChangeValue={(v) => {
                          const curso = cursos.find(
                            (c) => String(c.codigo) === v,
                          )?.designacao;
                          setFormData((prev) => ({
                            ...prev,
                            cursoDescricao: v,
                            descricao: curso
                              ? `Mensalidade ${curso}`
                              : prev.descricao,
                          }));
                        }}
                        params={{
                          tipoCandidaturaId: formData.tipoCandidatura,
                        }}
                        disabled={!formData.tipoCandidatura}
                      />
                    )}

                    {/* Preço */}
                    <div className="space-y-1.5">
                      <Label htmlFor="preco">
                        Preço (Kz) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="preco"
                        type="number"
                        min={0}
                        step={100}
                        value={formData.preco ?? ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preco:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          }))
                        }
                      />
                    </div>

                    {!isEditing && (
                      <div className="space-y-1.5">
                        <Label htmlFor="valorAnterior">
                          Valor Anterior (Kz)
                        </Label>
                        <Input
                          id="valorAnterior"
                          type="number"
                          min={0}
                          step={100}
                          value={formData.valorAnterior ?? ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              valorAnterior:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            }))
                          }
                        />
                      </div>
                    )}

                    {/* Sigla — criação */}
                    {!isEditing && (
                      <div className="md:col-span-2 space-y-1.5">
                        <Label>Descrição da sigla</Label>
                        <FormCommandSelect
                          key={formData.categoria || "none"}
                          width="full"
                          value={
                            formData.sigla === "PROP"
                              ? "MENSALIDADE"
                              : formData.sigla
                          }
                          options={
                            formData.categoria === "MENSALIDADE"
                              ? (siglaTipoServicos ?? [])
                              : (siglaTipoServicos ?? []).filter(
                                  (u) =>
                                    u.sigla.toString().toUpperCase() !== "PROP",
                                )
                          }
                          map={(u) => ({
                            key: u.codigo.toString(),
                            value: u.sigla.toString(),
                            label: u.descricao,
                          })}
                          placeholder={
                            formData.categoria === "MENSALIDADE"
                              ? "Sigla pré-definida para mensalidade"
                              : "Selecione a descrição da sigla"
                          }
                          onChange={(u) => setData(u.toString())}
                          disabled={formData.categoria === "MENSALIDADE"}
                        />
                      </div>
                    )}

                    {/* Taxa IVA — edição */}
                    {isEditing && (
                      <div className="space-y-1.5">
                        <Label>Taxa IVA</Label>
                        <FormSelect
                          value={String(formData.taxaIvaId || "")}
                          onChange={(v) =>
                            setFormData((prev) => ({
                              ...prev,
                              taxaIvaId: Number(v) || 0,
                            }))
                          }
                          options={taxa ?? []}
                          map={(a) => ({
                            key: String(a.id),
                            label: a.descricao,
                            value: String(a.id),
                          })}
                          placeholder="Selecione a Taxa"
                        />
                      </div>
                    )}

                    {/* Motivo Isenção — edição */}
                    {isEditing && (
                      <div className="space-y-1.5">
                        <Label>Motivo Isenção IVA</Label>
                        <FormSelect
                          value={String(formData.motivoIsencaoIvaCodigo || "")}
                          onChange={(v) =>
                            setFormData((prev) => ({
                              ...prev,
                              motivoIsencaoIvaCodigo: Number(v) || 0,
                            }))
                          }
                          options={motivos ?? []}
                          map={(a) => ({
                            key: String(a.codigo),
                            label: a.descricao,
                            value: String(a.codigo),
                          })}
                          placeholder="Selecione o motivo"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* ─── Configurações académicas ─── */}
              <section>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Configurações académicas
                </h3>
                <div className="rounded-xl border bg-card p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>
                        Tipo de Serviço{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <FormSelect
                        value={String(formData.tipoServico || "")}
                        onChange={(v) =>
                          setFormData((prev) => ({
                            ...prev,
                            tipoServico: v || "",
                          }))
                        }
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

                    <div className="space-y-1.5">
                      <Label>Tipo de Candidatura</Label>
                      <FormSelect
                        value={String(formData.tipoCandidatura || "")}
                        onChange={(v) => {
                          const tipoCandidatura = Number(v) || 1;
                          setFormData((prev) => ({
                            ...prev,
                            tipoCandidatura,
                            codigoAnoLectivo: 0,
                            mestrado: tipoCandidatura === 2,
                          }));
                        }}
                        options={tiposCandidatura}
                        loading={isLoadingTiposCandidatura}
                        map={(tipo) => ({
                          key: tipo.codigo,
                          label: tipo.designacao,
                          value: tipo.codigo,
                        })}
                        placeholder="Selecione o tipo de candidatura"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <AcademicYearsAvailableForOperationSelect
                        label={
                          formData.tipoCandidatura === 2
                            ? "Ciclo"
                            : "Ano Letivo"
                        }
                        value={String(formData.codigoAnoLectivo || "")}
                        onChangeValue={(v) =>
                          setFormData((prev) => ({
                            ...prev,
                            codigoAnoLectivo: Number(v) || 0,
                          }))
                        }
                        tipoCandidaturaId={formData.tipoCandidatura || 1}
                        onlyConfigurable={false}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Polo / Campus</Label>
                      <FormSelect
                        value={String(formData.poloId || "")}
                        onChange={(v) =>
                          setFormData((prev) => ({
                            ...prev,
                            poloId: Number(v) || 0,
                          }))
                        }
                        options={polos ?? []}
                        map={(a) => ({
                          key: String(a.id),
                          label: a.designacao,
                          value: String(a.id),
                        })}
                        placeholder="Selecione o campus"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ─── Opções de publicação — apenas criação ─── */}
              {!isEditing && (
                <section>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Opções de publicação
                  </h3>
                  <div className="rounded-xl border bg-card p-4 space-y-1">
                    <div className="flex items-center justify-between py-2.5 border-b last:border-0">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">
                          Disponibilizar ao Aluno
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          O aluno poderá visualizar e solicitar este serviço
                        </p>
                      </div>
                      <Switch
                        checked={formData.disponibilizarAluno}
                        onCheckedChange={(v) =>
                          setFormData((p) => ({ ...p, disponibilizarAluno: v }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-2.5 border-b last:border-0">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">
                          Visualizar no Portal
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Exibe o serviço publicamente no portal institucional
                        </p>
                      </div>
                      <Switch
                        checked={formData.visualizarNoPortal}
                        onCheckedChange={(v) =>
                          setFormData((p) => ({ ...p, visualizarNoPortal: v }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">Mestrado</Label>
                        <p className="text-xs text-muted-foreground">
                          Serviço exclusivo para candidaturas de mestrado
                        </p>
                      </div>
                      <Switch
                        checked={formData.mestrado}
                        onCheckedChange={(v) =>
                          setFormData((p) => ({ ...p, mestrado: v }))
                        }
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* ─── Estado ─── */}
              <section>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Estado
                </h3>
                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Serviço Ativo
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Serviços inativos não aparecem para novas solicitações
                      </p>
                    </div>
                    <Switch
                      id="estado"
                      checked={formData.estado}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, estado: checked }))
                      }
                    />
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Limpar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="gap-1.5"
            >
              <Save className="w-4 h-4" />
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
