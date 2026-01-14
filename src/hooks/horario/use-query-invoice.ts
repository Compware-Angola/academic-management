import { ListarFacturasPayload, listarFacturasService } from "@/services/finance/listar-facturas.service";
import { useQuery } from "@tanstack/react-query";


export const useQueryFacturas = (filters: ListarFacturasPayload) => {
 
  const enabled = !!filters.search || !!filters.anoLectivo;

  return useQuery({
    queryKey: ["facturas", filters],
    queryFn: () => listarFacturasService(filters),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
};
