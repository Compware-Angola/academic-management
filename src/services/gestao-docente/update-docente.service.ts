import { axiosNestGa } from "@/lib/axios-nest-ga";

export interface UpdateDocentePayload {
  apreciacao: string;
  nMecanografico: string;
  fkEscalao: number;
  tbCategoriaDocente: number;
  faculdade: number;
  codigoValidacao: string;
  valorHora: number;
  fkGrauAcademico: number;
  totalAnoExperiencia: number;
  dataInicioDocencia: string;
  propostaDeContratacao: string;
  valorhoraAlt?: number;
  codContrato?: number;
}

export const updateDocente = async ({
  codigo,
  payload,
}: {
  codigo: number;
  payload: UpdateDocentePayload;
}): Promise<void> => {
  await axiosNestGa.patch(`/docente-gestao/update-docente/${codigo}`, payload);
};
