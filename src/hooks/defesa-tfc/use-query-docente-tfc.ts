// hooks/useDocentes.ts
import { getDocentesTfcService } from '@/services/defesa-tfc/docentes-tfc.service';
import { useQuery } from '@tanstack/react-query';


export function useQueryDocentesTfc(filters: { 
  faculdadeId?: number; 
  search?: string; 
  page?: number; 
  limit?: number 
}) {
  return useQuery({
    queryKey: ['docentes-tfc', filters],
    queryFn: () => getDocentesTfcService(filters),
  });
}