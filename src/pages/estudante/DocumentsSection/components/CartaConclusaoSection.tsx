import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useStudentClassInfo } from "@/hooks/students/use-query-students-class-info";
import { useGenerateDocumentCode } from "@/hooks/documents/use-generate-code";
import GerarCartaConclusao from "@/components/views/docs-students/GerarCartaConclusao";


type Props = {
    codigoMatricula: number;
};

export function CartaConclusaoSection({ codigoMatricula }: Props) {

    const [codigoValidacao, setCodigoValidacao] = useState<string | null>(null);



    const { data: studentClassInfo, isLoading: isLoadingClassInfo } =
        useStudentClassInfo(
            {
                numeroDeMatricula: codigoMatricula,
            },
            !!codigoMatricula
        );
    const podeGerarCarta =
        studentClassInfo?.data_conclusao &&
        studentClassInfo?.nota_obtida;
    const { mutate: gerarCodigo, isPending: isGeneratingCode } = useGenerateDocumentCode();

    const dadosProntos = !isLoadingClassInfo && !!studentClassInfo;

    const handleExportar = (onReady: (codigo: string) => void) => {
        gerarCodigo(
            {
                codigoMatricula: codigoMatricula,
                tipoDocumento: 8,

                documento: "Carta de Conclusão",

                status: "Ativo",
            },
            {
                onSuccess: (data) => {
                    setCodigoValidacao(data.codigo);
                    onReady(data.codigo);
                },
            }
        );
    };
    return (
        <div className="space-y-8">
            {/* Cabeçalho Interno */}
            <div className="border-b pb-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Gerar Carta de Conclusão
                </h2>

            </div>

            {/* Toolbar: Select + Botão em Linha */}
            <div className="flex flex-col sm:flex-row items-end gap-4 bg-muted/30 p-4 rounded-xl border border-dashed">


                {codigoMatricula && (
                    isLoadingClassInfo ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2 rounded-lg border bg-background">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            A carregar dados...
                        </div>
                    ) : dadosProntos ? (
                        podeGerarCarta ? (
                            <GerarCartaConclusao
                                dados={studentClassInfo}
                                cargoDiretor="Directora dos Serviços Académicos"
                                nomeDiretor="Margarida da Silva Rodrigues"
                                codigo_validacao={codigoValidacao ?? ""}
                                showDownload={true}
                                logoSrc="/logo_uma.png"
                                bgSrc="/logo_bg.png"
                                borduraSrc="/bordura_africana.png"
                                isGeneratingCode={isGeneratingCode}
                                onBeforeDownload={handleExportar}
                            />
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-destructive px-4 py-2 rounded-lg border border-destructive/30 bg-destructive/5">
                                Não é possível gerar a carta: falta data de conclusão ou nota final.
                            </div>
                        )
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-destructive px-4 py-2 rounded-lg border border-destructive/30 bg-destructive/5">
                            Não foi possível carregar os dados do estudante.
                        </div>
                    )
                )}
            </div>



        </div>
    );
}