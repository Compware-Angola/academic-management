"use client";

import { Loader2, CheckCircle } from "lucide-react";
import Lottie from "lottie-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useActiveConfirmacao } from "@/hooks/students/use-query-students";
import UnlockedLock from "@/assets/unlock.json";

export function AtivarConfirmacao({
  codigoMatricula,
  value = "ativar-confirmacao",
}: {
  codigoMatricula: number;
  value?: string;
}) {
  const activeConfirmation = useActiveConfirmacao();

  async function onSubmit() {
    await activeConfirmation.mutateAsync({ codigoMatricula });
  }

  return (
    <TabsContent value={value} className="space-y-4 px-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-lg">Ativar Confirmação</CardTitle>
      </div>

      <CardDescription>
        Clique no botão abaixo para ativar a confirmação do estudante.
      </CardDescription>

      <div className="flex justify-center items-center">
        <Lottie
          animationData={UnlockedLock}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      </div>

      <div className="flex gap-2 flex-col">
        <Button
          onClick={onSubmit}
          disabled={activeConfirmation.isPending}
          className="w-full cursor-pointer gap-2 transition-all duration-200"
        >
          {activeConfirmation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>A ativar...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Ativar Confirmação</span>
            </>
          )}
        </Button>
      </div>
    </TabsContent>
  );
}