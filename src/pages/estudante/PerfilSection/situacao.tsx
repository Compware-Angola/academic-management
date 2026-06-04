import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { MotivoSituacaoSelect, EstadoSituacaoSelect } from "@/components/common/global-selects/situation";
import { useMutationSetSituationStudent } from "@/hooks/students/situation.mutation";
import { parseFilter } from "@/util/parse-filter";
import { Loader2, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type SituationProps = {
    value: string;
    codigoMatricula: number;
};

export function Situacao({ value, codigoMatricula }: SituationProps) {

    const mutaionSetSituationStudent = useMutationSetSituationStudent()
    const [form, setForm] = useState({
        estado: '',
        codigoAnoLectivo: '',
        codigoMotivo: '',
    })
    const handleMutate = async () => {
        await mutaionSetSituationStudent.mutateAsync({
            enrollmentCode: codigoMatricula,
            academicYearCode: parseFilter(form.codigoAnoLectivo),
            reasonSituationCode: parseFilter(form.codigoMotivo),
        })

        setForm((s) => ({
            ...s,
            estado: '',
            codigoMotivo: '',
        }))
    }

    return (
        <TabsContent value={value} className="mt-0">
            <div className="space-y-6">
                <div className="p-6  grid gap-3   grid-cols-1 md:grid-cols-3">
                    <AcademicYearSelect enableDefaultActiveYear value={form.codigoAnoLectivo} onChangeValue={(v) => setForm({ ...form, codigoAnoLectivo: v })} />
                    <EstadoSituacaoSelect disabled={form.codigoAnoLectivo === ""} value={form.estado} onChangeValue={(v) => setForm({ ...form, estado: v, codigoMotivo: "" })} />
                    <MotivoSituacaoSelect estado={Number(form.estado)} disabled={form.estado === ""} value={form.codigoMotivo} onChangeValue={(v) => setForm({ ...form, codigoMotivo: v })} />
                </div>
                <Button onClick={handleMutate} disabled={form.estado === "" || form.codigoAnoLectivo === "" || form.codigoMotivo === "" || mutaionSetSituationStudent.isPending}>
                    {
                        mutaionSetSituationStudent.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <SaveIcon />
                        )
                    }
                    Salvar
                </Button>

            </div>
        </TabsContent >
    );
}
