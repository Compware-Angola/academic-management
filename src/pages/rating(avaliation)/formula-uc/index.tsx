import { useMemo, useState } from "react";

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

import { ChevronLeft, ChevronRight, RefreshCw, Shield } from "lucide-react";

import { Legend } from "./legend";
import { ModalFormulaUC, FormulaUC as FormulaUCType } from "./modal-formulaUC";

import { useQueryFormulaUC } from "@/hooks/avaliacao/use-queries-formula-uc";
import { FormSelect } from "@/components/common/FormSelect";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { Link } from "react-router-dom";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
import { useAcademicYears } from "@/hooks/academiccalendar/use-query-academic-years";

export default function FormulaUC() {
  // ===========================
  // STATES
  // ===========================
  const [formData, setFormData] = useState({
    tipoCandidatura: "",
    anoLetivo: "",
    semestre: "",

    curso: "",

    classes: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedFormula, setSelectedFormula] = useState<FormulaUCType | null>(
    null,
  );

  const [openModal, setOpenModal] = useState(false);
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: academicYearResponse } = useAcademicYears({
    tipoCandidatura: parseFilter(formData.tipoCandidatura) ?? 0,
    
  });
  const academicYear = academicYearResponse?.data ?? [];

  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });

  const {
    data: formulaUC = [],
    isLoading,
    refetch,
  } = useQueryFormulaUC({
    anoCurricular: formData.classes ? Number(formData.classes) : undefined,
    semestre: formData.semestre ? Number(formData.semestre) : undefined,
    anoLectivoId: formData.anoLetivo ? Number(formData.anoLetivo) : undefined,
    cursoId: formData.curso ? Number(formData.curso) : undefined,
    tipoCandidatura: formData.tipoCandidatura
      ? Number(formData.tipoCandidatura)
      : undefined,
  });

  // ─── Preparação dos dados para PDF ────────────────────────────────────────
  const pdfData = useMemo(() => {
    if (!formulaUC.length) return null;

    const rows = formulaUC.map((item) => ({
      codigo: item.codigo,
      disciplina: item.disciplina,
      notaMinPratica: item.notaMinPratica ?? "—",
      notaMin1F: item.notaMinPrimeiraFreq ?? "—",
      notaMin2F: item.notaMinSegundaFreq ?? "—",
      pesoPratica: item.pesoPratica ?? "—",
      peso1F: item.pesoPrimeiraFreq ?? "—",
      peso2F: item.pesoSegundaFreq ?? "—",
      definido_por: item.definido_por ?? "—",
    }));

    const cursoNome =
      cursos?.find((c) => c.codigo === Number(formData.curso))?.designacao ||
      "—";
    const anoLetivoNome =
      academicYear.find((a) => a.codigo === Number(formData.anoLetivo))
        ?.designacao || "—";
    const semestreNome =
      semestres?.find((s) => s.codigo === Number(formData.semestre))
        ?.designacao || "—";
    const anoCurricularNome =
      classes.find((cl) => cl.codigo === Number(formData.classes))
        ?.designacao || "—";

    const filtrosTexto = [
      `Ano Letivo: ${anoLetivoNome}`,
      `Semestre: ${semestreNome}`,
      `Curso: ${cursoNome}`,
      `Ano Curricular: ${anoCurricularNome}`,
    ]
      .filter(Boolean)
      .join("  |  ");

    return {
      rows,
      filtros: filtrosTexto || "Nenhum filtro aplicado",
      totalRegistros: formulaUC.length,
    };
  }, [formulaUC, formData, academicYear, semestres, cursos, classes]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Fórmulas das Unidades Curriculares"
      subtitle="Parâmetros de avaliação por disciplina"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros,
        },
        {
          title: "Resumo",
          content: [
            `Total de Unidades Curriculares: ${pdfData.totalRegistros}`,
          ],
        },
      ]}
      mainTable={{
        headers: [
          { key: "codigo", label: "Código", width: "8%", align: "center" },
          { key: "disciplina", label: "Disciplina", width: "32%" },
          {
            key: "notaMinPratica",
            label: "NM P",
            width: "8%",
            align: "center",
          },
          {
            key: "notaMin1F",
            label: "NM 1ª Freq",
            width: "8%",
            align: "center",
          },
          {
            key: "notaMin2F",
            label: "NM 2ª Freq",
            width: "8%",
            align: "center",
          },
          {
            key: "pesoPratica",
            label: "Peso Prát.",
            width: "8%",
            align: "center",
          },
          {
            key: "peso1F",
            label: "Peso 1ª Freq",
            width: "8%",
            align: "center",
          },
          {
            key: "peso2F",
            label: "Peso 2ª Freq",
            width: "8%",
            align: "center",
          },
          { key: "definido_por", label: "Definido por", width: "12%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48", // azul escuro (mesmo da outra tela)
      }}
      footerNotice="Parâmetros de avaliação sujeitos a regulamento académico da instituição."
      customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
    />
  ) : null;

  // Paginação
  const totalPages = Math.ceil(formulaUC.length / itemsPerPage);
  const paginatedData = formulaUC.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="text-foreground">Controle de Lançamento</span>
      </nav>

      {/* ===========================
           HEADER
      =========================== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Fórmula das Unidades Curriculares
          </h1>
          <p className="text-muted-foreground">
            Fórmula das Unidades Curriculares
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => refetch()}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          {formulaUC.length > 0 && pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`Formula_UC_${formData.curso || "curso"}_${new Date().toISOString().slice(0, 10)}.pdf`}
              showDownload={true}
              showPrint={true}
            />
          )}
        </div>
      </div>

      {/* ===========================
            FILTROS
      =========================== */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TipoCandidaturaSelect
            value={formData.tipoCandidatura}
            onChangeValue={(v) =>
              setFormData({
                ...formData,
                tipoCandidatura: v,
                anoLetivo: "",
                curso: "",
                classes: "",
              })
            }
          />

          <AcademicYearsAvailableForOperationSelect
            label="Ano Letivo"
            value={formData.anoLetivo}
            onChangeValue={(v) => setFormData({ ...formData, anoLetivo: v })}
            tipoCandidaturaId={parseFilter(formData.tipoCandidatura) ?? 0}
            enableDefaultActiveYear
            disabled={!formData.tipoCandidatura}
            onlyConfigurable={false}
          />

          {/* SEMESTRE */}
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
              value: s.codigo,
            })}
          />
          <CourseSelect
            value={formData.curso}
            onChangeValue={(v) =>
              setFormData({ ...formData, curso: v, classes: "" })
            }
            params={{
              tipoCandidaturaId: parseFilter(formData.tipoCandidatura),
            }}
            disabled={!formData.tipoCandidatura}
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
              value: c.codigo,
            })}
            loading={isLoadingClasses}
          />
        </div>
      </div>
      {/* =====================
            LEGENDA
      =====================*/}
      <Legend
        items={[
          { sigla: "NM P", descricao: "Nota mínima da Prática" },
          { sigla: "NM 1F", descricao: "Nota mínima da 1ª Frequência" },
          { sigla: "NM 2F", descricao: "Nota mínima da 2ª Frequência" },
          { sigla: "P P", descricao: "Peso da Prática" },
          { sigla: "P 1F", descricao: "Peso da 1ª Frequência" },
          { sigla: "P 2F", descricao: "Peso da 2ª Frequência" },
        ]}
      />

      {/* =====================
            TABLE
      =====================*/}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <Shield
            className="h-12 w-12 mx-auto
                       text-muted-foreground mb-4"
          />
          <p className="text-lg">Nenhum registro encontrado</p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Disciplina</TableHead>

                <TableHead className="text-center">NM P</TableHead>

                <TableHead className="text-center">NM 1F</TableHead>

                <TableHead className="text-center">NM 2F</TableHead>

                <TableHead className="text-center">P P</TableHead>

                <TableHead className="text-center">P 1F</TableHead>

                <TableHead className="text-center">P 2F</TableHead>
                <TableHead className="text-center">Definido Por </TableHead>

                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.codigo}>
                  <TableCell>{item.codigo}</TableCell>

                  <TableCell className="font-medium">
                    {item.disciplina}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.notaMinPratica ?? "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.notaMinPrimeiraFreq ?? "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.notaMinSegundaFreq ?? "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.pesoPratica ?? "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.pesoPrimeiraFreq ?? "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    {item.pesoSegundaFreq ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.definido_por ?? "-"}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedFormula(item);
                        setOpenModal(true);
                      }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* =====================
          PAGINAÇÃO
      =====================*/}
      <div className="flex justify-end gap-3 items-center">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* =====================
           MODAL
      =====================*/}
      <ModalFormulaUC
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedFormula}
      />
    </div>
  );
}
