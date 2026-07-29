import { ServiceByYear } from "@/services/financas/fetch-list-services-by-year.service";
import { CreateServiceMassItem } from "@/services/financas/create-services-mass";
import { ServicoUI } from "../types/types";

const paraBooleano = (v: "SIM" | "NAO") => v === "SIM";

export function mapServicoParaUI(
  s: ServiceByYear,
  grupo: "MENSALIDADE" | "OUTRO",
): ServicoUI {
  return {
    codigo: s.codigo,
    descricao: s.descricao,
    sigla: s.sigla,
    grupo,
    // ajustar se o backend devolver o estado noutro formato
    estado: s.estado.toUpperCase() as ServicoUI["estado"],
    poloId: s.polo_id,
    codigoAnoLectivo: s.codigo_ano_lectivo,
    anolectivo: s.anolectivo,
    tipoCandidatura: s.tipo_candidatura,
    estadoSolicitacao: s.estado_solicitacao,
    disponibilizarAluno: paraBooleano(s.disponibilizar_aluno),
    mestrado: paraBooleano(s.mestrado),
    cacuaco: paraBooleano(s.cacuaco),
    visualizarNoPortal: paraBooleano(s.visualizar_no_portal),
    preco: s.preco,
    precoAnterior: s.preco,
    taxaIvaId: s.taxa_iva_id,
    motivoIsencaoIvaCodigo: s.motivo_isencao_iva_codigo,
    codigoGradeCurricular: s.codigo_grade_currilular,
    canal: s.canal,
    polo_designacao: s.polo_designacao,
    data: s.data,
  };
}

export function mapServicoParaPayload(
  s: ServicoUI,
  codigoAnoLectivoDestino: number,
): CreateServiceMassItem {
  return {
    taxaIvaId: s.taxaIvaId,
    motivoIsencaoIvaCodigo: s.motivoIsencaoIvaCodigo,
    preco: s.preco,
    descricao: s.descricao,
    tipoServico: s.grupo === "MENSALIDADE" ? "MENSALIDADE" : "OUTROS",
    estado: s.estado === "ACTIVO",
    data: s.data,
    disponibilizarAluno: s.disponibilizarAluno,
    codigoGradeCurricular: s.codigoGradeCurricular,
    mestrado: s.mestrado,
    canal: s.canal,
    poloId: s.poloId,
    cacuaco: s.cacuaco,
    codigoAnoLectivo: codigoAnoLectivoDestino,
    valorAnterior: s.precoAnterior,
    visualizarNoPortal: s.visualizarNoPortal,
    sigla: s.sigla,
    estadoSolicitacao: s.estadoSolicitacao,
    tipoCandidatura: s.tipoCandidatura,
  };
}
