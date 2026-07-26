import { useState } from "react";


import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRightLeft } from "lucide-react";



import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";

import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useMutationChangeShift } from "@/hooks/students/use-mutation-change-shift";
import { toast } from "sonner";
import Lottie from "lottie-react";
import ChangeShift from "@/assets/ChangeShift.json";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { useStudentDetail } from "@/hooks/students/use-query-students";

type Props = {
  codigoMatricula: number;
  value?: string;
};

export function ChangeShiftStudentPage({
  codigoMatricula,
  value = "mudar-turno",
}: Props) {
  const { data: periodos = [] } = useQueryPeriod();
  const { data: student } = useStudentDetail(codigoMatricula);

  const mutationChangeShift = useMutationChangeShift();
  const {
    mutateAsync: mutateChangeShift,
    isPending,
    error,
    isError,
  } = mutationChangeShift;

  const [anoLetivo, setAnoLetivo] = useState<string>("23");
  const [periodo, setPeriodo] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleChangeShift = async () => {
    if (!periodo) {
      toast.error("Selecione o período");
      return;
    }
    if (!anoLetivo) {
      toast.error("Selecione o ano letivo");
      return;
    }

    try {
      await mutateChangeShift({
        codigoMatricula,
        novoPeriodoCodigo: Number(periodo),
        anoLectivoId: Number(anoLetivo),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {

    }
  };

  if (!codigoMatricula) {
    return <div className="text-red-500">Matrícula inválida</div>;
  }

  const isReady = !!periodo && !!anoLetivo;

  return (
    <TabsContent value={value} className="space-y-6">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
          70%  { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%      { transform: translateX(-6px); }
          40%      { transform: translateX(6px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }

        .shift-form-wrap {
          animation: fadeSlideUp 0.4s ease both;
        }
        .shift-select-col {
          animation: fadeSlideUp 0.4s ease both;
        }
        .shift-select-col:nth-child(1) { animation-delay: 0.05s; }
        .shift-select-col:nth-child(2) { animation-delay: 0.12s; }
        .shift-select-col:nth-child(3) { animation-delay: 0.19s; }

        .shift-btn-ready {
          animation: pulse-ring 1.8s ease-out infinite;
        }
        .shift-btn-success {
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .shift-check-icon {
          animation: checkPop 0.35s cubic-bezier(.34,1.56,.64,1) both;
        }
        .shift-error-box {
          animation: fadeSlideUp 0.3s ease both, errorShake 0.4s ease 0.1s both;
        }
      `}</style>

      <div className="shift-form-wrap grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="shift-select-col">
          <AcademicYearsAvailableForOperationSelect
            enableDefaultSelectItem={false}
            onlyConfigurable={false}

            enableDefaultActiveYear={false}
            value={anoLetivo}
            onChangeValue={(v) => setAnoLetivo(v)}
            tipoCandidaturaId={Number(student?.tipo_canditatura_codigo)}
            label="Ano Letivo"
          />

        </div>

        <div className="shift-select-col">
          <FormSelect
            label="Período"
            value={periodo}
            onChange={(v) => setPeriodo(v)}
            options={periodos}
            map={(p) => ({
              key: p.codigo,
              label: p.designacao,
              value: p.codigo.toString(),
            })}
            placeholder="Selecione o período"
          />
        </div>

        <div className="shift-select-col flex items-end">
          <Button
            onClick={handleChangeShift}
            disabled={isPending || !isReady}
            className={[
              "w-full transition-all duration-300",
              isReady && !isPending && !success ? "shift-btn-ready" : "",
              success ? "shift-btn-success bg-green-600 hover:bg-green-600 text-white" : "",
            ].join(" ")}
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Alterando Turno...
              </>
            ) : success ? (
              <>
                <span className="shift-check-icon mr-2">✓</span>
                Turno Alterado!
              </>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Alterar Turno
              </>
            )}
          </Button>
        </div>

      </div>
      <div className="flex justify-center items-center">
        <Lottie
          animationData={ChangeShift}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>


    </TabsContent>
  );
}