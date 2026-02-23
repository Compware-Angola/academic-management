// src/services/solicitacao/listar-servicos.service.ts

import { axiosNestGa } from "@/lib/axios-nest-ga";
import { normalizeParam } from "@/util/normalize-param";

/* ---------- PAYLOAD ---------- */
export type ListarServicosPayload = {
  estado_solicitacao?: number | string;
  codigo_ano_lectivo: number | string;
};

/* ---------- RESPONSE ITEM ---------- */
export type Servico = {
  CODIGO: number;
  DESCRICAO: string;
};

/* ---------- SERVICE ---------- */
export async function listarServicosService(
  payload: ListarServicosPayload
): Promise<Servico[]> {

  const {
    codigo_ano_lectivo,
  } = payload;

  const params = {
    codigo_ano_lectivo: codigo_ano_lectivo
  };

  const { data } = await axiosNestGa.get<Servico[]>(
    "/solicitacoa/servicos",
    { params }
  );

  

  return data;
}
