import { IsentarColisaoCursoPayload, isentarColisaoCursoService, IsentarColisaoMatriculaPayload, isentarColisaoMatriculaService, IsentarColisaoResponse } from "@/services/registrations/collision-exemption.service";
import { useMutation } from "@tanstack/react-query";


export function useMutationIsentarColisaoMatricula() {
  return useMutation<IsentarColisaoResponse, Error, IsentarColisaoMatriculaPayload>({
    mutationFn: isentarColisaoMatriculaService,
  });
}

export function useMutationIsentarColisaoCurso() {
  return useMutation<IsentarColisaoResponse, Error, IsentarColisaoCursoPayload>({
    mutationFn: isentarColisaoCursoService,
  });
}