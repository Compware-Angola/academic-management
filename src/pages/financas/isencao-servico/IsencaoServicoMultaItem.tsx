import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Link } from "react-router-dom";
import { CircleDollarSign, Home, Plus, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useQueryFetchIsencaoServico } from "@/hooks/financas/isencao-servico/use-query-isencao-sevico.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { formatarData } from "@/util/date-formate.ts";
import {
  EditIsencaoServicoDialog,
  EditIsencaoServicoFormData,
} from "@/pages/financas/isencao-servico/EditIsencaoServicoDialog.tsx";
import { useMutationUpdateIsencaoServico } from "@/hooks/financas/isencao-servico/use-mutation-update-isencao-servico.ts";
import { Pencil } from "lucide-react";
import type {
  IsencaoServico,
  UpdateIsencaoServicoBody,
} from "@/services/financas/isencao-servicos/isencao-servico.service.ts";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { parseFilter } from "@/util/parse-filter";

import { useQueryFetchIsencaoMulta } from "@/hooks/financas/isencao-servico/use-query-isencao-multa";
import { PaginationComponent } from "@/components/common/PaginationComponent";
import CreateIsencaoMultaDialog from "./CreateIsencaoMultaDialog";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";

export default function IsencaoServicoMultaItem() {
  const [matriculaInput, setMatriculaInput] = useState("");
  const [tipoCandidatura, setTipoCandidatura] = useState("1");
  const [filters, setFilters] = useState({
    matricula: null,
    anoLectivo: "",
    faculdade: "",
    curso: "",
  });
  const [filtersApplied, setFiltersApplied] = useState({
    matricula: null,
    anoLectivo: "",
    faculdade: "",
    curso: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: tiposCandidatura, isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();

  const { data, refetch, isFetching } = useQueryFetchIsencaoMulta({
    codigoMatricula: parseFilter(filtersApplied.matricula),
    anoLectivo: parseFilter(filtersApplied.anoLectivo),
    codigoCurso: parseFilter(filtersApplied.curso),
    faculdadeId: parseFilter(filtersApplied.faculdade),
    page,
    limit,
  });

  const items = data?.data ?? [];
  const hasNextPage = data?.hasNextPage ?? false;

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editForm, setEditForm] = useState<EditIsencaoServicoFormData>({
    codigoMatricula: "",
    codigoServico: "",
    codigoAnoLectivo: "",
    dataIsencao: "",
    obs: "",
    estadoIsencao: "",
  });
  const [originalEditForm, setOriginalEditForm] =
    useState<EditIsencaoServicoFormData | null>(null);

  const { mutateAsync: mutateUpdate, isPending: isUpdating } =
    useMutationUpdateIsencaoServico();

  const handleEditOpen = (item: IsencaoServico) => {
    const initial = {
      codigoMatricula: item.codigo_matricula ?? "",
      codigoServico: item.codigo_servico ?? "",
      codigoAnoLectivo: item.codigo_anolectivo ?? "",
      dataIsencao: item.data_isencao ?? "",
      obs: "",
      estadoIsencao: item.estado_isensao ?? "",
      codigo: item.codigo,
    };
    console.log(initial);
    setEditForm(initial);
    setOriginalEditForm(initial);
    setIsEditOpen(true);
  };

  const formatDateToYYYYMMDD = (dateInput?: string | number) => {
    if (!dateInput) return undefined;
    const s = String(dateInput);
    const isoMatch = s.match(/^\d{4}-\d{2}-\d{2}T/);
    if (isoMatch) {
      const d = new Date(s);
      if (isNaN(d.getTime())) return undefined;
      const y = d.getUTCFullYear();
      const m = `${d.getUTCMonth() + 1}`.padStart(2, "0");
      const day = `${d.getUTCDate()}`.padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    const simpleMatch = s.match(/^\d{4}-\d{2}-\d{2}$/);
    if (simpleMatch) return s;
    const d = new Date(s);
    if (isNaN(d.getTime())) return undefined;
    const y = d.getUTCFullYear();
    const m = `${d.getUTCMonth() + 1}`.padStart(2, "0");
    const day = `${d.getUTCDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleEditSubmit = async () => {
    const codigo = editForm.codigo;
    if (!codigo) return;

    const body: UpdateIsencaoServicoBody = {};

    if (originalEditForm) {
      if (
        String(editForm.codigoMatricula ?? "") !==
        String(originalEditForm.codigoMatricula ?? "")
      ) {
        if (editForm.codigoMatricula !== "" && editForm.codigoMatricula != null)
          body.codigoMatricula = Number(editForm.codigoMatricula);
        else body.codigoMatricula = null;
      }

      if (
        String(editForm.codigoServico ?? "") !==
        String(originalEditForm.codigoServico ?? "")
      ) {
        if (editForm.codigoServico !== "" && editForm.codigoServico != null)
          body.codigoServico = Number(editForm.codigoServico);
        else body.codigoServico = null;
      }

      if (
        String(editForm.codigoAnoLectivo ?? "") !==
        String(originalEditForm.codigoAnoLectivo ?? "")
      ) {
        if (
          editForm.codigoAnoLectivo !== "" &&
          editForm.codigoAnoLectivo != null
        )
          body.codigoAnoLectivo = Number(editForm.codigoAnoLectivo);
        else body.codigoAnoLectivo = null;
      }

      const newDate = formatDateToYYYYMMDD(editForm.dataIsencao);
      const oldDate = formatDateToYYYYMMDD(originalEditForm.dataIsencao);
      if (newDate !== oldDate) {
        if (newDate) body.dataIsencao = newDate;
        else body.dataIsencao = null;
      }

      if (String(editForm.obs ?? "") !== String(originalEditForm.obs ?? "")) {
        body.obs = editForm.obs ?? null;
      }

      if (
        String(editForm.estadoIsencao ?? "") !==
        String(originalEditForm.estadoIsencao ?? "")
      ) {
        body.estadoIsencao = editForm.estadoIsencao ?? null;
      }
    } else {
      if (editForm.codigoMatricula)
        body.codigoMatricula = Number(editForm.codigoMatricula);
      if (editForm.codigoServico)
        body.codigoServico = Number(editForm.codigoServico);
      if (editForm.codigoAnoLectivo)
        body.codigoAnoLectivo = Number(editForm.codigoAnoLectivo);
      const fmt = formatDateToYYYYMMDD(editForm.dataIsencao);
      if (fmt) body.dataIsencao = fmt;
      if (editForm.obs) body.obs = editForm.obs;
      if (editForm.estadoIsencao) body.estadoIsencao = editForm.estadoIsencao;
    }

    if (Object.keys(body).length === 0) {
      setIsEditOpen(false);
      return;
    }

    await mutateUpdate({ codigo, body });
    setIsEditOpen(false);
    setOriginalEditForm(null);
    await refetch();
  };

  const handleSearch = () => {
    setFiltersApplied({
      ...filters,
      matricula: matriculaInput,
    });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormSelect
              label="Tipo de Candidatura"
              value={tipoCandidatura}
              loading={isLoadingTiposCandidatura}
              onChange={(v) => {
                setTipoCandidatura(v);
                setFilters({ ...filters, anoLectivo: "", curso: "" });
                setPage(1);
              }}
              options={tiposCandidatura}
              map={(tipo) => ({
                key: tipo.codigo,
                label: tipo.designacao,
                value: tipo.codigo,
              })}
              placeholder="Selecione o tipo..."
            />
            <AcademicYearsAvailableForOperationSelect
              value={filters.anoLectivo}
              tipoCandidaturaId={parseFilter(tipoCandidatura) ?? 1}
              onlyConfigurable={false}
              disabled={!tipoCandidatura}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <FacultySelect
              allOption
              placeholder="Faculdade"
              value={filters.faculdade}
              onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
            />
            <CourseSelect
              placeholder="Cursos"
              params={{
                faculdadeId: parseFilter(filters.faculdade),
                tipoCandidaturaId: parseFilter(tipoCandidatura),
              }}
              value={filters.curso}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            />
            <div className="space-y-1">
              <Label>Matricula</Label>
              <Input
                placeholder="Ex: 12345"
                value={matriculaInput}
                onChange={(e) => setMatriculaInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isFetching}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end flex-wrap gap-3 bg-muted/40 border rounded-lg px-4 py-3">
        <div className="flex  gap-2 text-sm text-muted-foreground">
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() => setIsMonthModalOpen(true)}
            >
              <CircleDollarSign className="h-4 w-4" />
              Isentar Multas
            </Button>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Isenções de Multa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matricula</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Grau Academico</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Ano Lectivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Mensalidade</TableHead>
                <TableHead>Data de Isenção</TableHead>
                <TableHead>Editar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching && items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow>
                    <TableCell>{item.codigo_matricula ?? "-"}</TableCell>
                    <TableCell>{item.nome_completo ?? "-"}</TableCell>
                    <TableCell>{item.curso ?? "-"}</TableCell>
                    <TableCell>{item.candidatura ?? "-"}</TableCell>
                    <TableCell>{item.servico ?? "-"}</TableCell>
                    <TableCell>{item.ano_lectivo ?? "-"}</TableCell>
                    <TableCell>{item.estado ?? "-"}</TableCell>
                    <TableCell>{item.mes_temp ?? "-"}</TableCell>
                    <TableCell>
                      {item.data_isencao
                        ? formatarData(item.data_isencao)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => {}}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <PaginationComponent
            hasNext={hasNextPage}
            limit={limit}
            page={page}
            setLimit={setLimit}
            setPage={setPage}
          />
        </CardContent>
      </Card>

      <CreateIsencaoMultaDialog
        open={isMonthModalOpen}
        onOpenChange={setIsMonthModalOpen}
      />
      <EditIsencaoServicoDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        formData={editForm}
        onChange={setEditForm}
        onSubmit={handleEditSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
