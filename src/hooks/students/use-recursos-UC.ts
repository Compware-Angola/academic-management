import {
  getCadeirasEspecial,
  getCadeirasRecurso,
  inscreverEpocaEspecial,
  inscreverRecurso,
  InscricaoEpocaEspecialPayload,
  InscricaoRecursoPayload,
} from "@/services/students/fetch-recurso-uc.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  anoLetivo?: number;
  matricula?: number;
  semestre?: number;
};

export function useQueryCadeirasRecuros(
  { anoLetivo, matricula }: Props,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["cadeiras-recursos", anoLetivo, matricula],
    queryFn: () =>
      getCadeirasRecurso({
        anoLetivo: anoLetivo!,
        matricula: matricula!,
      }),
    select: (data) => data, // extrai só o array de cadeiras
    enabled: !!anoLetivo && !!matricula,
  });
}

// export const useMutateInscricaoRecuro = () => {
//   const queryClient = useQueryClient();
//   // const navigate = useNavigate();
//   return useMutation({
//     mutationFn: (dados: InscricaoRecursoPayload) => inscreverRecurso(dados),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["cadeiras-recursos"] });
//       queryClient.invalidateQueries({ queryKey: ["invoices"] });
//       toast.success("Inscrição realizada com sucesso");
//       const payload = {
//         tab: "nota-pagamento",
//         from: "servicos",
//         ts: Date.now(),
//       };
//       const encoded = btoa(JSON.stringify(payload));
//       // navigate(`/financas?data=${encoded}`);
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });
// };

export function useQueryCadeirasEpocaEspecial(
  { anoLetivo, matricula }: Props,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["cadeiras-epoca-especial", anoLetivo, matricula],
    queryFn: () =>
      getCadeirasEspecial({
        anoLetivo: anoLetivo!,
        matricula: matricula!,
      }),
    enabled: !!anoLetivo && !!matricula,
  });
}

// export const useMutateInscricaoEpocaEspecial = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (dados: InscricaoEpocaEspecialPayload) =>
//       inscreverEpocaEspecial(dados),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["cadeiras-epoca-especial"] });
//       queryClient.invalidateQueries({ queryKey: ["invoices"] });
//       toast.success("Inscrição realizada com sucesso");
//       const payload = {
//         tab: "nota-pagamento",
//         from: "servicos",
//         ts: Date.now(),
//       };
//       const encoded = btoa(JSON.stringify(payload));
//     },
//     onError: (error) => {
//       toast.error(error.message);
//     },
//   });
// };

// use-recursos-UC.ts

export const useMutateInscricaoRecuro = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: InscricaoRecursoPayload) => inscreverRecurso(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadeiras-recursos"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};

export const useMutateInscricaoEpocaEspecial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: InscricaoEpocaEspecialPayload) =>
      inscreverEpocaEspecial(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cadeiras-epoca-especial"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
  });
};
