import { useMemo, useState } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/common/FormInput";
import { TabsContent } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { useQueryResultPlan } from "@/hooks/students/use-query-result-plan";
import { buildExport } from "@/components/common/exports/docExport";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

type Props = {
  codigoMatricula: number;
  value?: string;
};

export function StudentResultPlan({
  codigoMatricula,
  value = "plano-estudo",
}: Props) {
  const getRowStyle = (nota: number) => {
    if (nota) {
      return "bg-emerald-100 dark:bg-emerald-700";
    }
    return "bg-destructive/70";
  };

  const {
    data: planResponse,
    isLoading,
    isError,
  } = useQueryResultPlan(codigoMatricula);

  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const plans = planResponse?.grades ?? [];
  const totalGradesCurso = planResponse?.totalGradesCurso;
  const totalGradesAluno = planResponse?.totalGrasesAluno;

  const filteredPlans = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return plans;

    return plans.filter((plan) => {
      const resultado = plan.nota ? "concluido" : "";
      const ano = `${plan.codigo_classe} ano`;
      return (
        plan.disciplina.toLowerCase().includes(term) ||
        plan.semestre.toLowerCase().includes(term) ||
        plan.duracao.toLowerCase().includes(term) ||
        String(plan.nota).includes(term) ||
        String(plan.classe).includes(term) ||
        ano.includes(term) ||
        resultado.includes(term)
      );
    });
  }, [plans, search]);

  const exportData = useMemo(
    () =>
      buildExport({
        data: filteredPlans,
        title: "Resultados do Plano de Estudos",
        subtitle: "Lista de Plano de Estudos (s)",
        content: [`Total de Plano de Estudos (s): ${plans.length}`],
        headers: [
          { key: "ano", label: "Ano", pdfWidth: 30, excelWidth: 30 },
          { key: "semestre", label: "Semestre", pdfWidth: 30, excelWidth: 30 },
          {
            key: "disciplina",
            label: "Disciplina",
            pdfWidth: 40,
            excelWidth: 40,
          },
          {
            key: "duracao",
            label: "Duração",
            pdfWidth: 40,
            excelWidth: 40,
          },
          {
            key: "nota",
            label: "Nota",
            pdfWidth: 40,
            excelWidth: 40,
          },
          {
            key: "resultado",
            label: "Resultado",
            pdfWidth: 40,
            excelWidth: 40,
          },
        ],

        mapRow: (plan) => ({
          ano: plan.classe,
          disciplina: plan.disciplina,
          semestre: plan.semestre,
          nota: plan.nota,
          duracao: plan.duracao,
          resultado: plan.nota ? "Concluido" : "",
        }),
      }),
    [filteredPlans],
  );
  const enabledExportPdf =
    exportData?.excelProps && exportData?.excelProps && exportData?.fileName;
  if (!codigoMatricula) {
    return <div>Matrícula inválida</div>;
  }
  return (
    <TabsContent value={value} className="space-y-4">
      <>
        <CardHeader>
          <CardTitle className="text-lg">
            Resultado do plano de Estudo
          </CardTitle>
          <CardDescription>
            <p className="text-xs mb-2 font-medium">
              {totalGradesAluno} Cadeiras concluidas em um total de {` `}
              {totalGradesCurso}
            </p>
            <div className="flex space-x-2">
              <div className="flex space-x-1 items-center">
                <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-700 rounded-full"></div>
                <span className="text-xs">U.Curricular concluídas</span>
              </div>
              <div className="flex space-x-1 items-center">
                <div className="w-4 h-4 bg-destructive/70 rounded-full"></div>
                <span className="text-xs"> U.Curricular não concluídas</span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-2 mb-2">
            {enabledExportPdf && (
              <div className="flex gap-2">
                <PDFActions
                  document={<GenericPDFDocument {...exportData?.pdfProps} />}
                  fileName={`${exportData.fileName}.pdf`}
                  showDownload
                  showPrint
                />
                <ExcelActions
                  excelProps={exportData?.excelProps}
                  fileName={`${exportData.fileName}.xlsx`}
                  showDownload
                />
              </div>
            )}

            <div className="ml-auto flex">
              <FormInput
                placeholder="Entra com uma pesquisa"
                value={searchValue}
                onValueChange={(v) => setSearchValue(v)}
                onDebounce={(v) => setSearch(v)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-destructive py-10">
              Erro ao carregar as disciplinas. Tente novamente.
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Nenhuma disciplina encontrada Para Este ano .
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ano</TableHead>
                      <TableHead className="text-center">Semestre</TableHead>
                      <TableHead className="text-center">Disciplina</TableHead>
                      <TableHead className="text-center">Duração</TableHead>
                      <TableHead className="text-center">Nota</TableHead>
                      <TableHead className="text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow
                        key={plan.codigo}
                        className={getRowStyle(plan.nota)}
                      >
                        <TableCell className="font-mono text-sm">
                          {plan.classe}
                        </TableCell>
                        <TableCell className="font-medium">
                          {plan.semestre}
                        </TableCell>
                        <TableCell className="text-center">
                          {plan.disciplina}
                        </TableCell>
                        <TableCell className="text-center">
                          {plan.duracao}
                        </TableCell>
                        <TableCell className="text-center font-medium text-sm ">
                          {plan.nota}
                        </TableCell>
                        <TableCell className="text-center text-sm ">
                          {plan.nota ? "Concluido" : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </>
    </TabsContent>
  );
}
