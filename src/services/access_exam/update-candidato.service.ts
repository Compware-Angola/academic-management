// services/access_exam/update-candidato.service.ts
import { axiosNestGa } from "@/lib/axios-nest-ga";

export type UpdateCandidatoPayload = {
  nomePai?: string;
  nomeMae?: string;
  codigoProfissaoPai?: number;
  codigoProfissaoMae?: number;
  codigoCurso?: number;
  codigoCursoOpcional1?: number;
  codigoCursoOpcional2?: number;
  mediaFinal?: number;
  telefone?: string;
  telefoneEmergencia?: string;
  email?: string;
  morada?: string;
  codigoTurno?: number;
  codigoTurnoOpcional?: number;
  codigoTipoCandidatura?: number;
  senha?: string;
};
export async function updateCandidato(id: number, payload: UpdateCandidatoPayload) {
  const { data } = await axiosNestGa.patch(`/exames-de-acesso/candidato/${id}`, payload);
  return data;
}