import { useMemo } from "react";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronLeft, ChevronRight, Pencil, Plus, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { Switch } from "@/components/ui/switch";
import { useQueryAssessmentPermissions } from "@/hooks/avaliacao/use-query-permission-assessment";
import { formatarData } from "@/util/date-formate";
import { Badge } from "@/components/ui/badge";

import AddPermissionLaunchModal from "../components/AddPermissionLaunchModal";
import { useMutationUpdatePermissionAssessment } from "@/hooks/avaliacao/use-mutation-update-permission-launch";
import UpdatePermissionLaunchModal from "../components/UpdatePermissionLaunchModal";
import { AssessmentPermissionItem } from "@/services/avaliacao/fetch-permission-assessment";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

export default function Permission() {
  const [filters, setFilters] = useState({
    tipoCandidatura: "",
    anoLetivo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<
    AssessmentPermissionItem | undefined
  >(undefined);

  const itemsPerPage = 10;

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { hasPermission } = usePermission();
  const { data: tiposCandidatura = [], isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();
  const tiposCandidaturaFiltered = tiposCandidatura.filter((tipo) => {
    if (
      !hasPermission(PermissionTypeDetails.PERMISSAO_FORA_PRAZO_POS_GRADUACAO.sigla) &&
      (tipo.sigla === "DTR" || tipo.sigla === "MST")
    ) {
      return false;
    }
    return true;
  });

  const openAddPermissionLaunchModal = () => {
    setIsModalOpen(true);
  };

  const openUpdatePermissionLaunchModal = (
    permission: AssessmentPermissionItem,
  ) => {
    setIsUpdateModalOpen(true);
    setSelectedPermission(permission);
  };

  const changeSwitchState = (state: number) => {
    if (state == 1) return 0;
    if (state == 0) return 1;
    return 0;
  };

  const { mutate: updatePermission, isPending: isUpdateLoadingPermission } =
    useMutationUpdatePermissionAssessment();

  const { data: permissionReponse, isLoading } = useQueryAssessmentPermissions({
    anoLectivo: filters.anoLetivo,
    page: currentPage,
    limit: itemsPerPage,
  });

  const data = permissionReponse?.data || [];
  const total = permissionReponse?.total || 0;


const pdfData = useMemo(() => {
  if (!data.length) return null;

  const rows = data.map((item) => ({
    codigo: item.codigo_permissao,
    ano: item.ano_lectivo,
    curso: item.curso,
    disciplina: item.disciplina,
    avaliacao: item.avaliacao,
    inicio: formatarData(item.data_inicio),
    fim: formatarData(item.data_fim),
    estado: item.estado === 1 ? "Ativa" : "Inativa",
  }));

  const anoLetivoNome =
    academicYear?.find((a) => a.codigo === Number(filters.anoLetivo))
      ?.designacao || "Todos";

  return {
    filtros: `Ano Letivo: ${anoLetivoNome}`,
    total: data.length,
    rows,
  };
}, [data, filters, academicYear]);


const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Permissão de Lançamento Fora do Prazo"
    subtitle="Lista de permissões registadas no sistema"
    infoSections={[
      {
        title: "Filtros Aplicados",
        content: pdfData.filtros,
      },
      {
        title: "Resumo",
        content: [`Total de permissões: ${pdfData.total}`],
      },
    ]}
    mainTable={{
      headers: [
        { key: "codigo", label: "Código", width: "8%" },
        { key: "ano", label: "Ano Letivo", width: "10%" },
        { key: "curso", label: "Curso", width: "16%" },
        { key: "disciplina", label: "Disciplina", width: "20%" },
        { key: "avaliacao", label: "Avaliação", width: "12%" },
        { key: "inicio", label: "Início", width: "12%" },
        { key: "fim", label: "Fim", width: "12%" },
        {
          key: "estado",
          label: "Estado",
          width: "10%",
          align: "center",
        },
      ],
      rows: pdfData.rows,
      headerBackground: "#0D1B48",
    }}
    footerNotice="Permissões sujeitas a alterações conforme decisão administrativa."
    customFooter="Sistema de Gestão Académica"
  />
) : null;


  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <>
      <div className="space-y-6">
        <nav className="text-sm text-muted-foreground flex gap-2">
          <Link to="/">Início</Link>
          <span>/</span>
          <span className="text-foreground">Permissão</span>
        </nav>

        <header className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold">PERMISSÃO LANÇ. FORA DO PRAZO</h1>
          </div>

          {data.length > 0 && pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Permissoes_Lancamento_${filters.anoLetivo || "todos"}_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}


          <Button
            size="sm"
            onClick={() => openAddPermissionLaunchModal()}
            disabled={isLoading}
          >
            <Plus
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Adicionar
          </Button>
        </header>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Permissões Encontradas</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[520px]">
                <FormSelect
                  label="Tipo de Candidatura"
                  value={filters.tipoCandidatura}
                  onChange={(v) =>
                    setFilters({
                      ...filters,
                      tipoCandidatura: v,
                      anoLetivo: "",
                    })
                  }
                  options={tiposCandidaturaFiltered}
                  loading={isLoadingTiposCandidatura}
                  map={(tipo) => ({
                    key: tipo.codigo,
                    label: tipo.designacao,
                    value: tipo.codigo,
                  })}
                />
                <AcademicYearsAvailableForOperationSelect
                  label="Ano Lectivo"
                  value={filters.anoLetivo}
                  onChangeValue={(v) =>
                    setFilters({ ...filters, anoLetivo: v })
                  }
                  tipoCandidaturaId={parseFilter(filters.tipoCandidatura) ?? 1}
                  onlyConfigurable={false}
                  disabled={!filters.tipoCandidatura}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))
            ) : data.length === 0 ? (
              <div className="bg-card border rounded-lg text-center py-10">
                <Shield className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                <p>Nenhum registro encontrado</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Ano Lectivo</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>Utilizador</TableHead>
                      <TableHead>Data Inicio</TableHead>
                      <TableHead>Data Final</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.map((item, i) => (
                      <TableRow key={item.codigo_permissao}>
                        <TableCell>{item.codigo_permissao}</TableCell>
                        <TableCell>{item?.ano_lectivo}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.disciplina}</TableCell>
                        <TableCell>
                          <Badge>{item.avaliacao}</Badge>
                        </TableCell>
                        <TableCell>{item.nome_docente}</TableCell>
                        <TableCell>{item.utilizador}</TableCell>
                        <TableCell>{formatarData(item.data_inicio)}</TableCell>
                        <TableCell>{formatarData(item.data_fim)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={item.estado === 1}
                            disabled={isUpdateLoadingPermission}
                            onCheckedChange={() => {
                              updatePermission({
                                permissionId: item.codigo_permissao,
                                payload: {
                                  ativeState: changeSwitchState(item.estado),
                                },
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Editar horário"
                            onClick={() =>
                              openUpdatePermissionLaunchModal(item)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* PAGINAÇÃO */}
            <div className="flex justify-end gap-3 items-center mt-4">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <AddPermissionLaunchModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <UpdatePermissionLaunchModal
        permission={selectedPermission}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedPermission(undefined);
        }}
      />
    </>
  );
}
