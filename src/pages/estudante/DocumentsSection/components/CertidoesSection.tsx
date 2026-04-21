import { useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import GerarCertidao from "@/components/views/docs-students/GerarCertidao";
import { useStudentClassInfo } from "@/hooks/students/use-query-students-class-info";


type Props = {
    codigoMatricula: number;
};

export function CertidoesSection({ codigoMatricula }: Props) {
    const [anoLectivo, setAnoLectivo] = useState<string>("");

    const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
        useQueryAnoAcademico();

    const { data: studentClassInfo, isLoading: isLoadingClassInfo } = useStudentClassInfo({
        numeroDeMatricula: codigoMatricula,
        anoLectivo: anoLectivo ? Number(anoLectivo) : undefined,
    });

    const dadosProntos = !isLoadingClassInfo && !!studentClassInfo;

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

                {/* Botão — só aparece quando ano lectivo selecionado */}
                {anoLectivo && (
                    isLoadingClassInfo ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-lg border bg-background">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            A carregar dados...
                        </div>
                    ) : dadosProntos ? (
                        <GerarCertidao
                            dados={studentClassInfo}
                             cargoDiretor="Directora dos Serviços Académicos"
                             nomeDiretor="Margarida da Silva Rodrigues"  
                             codigo_validacao={"1111"}   
                            showDownload={true}
                            logoSrc="/logo_uma.png"
                            bgSrc="/logo_bg.png"
                            borduraSrc="/bordura_africana.png"
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-destructive px-4 py-2 rounded-lg border border-destructive/30 bg-destructive/5">
                            Não foi possível carregar os dados do estudante.
                        </div>
                    )
                )}
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