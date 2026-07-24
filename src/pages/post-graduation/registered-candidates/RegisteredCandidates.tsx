import { useEffect, useState } from "react";
import {

  EyeIcon,
  Loader2,
  RefreshCw,

} from "lucide-react";

import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { parseFilter } from "@/util/parse-filter";
import { PosGraduationCandidate, PostGraduationCandidateStatus, PostGraduationPaymentStatus } from "@/services/post-graduation/candidates.service";
import { useQueryCandidatesPosGraduation } from "@/hooks/post-graduation/use-query-candidates";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CandidateDetailsDialog } from "./candidate-documents-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type FiltersState = {
  academicYearId: string;
  degreeId: string;
  faculdadeId: string;
  courseId: string;
  candidateStatus: typeof PostGraduationCandidateStatus[keyof typeof PostGraduationCandidateStatus];
  paymentStatus: typeof PostGraduationPaymentStatus[keyof typeof PostGraduationPaymentStatus];
};
const initialFilters: FiltersState = {
  academicYearId: "",
  degreeId: "2",
  courseId: "",
  faculdadeId: "",
  candidateStatus: PostGraduationCandidateStatus.TODOS,
  paymentStatus: PostGraduationPaymentStatus.PAGO,

};

export function RegisteredCandidates() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [limit, setLimit] = useState(10);


  const [selectedCandidate, setSelectedCandidate] =
    useState<PosGraduationCandidate | null>(null)
  const [openDocuments, setOpenDocuments] =
    useState(false);
  const { data: candidatesResponse, isFetching: isFetchingCandidates, refetch: refetchCandidates, isLoading: isLoadingCandidates } = useQueryCandidatesPosGraduation({
    codigoTipoCandidatura: parseFilter(filters.degreeId),
    codigoAnoLectivo: parseFilter(filters.academicYearId),
    codigoCurso: parseFilter(filters.courseId),
    estado: filters.candidateStatus,
    pagamento: filters.paymentStatus,
    page: currentPage,
    limit: limit,
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.academicYearId,
    filters.degreeId,
    filters.faculdadeId,
    filters.courseId,
    filters.candidateStatus,
    filters.paymentStatus,
  ]);

  function handleFilterChange(
    field: keyof FiltersState,
    value: string,
  ) {
    setFilters((current) => {
      if (field === "academicYearId") {
        return {
          ...current,
          academicYearId: value,
          faculdadeId: "",
          courseId: "",
        };
      }
      if (field === "degreeId") {
        return {
          ...current,
          degreeId: value,
          academicYearId: "",
          faculdadeId: "",
          courseId: "",
        };
      }

      if (field === "faculdadeId") {
        return {
          ...current,
          faculdadeId: value,
          courseId: "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });

    setCurrentPage(1);
  }


  const candidates = candidatesResponse?.data ?? [];

  const total = candidatesResponse?.total ?? 0;
  const totalPages = candidatesResponse?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidatos inscritos"
        subtitle="Pos-Graduacao"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isFetchingCandidates}
              onClick={() => refetchCandidates()}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetchingCandidates ? "animate-spin" : ""
                  }`}
              />
              Atualizar
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              setFilters(initialFilters);
              setCurrentPage(1);
            }}>
              Limpar filtros

            </Button>
            {/* <Select
              value={String(limit)}
              onValueChange={(v) => {
                setLimit(Number(v));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        }
      />
      < Card >
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TipoCandidaturaSelect
              label="Grau Acadêmico"
              value={filters.degreeId}
              isPostGraduation
              onChangeValue={(value) => handleFilterChange("degreeId", value)}
            />
            <AcademicYearsAvailableForOperationSelect
              label="Ano Lectivo"
              enableDefaultActiveYear
              enableDefaultSelectItem
              onlyConfigurable={false}
              disabled={!filters.degreeId}
              tipoCandidaturaId={parseFilter(filters.degreeId) ?? 2}
              value={filters.academicYearId}
              onChangeValue={(value) => handleFilterChange("academicYearId", value)}
            />
            <FacultySelect
              value={filters.faculdadeId}
              onChangeValue={(value) => handleFilterChange("faculdadeId", value)}
              allOption
            />
            <CourseSelect
              label="Curso"
              value={filters.courseId}
              disabled={!filters.degreeId}
              placeholder="Selecione o curso"
              params={{
                tipoCandidaturaId: parseFilter(filters.degreeId),
                faculdadeId: parseFilter(filters.faculdadeId),
              }}
              onChangeValue={(value) => handleFilterChange("courseId", value)}
            />
            <FormSelect
              label="Estado"
              value={filters.candidateStatus}
              onChange={(value) => handleFilterChange("candidateStatus", value)}
              map={(e) => ({ key: e.value, value: e.value, label: e.label })}
              options={candidateStatus}
            />
            <FormSelect
              label="Pagamento"
              map={(e) => ({ key: e.value, value: e.value, label: e.label })}
              value={filters.paymentStatus}
              onChange={(value) => handleFilterChange("paymentStatus", value)}
              options={paymentStatus}
            />
          </div>
        </CardContent>
      </Card >
      <div className="overflow-x-auto rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Inscrição</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Natureza</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Ano Lectivo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Inscrição Paga</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoadingCandidates || isFetchingCandidates ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Carregando candidatos...
                  </div>
                </TableCell>
              </TableRow>
            ) : candidates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum candidato encontrado.
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((candidate) => (
                <TableRow key={candidate.codigo_preinscricao}>
                  <TableCell>
                    {candidate.codigo_preinscricao}
                  </TableCell>

                  <TableCell className="font-medium">
                    {candidate.nome_completo}
                  </TableCell>

                  <TableCell>
                    {candidate.contactos_telefonicos}
                  </TableCell>

                  <TableCell>
                    {candidate.sexo}
                  </TableCell>

                  <TableCell>
                    {candidate.candidatura}
                  </TableCell>

                  <TableCell className="max-w-xs truncate">
                    {candidate.curso_candidatura}
                  </TableCell>

                  <TableCell>
                    {candidate.ano_lectivo}
                  </TableCell>

                  <TableCell>
                    {candidate.data ? new Date(candidate.data).toLocaleDateString("pt-AO") : "-"}
                  </TableCell>

                  <TableCell>
                    <span className={cn(candidate.estado === "Admitido" && "text-green-600", candidate.estado === "Rejeitado" && "text-red-600", candidate.estado === "Pendente" && "text-yellow-600")}>
                      {candidate.estado}
                    </span>
                  </TableCell>

                  <TableCell>
                    {candidate.pagamento_realizado ? (
                      <span className="text-green-600">
                        Pago
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Não Pago
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label="Ver detalhes do candidato"
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setOpenDocuments(true);
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Detalhes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {
        totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {candidates.length} de {total} registos
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Próxima
              </Button>

              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      }
      <CandidateDetailsDialog
        open={openDocuments}
        onOpenChange={setOpenDocuments}
        candidate={selectedCandidate}
      />
    </div >
  );
}

const paymentStatus = [
  { value: PostGraduationPaymentStatus.TODOS, label: "Todos" },
  { value: PostGraduationPaymentStatus.PAGO, label: "Pago" },
  { value: PostGraduationPaymentStatus.NAO_PAGO, label: "Não Pago" },
];

const candidateStatus = [
  { value: PostGraduationCandidateStatus.TODOS, label: "Todos" },
  { value: PostGraduationCandidateStatus.ADMITIDO, label: "Admitido" },
  { value: PostGraduationCandidateStatus.PENDENTE, label: "Pendente" },
  { value: PostGraduationCandidateStatus.REJEITADO, label: "Rejeitado" },

];
