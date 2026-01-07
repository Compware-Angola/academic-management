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

export default function Permission() {
  const [filters, setFilters] = useState({
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

  const openAddPermissionLaunchModal = () => {
    setIsModalOpen(true);
  };

  const openUpdatePermissionLaunchModal = (
    permission: AssessmentPermissionItem
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
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <>
      <div className="space-y-6">
        <nav className="text-sm text-muted-foreground flex gap-2">
          <Link to="/">Início</Link>
          <span>/</span>
          <span className="text-foreground">Permissão</span>
        </nav>

        <header className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">Permissão</h1>
            <p className="text-muted-foreground">Fora do Prazo</p>
          </div>

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
              <FormSelect
                disabled={isLoadingAcademicYear}
                loading={isLoadingAcademicYear}
                label="Ano Lectivo"
                value={filters.anoLetivo}
                onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
                options={academicYear}
                map={(a) => ({
                  key: a.codigo,
                  label: a.designacao,
                  value: a.codigo,
                })}
              />
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
                        <TableCell>{item.ano_lectivo}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.disciplina}</TableCell>
                        <TableCell>
                          <Badge>{item.avaliacao}</Badge>
                        </TableCell>
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
