import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosApexGa } from "@/lib/axios-apex-ga";
import { useAuth } from "@/hooks/use-auth";
import { AxiosError } from "axios";
import { useQueryGenerateMesTemp } from "@/hooks/academiccalendar/use-query-generate-mes-temp";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarData } from "@/util/date-formate";
import { useMutationCreateMesTemp } from "@/hooks/academiccalendar/use-mutation-create-mes-temp";

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
  const [mensalidadesEditadas, setMensalidadesEditadas] = useState<any[]>([]);
  

  console.log("MESES: ", mensalidadesEditadas)

  const [currentStep, setCurrentStep] = useState<Step>("periodos");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  // Dados guardados em memória até o final
  const [periodosForm, setPeriodosForm] = useState({
    designacao: "",
    dataInicioPrimeiroSemestre: "",
    dataFimPrimeiroSemestre: "",
    dataInicioSegundoSemestre: "",
    dataFimSegundoSemestre: "",
  });

  //console.log("MUTA:", codigoAnoLectivo)

  const { data: vagasOriginais = [], isLoading: loadingVagas } =
    useQueryVacancies();
  const [vagasEditadas, setVagasEditadas] = useState<any[]>([]);

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  // Gera designação automaticamente
  useEffect(() => {
    const inicio1 = periodosForm.dataInicioPrimeiroSemestre;
    const fim2 = periodosForm.dataFimSegundoSemestre;
    if (inicio1 && fim2) {
      const anoInicio = new Date(inicio1).getFullYear();
      const anoFim = new Date(fim2).getFullYear();
      const anoFinal = anoFim >= anoInicio ? anoFim : anoInicio + 1;
      setPeriodosForm((prev) => ({
        ...prev,
        designacao: `${anoInicio}-${anoFinal}`,
      }));
    } else {
      setPeriodosForm((prev) => ({ ...prev, designacao: "" }));
    }
  }, [
    periodosForm.dataInicioPrimeiroSemestre,
    periodosForm.dataFimSegundoSemestre,
  ]);

  // Carrega vagas quando entra no passo
  useEffect(() => {
    if (
      currentStep === "vagas" &&
      vagasOriginais.length > 0 &&
      vagasEditadas.length === 0
    ) {
      setVagasEditadas(vagasOriginais.map((v) => ({ ...v })));
    }
  }, [currentStep, vagasOriginais, vagasEditadas.length]);

  // === Validação do passo de períodos ===
  const isPeriodoValid = () => {
    return [
      periodosForm.dataInicioPrimeiroSemestre,
      periodosForm.dataFimPrimeiroSemestre,
      periodosForm.dataInicioSegundoSemestre,
      periodosForm.dataFimSegundoSemestre,
    ].every((field) => field.trim() !== "");
  };

  // === Mutations (só no final) ===
  const mutationTudo = useMutation({
    mutationFn: async () => {
      if (!isPeriodoValid()) throw new Error("Períodos incompletos");

      // 1. Primeiro salva o ano letivo
      const periodoPayload = {
        designacao: periodosForm.designacao,
        data_inicio_primeiro_semestre: periodosForm.dataInicioPrimeiroSemestre,
        data_fim_primeiro_semestre: periodosForm.dataFimPrimeiroSemestre,
        data_inicio_segundo_semestre: periodosForm.dataInicioSegundoSemestre,
        data_fim_segundo_semestre: periodosForm.dataFimSegundoSemestre,
        codigo_utilizador: user.user?.pk_utilizador,
      };

      const periodoRes = await axiosApexGa.post(
        "/ga/teaching-parameters/academic-year",
        periodoPayload
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

      await axiosApexGa.post("/ga/teaching-parameters/vacancies", vagasPayload);

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
                  data_limite: mes.dataLimite || mes.data_limite,
                  data_inicial: mes.data_inicial,
                  data_final: mes.data_final,
                  data_final_desconto: mes.data_final_desconto,
                  semestre: mes.semestre,
                  semestre_posgraduacao: mes.semestre_posgraduacao,
                })),
              },
              {
                onSuccess: resolve,
                onError: reject,
              }
            );
          });
        }


      return { codigoAnoLectivo: codigoAnoLectivo };
    },
    onSuccess: (data) => {
      toast({ title: "Parâmetros acadêmicos configurados com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["academic-year-params"] });
      queryClient.invalidateQueries({ queryKey: ["anosLetivos"] });

      queryClient.invalidateQueries({
        queryKey: ["generate-mes-temp", data.codigoAnoLectivo]
      });

      onSuccess?.();
      resetForm();
      onOpenChange(false);
    },
    onError: (
      error: AxiosError<{
        msgresposta: string;
      }>
    ) => {
      toast({
        title: "Erro ao salvar parâmetros",
        description: error.response.data.msgresposta || "Tente novamente",
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

      // ========= 1º SEMESTRE =========

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

      // ========= 2º SEMESTRE =========

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

    // Avança ou salva
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    } else {
      mutationTudo.mutate();
    }
  };


  const { mutate: mutateMeses } = useMutationCreateMesTemp();

 const { data: mesesTemp } = useQueryGenerateMesTemp(
  { anoLectivoId: codigoAnoGerado as number },
  { enabled: !!codigoAnoGerado && currentStep === "mensalidades" }
);


const mensalidades = useMemo(() => {
  if (!mesesTemp) return [];

  return mesesTemp.map((item) => ({
    
    designacao: item.designacao,
    isencao: item.isencao,
    ordem_mes: item.ordem_mes,
    ano_lectivo: item.ano_lectivo,
    prestacao: item.prestacao,
    activo: item.activo,
    activo_posgraduacao: item.activo_posgraduacao,
    data_limite: item.data_limite,
    data_inicial: item.data_inicial,
    data_final: item.data_final,
    data_final_desconto: item.data_final_desconto,
    semestre: item.semestre,
    semestre_posgraduacao: item.semestre_posgraduacao,
  }));
}, [mesesTemp]);


useEffect(() => {
  if (currentStep === "mensalidades" && mesesTemp) {
    setMensalidadesEditadas(mensalidades);
  }
}, [mesesTemp, currentStep]);

console.log("MESES RAW:", mensalidades);
console.log("IS ARRAY?", mensalidades);


  const handlePrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex].id);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl! w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Configurar Parâmetros Acadêmicos
          </DialogTitle>
          <DialogDescription>
            Configure períodos e vagas. Tudo será salvo ao final.
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    index <= currentIndex
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
                  className={`text-xs font-medium text-center ${
                    index <= currentIndex
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-12 right-0 h-1 -z-10 ${
                      index < currentIndex ? "bg-primary" : "bg-muted"
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
                <p className="text-center py-10">Carregando...</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {vagasEditadas.map((vaga, i) => (
                    <div
                      key={`${vaga.codigoCurso}-${vaga.codigo_periodo}`}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div>
                        <p className="font-medium">{vaga.cursoDescricao}</p>
                        <p className="text-sm text-muted-foreground">
                          {vaga.periodoDescricao}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setVagasEditadas((prev) => {
                              const novo = [...prev];
                              novo[i].numeroVagas = Math.max(
                                0,
                                novo[i].numeroVagas - 1
                              );
                              return novo;
                            });
                          }}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={vaga.numeroVagas}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setVagasEditadas((prev) => {
                              const novo = [...prev];
                              novo[i].numeroVagas = val;
                              return novo;
                            });
                          }}
                          className="w-24 text-center"
                          min="0"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setVagasEditadas((prev) => {
                              const novo = [...prev];
                              novo[i].numeroVagas += 1;
                              return novo;
                            });
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </div>
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

    <div className="bg-card rounded-lg border">
      <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Designação</TableHead>
      <TableHead>Mês</TableHead>
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
    {mensalidadesEditadas.length === 0 ? (
      <TableRow>
        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
          Nenhuma mensalidade encontrada
        </TableCell>
      </TableRow>
    ) : (
      mensalidadesEditadas.map((item, index) => (
        <TableRow key={index}>
          
          <TableCell className="font-medium">
            {item.designacao}
          </TableCell>

          <TableCell>
            {item.ordem_mes}
          </TableCell>

          <TableCell>
            {item.prestacao}ª
          </TableCell>

          <TableCell>
            {item.semestre}º
          </TableCell>

          <TableCell>
            {item.data_inicial?.split("T")[0]}
          </TableCell>

          <TableCell>
            {item.data_final?.split("T")[0]}
          </TableCell>

          <TableCell> 
            <Input type="date" 
            value={item.data_limite?.split("T")[0] || ""} 
            onChange={(e) => { const newValue = e.target.value; 
            setMensalidadesEditadas((prev) => prev.map((mes, i) => i === index ? { ...mes, data_limite: newValue } : mes ) ); }}
             className="w-[150px]" /> 
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
      ))
    )}
  </TableBody>
</Table>

    </div>
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
