"use client";

import { Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useActiveRegistration } from "@/hooks/students/use-query-students";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { useState } from "react";
import { parseFilter } from "@/util/parse-filter";
import { toast } from "sonner";
import Lottie from "lottie-react";
import UnlockedLock from "@/assets/unlock.json";

export function AtivarMatricula({
  codigoMatricula,
  value = "ativar-matricula",
}: {
  codigoMatricula: number;
  value?: string;
}) {
  const activeRegistration = useActiveRegistration();
  const [anoLectivoId, setAnoLectivoId] = useState<string>("");

  async function onSubmit() {
    if (!parseFilter(anoLectivoId)) {
      toast.error("Ano lectivo inválido");
      return;
    }
    await activeRegistration.mutateAsync({
      codigoMatricula,
      anoLectivoId: parseInt(anoLectivoId),
    });
  }

  return (
    <TabsContent value={value} className="space-y-4 px-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-lg">Ativar Matrícula Cancelada</CardTitle>
      </div>

      <CardDescription>
        Define o ano lectivo para ativar a matrícula do estudante.
      </CardDescription>

      <div className="flex justify-center items-center">
        <Lottie
          animationData={UnlockedLock}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <AcademicYearSelect
            value={anoLectivoId}
            enableDefaultActiveYear
            onChangeValue={(value) => setAnoLectivoId(value)}
          />
        </div>
        <Button
          className="cursor-pointer gap-2 transition-all duration-200 shrink-0 mb-0"
          disabled={activeRegistration.isPending}
          onClick={onSubmit}
        >
          {activeRegistration.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>A ativar...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Ativar Matrícula</span>
            </>
          )}
        </Button>
      </div>
    </TabsContent>
  );
}