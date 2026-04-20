import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, CalendarDays, } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { PDFDownloadLink } from "@react-pdf/renderer";
import GerarCertidao from "@/components/views/docs-students/GerarCertidao";
import { useStudentDetail } from "@/hooks/students/use-query-students";
type Props = {
  codigoMatricula: number;
};

export function CertidoesSection({ codigoMatricula }: Props)  {
      const { data: student, isLoading } = useStudentDetail(codigoMatricula);
    const [anoLectivo, setAnoLectivo] = useState<string>("");
    const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
        useQueryAnoAcademico();
    return (
        <div className="space-y-8">
            {/* Cabeçalho Interno */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Emissão de Certidões
                </h2>
                <p className="text-sm text-muted-foreground">
                    Selecione o ano lectivo para gerar o documento oficial.
                </p>
            </div>

            {/* Toolbar: Select + Botão em Linha */}
            <div className="flex flex-col sm:flex-row items-end gap-4 bg-muted/30 p-4 rounded-xl border border-dashed">
                <div className="grid w-full sm:flex-1 gap-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                        <CalendarDays className="h-3 w-3" />
                        Ano Lectivo
                    </label>
                    <FormSelect

                        disabled={isLoadingAcademicYear}
                        loading={isLoadingAcademicYear}
                        value={anoLectivo ?? ""}
                        onChange={(v) => setAnoLectivo(v)}
                        options={anosAcademicos}
                        map={(a) => ({
                            key: a.codigo,
                            label: a.designacao,
                            value: a.codigo,
                        })}
                    />
                </div>

            
                <GerarCertidao
  dados={student}
  logoSrc="/logo_uma.png"
  bgSrc="/logo_bg.png"
  borduraSrc="/bordura_africana.png"
/>
            </div>

            {/* Info de Ajuda */}
            {!anoLectivo && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    Aguardando seleção do ano lectivo para processar o documento.
                </div>
            )}
        </div>
    );
}