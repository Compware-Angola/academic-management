import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTipoCalendario,
  fetchTipoCalendario,
  fetchTipoCalendarios,
  updateTipoCalendario,
  type CreateTipoCalendarioBody,
  type FetchTipoCalendariosParams,
  type UpdateTipoCalendarioBody,
} from "@/services/tipo-calendario/tipo-calendario.service";

const TIPO_CALENDARIO_KEY = "tipo-calendarios";

export function useQueryFetchTipoCalendarios(
  params: FetchTipoCalendariosParams,
) {
  return useQuery({
    queryKey: [TIPO_CALENDARIO_KEY, params],
    queryFn: () => fetchTipoCalendarios(params),
  });
}

export function useQueryFetchTipoCalendario(codigo?: number) {
  return useQuery({
    queryKey: [TIPO_CALENDARIO_KEY, codigo],
    queryFn: () => fetchTipoCalendario(codigo as number),
    enabled: !!codigo,
  });
}

export function useCreateTipoCalendario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTipoCalendarioBody) => createTipoCalendario(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TIPO_CALENDARIO_KEY] });
      toast.success("Tipo de calendário criado com sucesso!", {
        description: data?.designacao || "Operação concluída.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar tipo de calendário", {
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });
}

export function useUpdateTipoCalendario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateTipoCalendarioBody) => updateTipoCalendario(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TIPO_CALENDARIO_KEY] });
      toast.success("Tipo de calendário atualizado com sucesso!", {
        description: data?.designacao || "Operação concluída.",
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao atualizar tipo de calendário", {
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });
}
