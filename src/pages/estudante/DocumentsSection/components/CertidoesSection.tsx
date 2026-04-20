import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, CalendarDays, } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CertidaoUMA } from "@/components/views/docs-students/GerarCertidao";

export function CertidoesSection() {
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

                <PDFDownloadLink
                    document={
                        <CertidaoUMA
                            nome="Paulo Jacob Camavo"
                            filho_de="Francisco Camavo Alfredo"
                            mae="Jandira Aulária António"
                            bi="005382568LA046"
                            num_estudante="42093"
                            ano_curso="5º"
                            curso="Engenharia Informática"
                            grau="Licenciatura"
                            turno="Diurno"
                            ano_lectivo={anoLectivo}
                            data_emissao="20 de Abril de 2026"
                            cod_validacao="23456FGGEF"
                            directora="Margarida da Silva Rodrigues"
                            cargo_directora="Directora dos Serviços Académicos"
                        />
                    }
                    fileName={`certidao-${anoLectivo}.pdf`}
                >
                    {({ loading }) => (
                        <Button disabled={!anoLectivo || loading}>
                            <Printer className="mr-2 h-4 w-4" />
                            {loading ? "Gerando..." : "Gerar Certidão"}
                        </Button>
                    )}
                </PDFDownloadLink>
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