import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { TypeServiceSelectList } from "@/components/common/global-selects/TypeServiceSelectList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseFilter } from "@/util/parse-filter";
import { Calendar, Eye, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryFinanceMonthlyFee } from "@/hooks/financas/isencao-servico/use-query-finance-monthly-fee";
import { InvoiceStatusBadge } from "@/components/common/Invoice-status-badge";
import { InvoiceEnum } from "@/enums/invoice.enum";
import { EnrollmentStudentSelect } from "@/components/common/global-selects/EnrollmentStudentSelect";
import { useMutationCreateIsencaoMensalidade } from "@/hooks/financas/isencao-servico/use-mutation-create-isencao-mensalidade";
type CreateIsencaoServicoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
type CreateIsencaoResponseError = {
  mesTempId: number;
  error: string;
};
type MesTemp = {
  mesTempId: number;
  servicoId: number;
};
export function CreateIsencaoMesDialog({
  open,
  onOpenChange,
}: CreateIsencaoServicoDialogProps) {
  const [filters, setFilters] = useState({
    matricula: null,
    anoLectivo: "",
    faculdade: "",
    curso: "",
  });

  const [selectedMesTemp, setSelectedMesTemp] = useState<MesTemp[]>([]);
  const [successMesTemp, setSuccessMesTemp] = useState<number[]>([]);
  const [errorMesTemp, setErrorMesTemp] = useState<
    CreateIsencaoResponseError[]
  >([]);
  const { mutateAsync, isPending } = useMutationCreateIsencaoMensalidade();
  const { toast } = useToast();

  const toggleStudent = ({ mesTempId, servicoId }: MesTemp) => {
    setSelectedMesTemp((prev) =>
      prev.some((item) => item.mesTempId === mesTempId)
        ? prev.filter((item) => item.mesTempId !== mesTempId)
        : [...prev, { mesTempId, servicoId }],
    );
  };
  const isExceptionChecked = (mesTempId: number) =>
    selectedMesTemp.some((item) => item.mesTempId === mesTempId);
  const getRowStyle = (codigo: number) => {
    if (successMesTemp.includes(codigo)) {
      return "bg-emerald-100 dark:bg-emerald-700";
    }

    if (errorMesTemp.some((e) => e.mesTempId === codigo)) {
      return "bg-destructive/70";
    }

    if (selectedMesTemp.some((item) => item.mesTempId === codigo)) {
      return "bg-muted";
    }

    return "";
  };
  const getError = (codigo: number) => {
    const error = errorMesTemp.find((e) => e.mesTempId === codigo).error;
    toast({
      title: "Erro",
      description: error,
      variant: "destructive",
    });
  };
  const { data: monthResponse, isLoading: isMonthLoading } =
    useQueryFinanceMonthlyFee({
      academicYear: filters.anoLectivo,
      enrollmentCode: filters.matricula,
      status: undefined,
      limit: 100,
      page: 1,
    });

  const handleSubmit = async () => {
    setErrorMesTemp([]);
    setSuccessMesTemp([]);

    await mutateAsync(
      {
        codigoMatricula: parseFilter(filters.matricula),
        mesTemps: selectedMesTemp,
        codigoAnoLectivo: parseFilter(filters.anoLectivo),
        codigoPreInscricao: null,
      },
      {
        onSuccess(response) {
          const sucessos = response?.sucessos ?? [];
          const erros = response?.erros ?? [];
          setErrorMesTemp(erros);
          setSuccessMesTemp(sucessos);
          setSelectedMesTemp([]);
        },
      },
    );
  };

  const disabledIsencaoButton = isPending || selectedMesTemp.length == 0;
  const temErros = errorMesTemp.length > 0;
  const months = monthResponse?.data ?? [];
  const hasMesTempError = (mesTempId) =>
    errorMesTemp.some((e) => e.mesTempId === mesTempId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl!">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Calendar />
            <DialogTitle>Criar Nova Isenção de Mensalidade</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          <AcademicYearSelect
            value={filters.anoLectivo}
            onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
          />
          <FacultySelect
            value={filters.faculdade}
            onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
          />
          <CourseSelect
            params={{
              faculdadeId: parseFilter(filters.faculdade),
            }}
            value={filters.curso}
            onChangeValue={(v) => setFilters({ ...filters, curso: v })}
          />
          <EnrollmentStudentSelect
            anoLectivo={parseFilter(filters.anoLectivo)}
            codigoCurso={parseFilter(filters.curso)}
            value={filters.matricula}
            onChangeValue={(v) => setFilters({ ...filters, matricula: v })}
          />
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            Meses
          </h3>
          <div className="h-[400px] overflow-y-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Código de Matricula</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Mes</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  {temErros && <TableHead>Erros</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isMonthLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : months?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  months?.map((month) => {
                    const invoiceStatus = parseFilter(month?.estado_fatura);
                    const isInvoicePending =
                      invoiceStatus == InvoiceEnum.PENDENTE;
                    return (
                      <TableRow
                        className={getRowStyle(month.mes_temp_id)}
                        key={month.id_item}
                      >
                        <TableCell>
                          <Checkbox
                            disabled={!isInvoicePending}
                            checked={isExceptionChecked(month.mes_temp_id)}
                            onCheckedChange={() =>
                              toggleStudent({
                                mesTempId: month.mes_temp_id,
                                servicoId: month.id_tipo_servico,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell>{month?.codigo_matricula ?? "-"}</TableCell>
                        <TableCell>{month?.codigo_factura ?? "-"}</TableCell>
                        <TableCell>{month?.mes ?? "-"}</TableCell>
                        <TableCell>{month?.descricao_servico ?? "-"}</TableCell>
                        <TableCell>{month?.semestre ?? "-"}</TableCell>
                        <TableCell>{month?.total_preco ?? "-"}</TableCell>
                        <TableCell>
                          <InvoiceStatusBadge status={invoiceStatus} />
                        </TableCell>
                        {temErros && (
                          <TableCell>
                            {hasMesTempError(month.mes_temp_id) && (
                              <Button
                                onClick={() => getError(month.mes_temp_id)}
                                variant="outline"
                                size="icon"
                              >
                                <Eye />
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={disabledIsencaoButton}
          >
            {isPending && <RefreshCw className={`h-4 w-4 mr-2 animate-spin`} />}
            Isentar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
