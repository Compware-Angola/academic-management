import { axiosNestGa } from "@/lib/axios-nest-ga";
import { generateGenericExcel } from "@/components/views/excel/GenericExcelExport";
import {
  GetMarkingAssessmentPayload,
  MarkingAssessmentItem,
  getMarkingAssessmentService,
} from "./fetch-marking-assessment.service";

export type ExportMarkingAssessmentPayload = Omit<
  GetMarkingAssessmentPayload,
  "page" | "limit"
>;

export type ExportMarkingAssessmentResponse = {
  blob: Blob;
  fileName: string;
};

export async function exportMarkingAssessmentPdfService(
  payload: ExportMarkingAssessmentPayload,
): Promise<ExportMarkingAssessmentResponse> {
  const response = await axiosNestGa.get<Blob>(
    "/assessment/marcacoes-provas/export/pdf",
    {
      params: payload,
      responseType: "blob",
    },
  );

  const contentDisposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const fileNameMatch = contentDisposition?.match(
    /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i,
  );
  const fallbackFileName = `marcacoes-provas-${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;

  return {
    blob: response.data,
    fileName: fileNameMatch
      ? decodeURIComponent(fileNameMatch[1])
      : fallbackFileName,
  };
}

export async function exportMarkingAssessmentExcelService(
  payload: ExportMarkingAssessmentPayload,
  total: number,
): Promise<ExportMarkingAssessmentResponse> {
  const response = await getMarkingAssessmentService({
    ...payload,
    page: 1,
    limit: Math.max(total, 1),
  });

  const blob = await generateGenericExcel({
    documentTitle: "Marcação de Provas",
    subtitle: "Listagem de marcações de provas",
    mainTable: {
      headers: [
        { key: "curso", label: "Curso", width: 28 },
        { key: "disciplina", label: "Disciplina", width: 32 },
        { key: "anolectivo", label: "Ano Lectivo", width: 16 },
        { key: "classe", label: "Classe", width: 14 },
        { key: "horario", label: "Horário", width: 24 },
        { key: "periodo", label: "Período", width: 18 },
        { key: "tb_salas_designacao", label: "Sala", width: 18 },
        { key: "tcp_data_prova", label: "Data da Prova", width: 18 },
        { key: "duracaoprova", label: "Duração", width: 14 },
        { key: "tcp_hora_prova", label: "Hora da Prova", width: 18 },
        { key: "horatermino", label: "Hora de Término", width: 18 },
      ],
      rows: response.data.map(mapMarkingAssessmentExcelRow),
    },
    totals: [{ label: "Total de registos", value: response.total }],
  });

  return {
    blob,
    fileName: `marcacoes-provas-${new Date().toISOString().slice(0, 10)}.xlsx`,
  };
}

function mapMarkingAssessmentExcelRow(item: MarkingAssessmentItem) {
  return {
    curso: item.curso,
    disciplina: item.disciplina,
    anolectivo: item.anolectivo,
    classe: item.classe,
    horario: item.horario,
    periodo: item.periodo,
    tb_salas_designacao: item.tb_salas_designacao,
    tcp_data_prova: item.tcp_data_prova,
    duracaoprova: item.duracaoprova,
    tcp_hora_prova: item.tcp_hora_prova,
    horatermino: item.horatermino,
  };
}
