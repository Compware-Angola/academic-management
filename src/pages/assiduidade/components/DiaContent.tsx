import { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import { ReactElement, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventoRow } from "@/util/types";
import { useQueryGeneralAttendanceCalendar } from "@/hooks/assiduidade/use-query-general-attendance-calendar";

type Props = {
  canFetch: boolean;
  docenteId: string;
  docenteNome: string;
  dataReferencia: string;
  docenteLabel: string;
  setPdfContent: (value: ReactElement | null) => void;
  setExcelProps: (value: any | null) => void;
  setBaseFileName: (value: string) => void;
};

type Estado = 1 | 2 | 3;

function EstadoBadge({ estado }: { estado: Estado }) {
  const map = {
    1: { label: "Pendente", className: "bg-amber-500/10 text-amber-700 border-amber-500/30" },
    2: { label: "Falta", className: "bg-red-500/10 text-red-700 border-red-500/30" },
    3: { label: "Presença", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" },
  } as const;

  const info = map[estado] ?? { label: "—", className: "" };

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded border text-xs", info.className)}>
      {info.label}
    </span>
  );
}

export default function DiaContent({
  canFetch,
  docenteId,
  docenteNome,
  dataReferencia,
  docenteLabel,
  setPdfContent,
  setExcelProps,
  setBaseFileName,
}: Props) {
  const docenteIdNum = docenteId ? Number(docenteId) : undefined;

  const { data, isLoading, isError } = useQueryGeneralAttendanceCalendar(
    {
      modo: "DIA",
      dataReferencia,
      docenteId: docenteIdNum,
      docenteNome: docenteIdNum ? undefined : docenteNome || undefined,
    },
    { enabled: canFetch }
  );

  const rows = (data && data.modo !== "MES" ? data.data : []) as EventoRow[];

  const exportRows = useMemo(
    () =>
      rows.map((r) => ({
        codigo: r.codigo,
        hora: `${r.hora_inicio} → ${r.hora_fim}`,
        ordem: r.ordem_tempo ?? "—",
        estado:
          r.estado === 1
            ? "Pendente"
            : r.estado === 2
              ? "Falta"
              : r.estado === 3
                ? "Presença"
                : "—",
      })),
    [rows]
  );

  const pdfContentLocal =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Controle Geral de Assiduidade por Docente"
        subtitle="Visão Diária"
        infoSections={[
          { title: "Docente", content: docenteLabel || "—" },
          { title: "Data de Referência", content: dataReferencia || "—" },
          { title: "Resumo", content: [`Total de aulas: ${exportRows.length}`] },
        ]}
        mainTable={{
          headers: [
            { key: "codigo", label: "Código", width: "20%" },
            { key: "hora", label: "Hora", width: "35%" },
            { key: "ordem", label: "Ordem", width: "20%" },
            { key: "estado", label: "Estado", width: "25%" },
          ],
          rows: exportRows,
          headerBackground: "#0D1B48",
        }}
        footerNotice="Documento gerado automaticamente pelo sistema."
      />
    ) : null;

  const excelPropsLocal =
    exportRows.length > 0
      ? {
        documentTitle: "Controle Geral de Assiduidade por Docente",
        subtitle: "Visão Diária",
        infoSections: [
          { title: "Docente", content: docenteLabel || "—" },
          { title: "Data de Referência", content: dataReferencia || "—" },
          { title: "Resumo", content: [`Total de aulas: ${exportRows.length}`] },
        ],
        mainTable: {
          headers: [
            { key: "codigo", label: "Código", width: 15 },
            { key: "hora", label: "Hora", width: 30 },
            { key: "ordem", label: "Ordem", width: 15 },
            { key: "estado", label: "Estado", width: 20 },
          ],
          rows: exportRows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
      : null;

  useEffect(() => {
    setPdfContent(pdfContentLocal);
    setExcelProps(excelPropsLocal);
    setBaseFileName(
      `controle_docente_dia_${dataReferencia}_${docenteId || "sem_docente"}`
    );

    return () => {
      setPdfContent(null);
      setExcelProps(null);
    };
  }, [
    pdfContentLocal,
    excelPropsLocal,
    dataReferencia,
    docenteId,
    setPdfContent,
    setExcelProps,
    setBaseFileName,
  ]);

  if (!canFetch) {
    return (
      <div className="text-center py-16 bg-muted/40 border rounded-lg">
        <p className="text-muted-foreground text-lg">Selecione um docente</p>
        <p className="text-sm mt-2">Para visualizar o dia.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-16 bg-muted/40 border rounded-lg">
        <p className="text-muted-foreground text-lg">Erro ao carregar</p>
        <p className="text-sm mt-2">Tente novamente.</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Docente: <span className="font-medium text-foreground">{docenteLabel}</span>
          </div>
          <Badge variant="outline">Dia</Badge>
        </div>

        <div className="text-center py-16 bg-muted/40 border rounded-lg">
          <p className="text-muted-foreground text-lg">Sem aulas neste dia</p>
          <p className="text-sm mt-2">Escolha outra data de referência.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Docente: <span className="font-medium text-foreground">{docenteLabel}</span>
        </div>
        <Badge variant="outline">Dia</Badge>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Código</TableHead>
                <TableHead className="w-36">Hora</TableHead>
                <TableHead className="w-24">Ordem</TableHead>
                <TableHead className="w-28">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.codigo} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{r.codigo}</TableCell>
                  <TableCell className="text-sm">
                    <span className="font-medium">{r.hora_inicio}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="font-medium">{r.hora_fim}</span>
                  </TableCell>
                  <TableCell className="text-sm">{r.ordem_tempo ?? "—"}</TableCell>
                  <TableCell>
                    <EstadoBadge estado={r.estado as Estado} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}