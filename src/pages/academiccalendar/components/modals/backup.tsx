import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryVacancies } from "@/hooks/queries/use-query-vacancies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosNestGa } from "@/lib/axios-nest-ga";
import { useAuth } from "@/hooks/use-auth";
import { AxiosError } from "axios";
import { useQueryGenerateMesTemp } from "@/hooks/academiccalendar/use-query-generate-mes-temp";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useMutationCreateMesTemp } from "@/hooks/academiccalendar/use-mutation-create-mes-temp";

// Memoiza o item da vaga para evitar re-renders desnecessários
const VagaItem = React.memo(
    ({
        vaga,
        index,
        onChange,
    }: {
        vaga: any;
        index: number;
        onChange: (index: number, newValue: number) => void;
    }) => {
        return (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/30 transition-colors">
                <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{vaga.cursoDescricao}</p>
                    <p className="text-sm text-muted-foreground truncate">
                        {vaga.periodoDescricao}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onChange(index, Math.max(0, vaga.numeroVagas - 1))}
                    >
                        -
                    </Button>
                    <Input
                        type="number"
                        value={vaga.numeroVagas}
                        onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            onChange(index, val);
                        }}
                        className="w-24 text-center"
                        min="0"
                    />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onChange(index, vaga.numeroVagas + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>
        );
    },
);

type Step = "periodos" | "vagas" | "mensalidades";

interface ParametersEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    anoLetivo?: string;
    onSuccess?: () => void;
}

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
    {
        id: "periodos",
        title: "Períodos Letivos",
        icon: <Calendar className="h-5 w-5" />,
    },
    {
        id: "vagas",
        title: "Vagas Disponíveis",
        icon: <Users className="h-5 w-5" />,
    },
    {
        id: "mensalidades",
        title: "Mensalidades",
        icon: <CreditCard className="h-5 w-5" />,
    },
];

