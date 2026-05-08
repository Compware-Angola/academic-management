import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useStudentClassInfo } from "@/hooks/students/use-query-students-class-info";

type Props = {
    codigoMatricula: number;
};

export function MensalidadesSection({ codigoMatricula }: Props) {

    const { data: studentClassInfo, isLoading: isLoadingClassInfo } =
        useStudentClassInfo(
            {
                numeroDeMatricula: codigoMatricula,
            },
            !!codigoMatricula
        );

    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="border-b pb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Mensalidades
                </h2>
                <p className="text-muted-foreground mt-1">
                    Histórico de pagamentos, mensalidades pendentes e recibos
                </p>
            </div>

            {/* Área de Conteúdo */}
            <div className="flex flex-col sm:flex-row items-start gap-4 bg-muted/30 p-6 rounded-xl border">
                {codigoMatricula && (
                    isLoadingClassInfo ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            A carregar informações do aluno...
                        </div>
                    ) : studentClassInfo ? (
                        <div className="w-full">
                            {/* Aqui vai o conteúdo real das mensalidades */}
                            <p className="text-muted-foreground">
                                Componente de mensalidades em desenvolvimento.
                            </p>
                            {/* 
                Futuramente colocar aqui:
                - Tabela de mensalidades
                - Valores pendentes
                - Histórico de pagamentos
                - Botão para gerar recibo, etc.
              */}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-destructive px-4 py-3 rounded-lg border border-destructive/30 bg-destructive/5">
                            Não foi possível carregar os dados do estudante.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}