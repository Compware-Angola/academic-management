import { useState } from "react";
import { Plus, Receipt, Trash2, Minus, Plus as PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { TypeServiceSelectList } from "@/components/common/global-selects/TypeServiceSelectList";
import { parseFilter } from "@/util/parse-filter";
import { useQueryTiposServico } from "@/hooks/financas/use-query-tipo-service";
import { useCreateInvoice } from "@/hooks/financas/invoice/use-create-mutation";
import { useToast } from "@/hooks/use-toast";

type Props = {
    codigoMatricula: number;

};



export function DividasSection({ codigoMatricula }: Props) {
    const [codigoAnoLectivo, setCodigoAnoLectivo] = useState<string | null>("");

    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="border-b pb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Outros Serviços
                </h2>
                <p className="text-muted-foreground mt-1">
                    Selecione e adicione serviços extras para o estudante
                </p>
            </div>

            {/* Seletores na mesma linha - Alinhados */}
            <div className="flex flex-col lg:flex-row items-end gap-4">
                {/* Ano Letivo */}
                <div className="w-full lg:w-80">

                    <AcademicYearSelect
                        enableDefaultActiveYear
                        value={codigoAnoLectivo}
                        onChangeValue={(v) => setCodigoAnoLectivo(v)}
                    />
                </div>


            </div>




        </div>
    );
}