export function ParametersEditModal({
    open,
    onOpenChange,
    anoLetivo,
    onSuccess,
}: ParametersEditModalProps) {
    const [currentStep, setCurrentStep] = useState<Step>("periodos");
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [periodosForm, setPeriodosForm] = useState({
        designacao: "",
        dataInicioPrimeiroSemestre: "",
        dataFimPrimeiroSemestre: "",
        dataInicioSegundoSemestre: "",
        dataFimSegundoSemestre: "",
    });

    const [anoInicioDefinido, setAnoInicioDefinido] = useState<
        number | undefined
    >(undefined);
    const [anoFimDefinido, setAnoFimDefinido] = useState<number | undefined>(
        undefined,
    );

    const [vagasEditadas, setVagasEditadas] = useState<any[]>([]);
    const [mensalidadesEditadas, setMensalidadesEditadas] = useState<any[]>([]);

    const { data: vagasOriginais, isLoading: loadingVagas } =
        useQueryVacancies();

    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    // Gera designação e define anos APENAS uma vez
    useEffect(() => {
        const inicio1 = periodosForm.dataInicioPrimeiroSemestre;
        const fim2 = periodosForm.dataFimSegundoSemestre;

        if (
            inicio1 &&
            fim2 &&
            anoInicioDefinido === undefined &&
            anoFimDefinido === undefined
        ) {
            const startYear = new Date(inicio1).getFullYear();
            const endYear = new Date(fim2).getFullYear();
            const finalYear = endYear >= startYear ? endYear : startYear + 1;

            setPeriodosForm((prev) => ({
                ...prev,
                designacao: `${startYear}-${finalYear}`,
            }));

            setAnoInicioDefinido(startYear);
            setAnoFimDefinido(finalYear);
        }
    }, [
        periodosForm.dataInicioPrimeiroSemestre,
        periodosForm.dataFimSegundoSemestre,
    ]);

    // Carrega vagas apenas quando necessário (evita loop)
    useEffect(() => {
        if (currentStep !== "vagas") return;
        if (vagasOriginais?.vagas.length === 0 || vagasEditadas.length > 0) return;

        setVagasEditadas(
            vagasOriginais?.vagas.map((v) => ({ ...v, numeroVagas: v.numeroVagas || 0 })),
        );
    }, [currentStep, vagasOriginais]);

    // Geração de meses (só quando anos definidos)
    const {
        data: mesesTemp,
        isLoading: loadingMeses,
        error: errorMeses,
    } = useQueryGenerateMesTemp(
        { anoInicial: anoInicioDefinido, anoFinal: anoFimDefinido },
        {
            enabled:
                !!anoInicioDefinido &&
                !!anoFimDefinido &&
                anoFimDefinido > anoInicioDefinido,
        },
    );

    // Atualiza mensalidades quando chegamos ao passo
    useEffect(() => {
        if (currentStep !== "mensalidades") return;
        if (!mesesTemp || mesesTemp.length === 0) return;

        const mapped = mesesTemp.map((item) => ({
            ...item,
            data_limite: item.data_limite || item.data_final || "",
        }));
        setMensalidadesEditadas(mapped);
    }, [currentStep, mesesTemp]);

    const isPeriodoValid = () => {
        return [
            periodosForm.dataInicioPrimeiroSemestre,
            periodosForm.dataFimPrimeiroSemestre,
            periodosForm.dataInicioSegundoSemestre,
            periodosForm.dataFimSegundoSemestre,
        ].every((field) => field.trim() !== "");
    };

    const { mutate: mutateMeses } = useMutationCreateMesTemp();

    const mutationTudo = useMutation({
        mutationFn: async () => {
            if (!isPeriodoValid()) throw new Error("Períodos incompletos");

            const periodoPayload = {
                designacao: periodosForm.designacao,
                data_inicio_primeiro_semestre: periodosForm.dataInicioPrimeiroSemestre,
                data_fim_primeiro_semestre: periodosForm.dataFimPrimeiroSemestre,
                data_inicio_segundo_semestre: periodosForm.dataInicioSegundoSemestre,
                data_fim_segundo_semestre: periodosForm.dataFimSegundoSemestre,
                codigo_utilizador: user.user?.pk_utilizador,
            };

            const periodoRes = await axiosNestGa.post(
                "/academic-calendar/academic-year",
                periodoPayload,
            );
            const codigoAnoLectivo = periodoRes.data.codigo;

            if (!codigoAnoLectivo)
                throw new Error("Código do ano letivo não retornado");

            const vagasPayload = {
                codigo_ano_lectivo: codigoAnoLectivo,
                codigo_utilizador: 16,
                vagas: vagasEditadas
                    .filter((v) => v.numeroVagas > 0)
                    .map((v) => ({
                        codigo_vaga: v.codigo_vaga || null,
                        codigo_periodo: v.codigo_periodo,
                        codigo_curso: v.codigoCurso,
                        polo_id: v.codigo_polo,
                        numero_vagas: v.numeroVagas,
                    })),
            };

            await axiosNestGa.post("/academic-calendar/vacancies", vagasPayload);

            if (mensalidadesEditadas.length > 0) {
                await new Promise((resolve, reject) => {
                    mutateMeses(
                        {
                            meses: mensalidadesEditadas.map((mes) => ({
                                designacao: mes.designacao,
                                isencao: mes.isencao,
                                ordem_mes: mes.ordem_mes,
                                ano_lectivo: codigoAnoLectivo,
                                prestacao: mes.prestacao,
                                activo: mes.activo ? 1 : 0,
                                activo_posgraduacao: mes.activo_posgraduacao ? 1 : 0,
                                data_limite: mes.data_limite || mes.data_final,
                                data_inicial: mes.data_inicial,
                                data_final: mes.data_final,
                                data_final_desconto: mes.data_final_desconto,
                                semestre: mes.semestre,
                                semestre_posgraduacao: mes.semestre_posgraduacao,
                            })),
                        },
                        { onSuccess: resolve, onError: reject },
                    );
                });
            }

            return { codigoAnoLectivo };
        },
        onSuccess: (data) => {
            toast({ title: "Parâmetros acadêmicos configurados com sucesso!" });
            queryClient.invalidateQueries({ queryKey: ["academic-year-params"] });
            queryClient.invalidateQueries({ queryKey: ["anosLetivos"] });
            queryClient.invalidateQueries({
                queryKey: ["generate-mes-temp", data.codigoAnoLectivo],
            });
            onSuccess?.();
            resetForm();
            onOpenChange(false);
        },
        onError: (error: AxiosError<{ msgresposta: string }>) => {
            toast({
                title: "Erro ao salvar parâmetros",
                description: error.response?.data?.msgresposta || "Tente novamente",
                variant: "destructive",
            });
        },
    });

    const resetForm = () => {
        setPeriodosForm({
            designacao: "",
            dataInicioPrimeiroSemestre: "",
            dataFimPrimeiroSemestre: "",
            dataInicioSegundoSemestre: "",
            dataFimSegundoSemestre: "",
        });
        setVagasEditadas([]);
        setMensalidadesEditadas([]);
        setAnoInicioDefinido(undefined);
        setAnoFimDefinido(undefined);
        setCurrentStep("periodos");
    };

    const handleNext = () => {
        if (currentStep === "periodos") {
            if (!isPeriodoValid()) {
                return toast({
                    title: "Preencha todas as datas dos semestres!",
                    variant: "destructive",
                });
            }

            const hoje = new Date();
            const anoAtual = hoje.getFullYear();
            const anoSeguinte = anoAtual + 1;

            const inicio1 = new Date(periodosForm.dataInicioPrimeiroSemestre);
            const fim1 = new Date(periodosForm.dataFimPrimeiroSemestre);
            const inicio2 = new Date(periodosForm.dataInicioSegundoSemestre);
            const fim2 = new Date(periodosForm.dataFimSegundoSemestre);

            const mesInicio1 = inicio1.getMonth() + 1;
            const mesFim1 = fim1.getMonth() + 1;
            const mesInicio2 = inicio2.getMonth() + 1;
            const mesFim2 = fim2.getMonth() + 1;

            const anoInicio1 = inicio1.getFullYear();
            const anoFim1 = fim1.getFullYear();
            const anoInicio2 = inicio2.getFullYear();
            const anoFim2 = fim2.getFullYear();

            if (mesInicio1 !== 10 || anoInicio1 !== anoAtual) {
                return toast({
                    title: "Data inválida",
                    description: `O 1º semestre deve iniciar em OUTUBRO de ${anoAtual}.`,
                    variant: "destructive",
                });
            }

            if (mesFim1 !== 2 || anoFim1 !== anoSeguinte) {
                return toast({
                    title: "Data inválida",
                    description: `O 1º semestre deve terminar em FEVEREIRO de ${anoSeguinte}.`,
                    variant: "destructive",
                });
            }

            if (mesInicio2 !== 3 || anoInicio2 !== anoSeguinte) {
                return toast({
                    title: "Data inválida",
                    description: `O 2º semestre deve iniciar em MARÇO de ${anoSeguinte}.`,
                    variant: "destructive",
                });
            }

            if (mesFim2 !== 7 || anoFim2 !== anoSeguinte) {
                return toast({
                    title: "Data inválida",
                    description: `O 2º semestre deve terminar em JULHO de ${anoSeguinte}.`,
                    variant: "destructive",
                });
            }
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].id);
        } else {
            mutationTudo.mutate();
        }
    };

    const handlePrev = () => {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) setCurrentStep(steps[prevIndex].id);
    };

    const handleClose = (isOpen: boolean) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
    };

    // Handler memoizado para mudança de vagas
    const handleVagaChange = useCallback((index: number, newValue: number) => {
        setVagasEditadas((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], numeroVagas: newValue };
            return updated;
        });
    }, []);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl! w-full max-h-[90vh]! overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Configurar Parâmetros Acadêmicos
                    </DialogTitle>
                    <DialogDescription>
                        Configure períodos e vagas. Tudo será salvo ao final.
                    </DialogDescription>
                </DialogHeader>

                {/* Progresso */}
                <div className="mt-6">
                    <Progress
                        value={((currentIndex + 1) / steps.length) * 100}
                        className="h-2 mb-6"
                    />
                    <div className="flex justify-between items-center mb-8">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className="flex flex-col items-center gap-2 flex-1 relative"
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${index <= currentIndex
                                        ? "bg-primary text-white"
                                        : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {index < currentIndex ? (
                                        <CheckCircle className="h-6 w-6" />
                                    ) : (
                                        step.icon
                                    )}
                                </div>
                                <span
                                    className={`text-xs font-medium text-center ${index <= currentIndex
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                        }`}
                                >
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`absolute top-6 left-12 right-0 h-1 -z-10 ${index < currentIndex ? "bg-primary" : "bg-muted"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="min-h-96">
                    {currentStep === "periodos" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Calendar className="h-5 w-5" /> Períodos Letivos
                            </h3>
                            <div className="space-y-2">
                                <Label>Designação (automática)</Label>
                                <Input
                                    value={periodosForm.designacao}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    "Início 1º Semestre",
                                    "Fim 1º Semestre",
                                    "Início 2º Semestre",
                                    "Fim 2º Semestre",
                                ].map((label, i) => {
                                    const keys = [
                                        "dataInicioPrimeiroSemestre",
                                        "dataFimPrimeiroSemestre",
                                        "dataInicioSegundoSemestre",
                                        "dataFimSegundoSemestre",
                                    ] as const;
                                    return (
                                        <div key={label} className="space-y-2">
                                            <Label>{label} *</Label>
                                            <Input
                                                type="date"
                                                value={periodosForm[keys[i]]}
                                                onChange={(e) =>
                                                    setPeriodosForm((prev) => ({
                                                        ...prev,
                                                        [keys[i]]: e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {currentStep === "vagas" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Users className="h-5 w-5" /> Vagas por Curso e Período
                            </h3>

                            {loadingVagas ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p>Carregando vagas...</p>
                                </div>
                            ) : vagasOriginais?.vagas?.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                                    <p>Nenhuma vaga encontrada</p>
                                    <p className="text-sm mt-2">
                                        Verifique se há cursos/períodos cadastrados
                                    </p>
                                </div>
                            ) : vagasEditadas.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground">
                                    Preparando dados para edição...
                                </p>
                            ) : (
                                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                    {vagasEditadas.map((vaga, index) => (
                                        <VagaItem
                                            key={`${vaga.codigoCurso}-${vaga.codigo_periodo}-${index}`}
                                            vaga={vaga}
                                            index={index}
                                            onChange={handleVagaChange}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === "mensalidades" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <CreditCard className="h-5 w-5" /> Mensalidades Geradas
                            </h3>

                            {loadingMeses ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p>Gerando mensalidades...</p>
                                </div>
                            ) : errorMeses ? (
                                <div className="text-center py-12 text-destructive">
                                    <p>Erro ao gerar mensalidades</p>
                                    <p className="text-sm">
                                        {(errorMeses as Error)?.message || "Tente novamente"}
                                    </p>
                                </div>
                            ) : mensalidadesEditadas.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground border rounded-lg">
                                    <p>Nenhuma mensalidade gerada ainda</p>
                                    <p className="text-sm mt-2">
                                        Preencha as datas dos semestres e avance para gerar
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-card rounded-lg border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Designação</TableHead>
                                                <TableHead>Ordem</TableHead>
                                                <TableHead>Prestação</TableHead>
                                                <TableHead>Semestre</TableHead>
                                                <TableHead>Data Inicial</TableHead>
                                                <TableHead>Data Final</TableHead>
                                                <TableHead>Data Limite</TableHead>
                                                <TableHead>Isenção</TableHead>
                                                <TableHead>Activo</TableHead>
                                                <TableHead>Pós-Grad.</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mensalidadesEditadas.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">
                                                        {item.designacao}
                                                    </TableCell>
                                                    <TableCell>{item.ordem_mes}</TableCell>
                                                    <TableCell>{item.prestacao}ª</TableCell>
                                                    <TableCell>{item.semestre}º</TableCell>
                                                    <TableCell>
                                                        {item.data_inicial?.split("T")[0] || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.data_final?.split("T")[0] || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            type="date"
                                                            value={item.data_limite?.split("T")[0] || ""}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                setMensalidadesEditadas((prev) =>
                                                                    prev.map((mes, i) =>
                                                                        i === index
                                                                            ? { ...mes, data_limite: newValue }
                                                                            : mes,
                                                                    ),
                                                                );
                                                            }}
                                                            className="w-[150px]"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.isencao === 1 ? "Sim" : "Não"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.activo === 1 ? "Activo" : "Inactivo"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.activo_posgraduacao === 1 ? "Sim" : "Não"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Botões */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        Anterior
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => handleClose(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={
                                mutationTudo.isPending ||
                                (currentStep === "periodos" && !isPeriodoValid())
                            }
                        >
                            {mutationTudo.isPending ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Salvando tudo...
                                </>
                            ) : currentIndex === steps.length - 1 ? (
                                "Concluir e Salvar"
                            ) : (
                                "Próximo"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
