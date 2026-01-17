import { updateInstituicao, UpdateInstituicaoParams } from "@/services/finance/update-instituicao.service";
import { useMutation } from "@tanstack/react-query";


export function useUpdateInstituicao() {
  return useMutation<void, Error, { codigo: number; data: UpdateInstituicaoParams }>({
    mutationFn: ({ codigo, data }) => updateInstituicao(codigo, data),
  });
}
