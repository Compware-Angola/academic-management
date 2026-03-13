import { toggleParametroDocente, ToggleParametroDocenteResponse } from "@/services/gestao_docente/update.gestao.docente.parametro.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleParametroDocente() {
  const queryClient = useQueryClient();

  return useMutation<ToggleParametroDocenteResponse, Error, number>({
    mutationFn: (codigo: number) => toggleParametroDocente(codigo),
    onSuccess: (data, codigo) => {
      // Atualiza automaticamente a lista no cache
      queryClient.setQueryData(["docente-gestao-parametros"], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedData = { ...oldData };
        updatedData.data = updatedData.data.map((item: any) =>
          item.codigo === codigo ? { ...item, args: [{ ...item.args[0], state: data.state }] } : item
        );
        return updatedData;
      });
    },
  });
}