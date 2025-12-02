import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  FileDown,
  Printer,
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import { useClasses } from "@/hooks/use-classes";
import { useQueryDepartamento } from "@/hooks/depatamento/use-query-depardamento";
import { FormSelect } from "@/components/common/FormSelect";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDepartamentoUC } from "@/hooks/depatamento/use-quer-departamento-uc";

interface UnidadeCurricular {
  id: number;
  sigla: string;
  nome: string;
  departamento: string;
  coordenador: string;
  creditos: number;
  semestre: string;
  cargaHoraria: number;
  docentesAlocados: number;
  capacidade: number;
  status: "Ativa" | "Inativa" | "Em Revisão";
}

export default function UcDepartmentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();

  const [formData, setFormData] = useState({
    departamento: "",
    curso: "",
    semestre: "",
    classes: "",
  });
  const { data: departamento = [], isLoading: isLoadingDepartamento } =
    useQueryDepartamento();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });

  const { data: departamentoUC = [], isLoading: isLoadingDepartamentoUC } =
    useQueryDepartamentoUC({
      classe: formData.classes,
      departamento: formData.departamento,
      semestre: formData.semestre,
    });
  const mockData: UnidadeCurricular[] = [];

  const handleCreate = () => {
    toast.info("A abrir formulário de criação...");
  };

  const handleEdit = (id: number) => {
    toast.info(`A editar UC com ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    toast.error(`A eliminar UC com ID: ${id}`);
  };

  const handleViewDocentes = (id: number) => {
    toast.info(`A visualizar docentes da UC com ID: ${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "default";
      case "Inativa":
        return "destructive";
      case "Em Revisão":
        return "secondary";
      default:
        return "outline";
    }
  };

  const totalPages = Math.ceil(departamentoUC.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = departamentoUC.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/plano">Plano de Estudo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gestão de UC por Departamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Gestão de UC por Departamento"
        subtitle="Gerir unidades curriculares organizadas por departamento académico"
        actions={
          <>
            {/* <Button variant="default" size="sm" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nova UC
            </Button> */}
          </>
        }
      />

      <FilterBar>
        <FormSelect
          disabled={isLoadingDepartamento}
          loading={isLoadingDepartamento}
          label="Departamento"
          value={formData.departamento}
          onChange={(v) => setFormData({ ...formData, departamento: v })}
          options={departamento}
          map={(a) => ({
            key: a.codigo,
            label: a.designacao,
          })}
        />
        <FormSelect
          disabled={loadingCursos}
          loading={loadingCursos}
          label="Curso"
          value={formData.curso}
          onChange={(v) => setFormData({ ...formData, curso: v })}
          options={cursos}
          map={(a) => ({
            key: a.codigo,
            label: a.designacao,
          })}
        />
        <FormSelect
          label="Ano Curricular"
          value={formData.classes}
          disabled={isLoadingClasses || !formData.curso}
          onChange={(v) => setFormData({ ...formData, classes: v })}
          options={classes}
          map={(c) => ({
            key: c.codigo,
            label: c.designacao,
          })}
          loading={isLoadingClasses}
        />
        <FormSelect
          disabled={isLoadingSemestres}
          loading={isLoadingSemestres}
          label="Semestre"
          value={formData.semestre}
          onChange={(v) => setFormData({ ...formData, semestre: v })}
          options={semestres}
          map={(s) => ({
            key: s.codigo,
            label: s.designacao,
          })}
        />
      </FilterBar>

      <div className="rounded-md border">
        {isLoadingDepartamentoUC ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-lg">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              {" "}
              <p className="text-lg font-medium">
                Nenhuma disciplina encontrada
              </p>
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Ano Curricular</TableHead>
                <TableHead>Semestre</TableHead>

                {/* <TableHead className="text-right">Ações</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData.map((uc) => (
                <TableRow key={uc.codigo_grade}>
                  <TableCell className="font-medium">
                    {uc.codigo_grade}
                  </TableCell>

                  <TableCell>{uc.disciplina}</TableCell>

                  <TableCell>{uc.classe}</TableCell>

                  <TableCell>{uc.semestre}</TableCell>

                  {/* <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDocentes(uc.codigo_grade)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(uc.codigo_grade)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(uc.codigo_grade)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!isLoadingDepartamentoUC && currentData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              registos por página
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
