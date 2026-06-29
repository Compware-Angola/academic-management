// src/hooks/assessment/useQueryMarkingAssessment.ts

import {
  getMarcacaoProvaByIdService,
  GetMarkingAssessmentPayload,
  GetMarkingAssessmentResponse,
  getMarkingAssessmentService,
} from "@/services/avaliacao/fetch-marking-assessment.service";
import { useQuery } from "@tanstack/react-query";

export const useQueryMarkingAssessment = (
  filters: GetMarkingAssessmentPayload,
  options?: {
    enabled?: boolean; // permite sobrescrever o enabled automático
  },
) => {
  const {
    anoLectivo,
    semestre,
    periodo,
    curso,
    anoCurricular,
    prazoId,
    tipoHorario,
    horarioId,
    page = 1,
    limit = 25,
    unidadeCurricular,
  } = filters;

  // Só faz a chamada se todos os campos obrigatórios estiverem preenchidos
  const enabled =
    typeof options?.enabled === "boolean"
      ? options.enabled
      : !!anoLectivo && !!semestre && !!curso && !!prazoId;
  !!tipoHorario;
  return useQuery<GetMarkingAssessmentResponse>({
    queryKey: [
      "marking-assessment",
      {
        anoLectivo,
        semestre,
        periodo,
        curso,
        anoCurricular,
        prazoId,
        tipoHorario,
        horarioId,
        page,
        limit,
        unidadeCurricular,
      },
    ],

    queryFn: () => getMarkingAssessmentService(filters),
    enabled,
    staleTime: 1000 * 60 * 10, // 10 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos (antigo cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// ===================================== by  id ===============================

export function useQueryMarkingAssesmentById(id?: number) {
  return useQuery({
    queryKey: ["marking-assessment-id", id],
    queryFn: () => getMarcacaoProvaByIdService(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
