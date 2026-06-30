import { useMemo } from 'react';
import { toast } from 'sonner';

interface UseAcademicYearDesignationProps {
  dataInicioPrimeiroSemestre?: string;
  dataFimSegundoSemestre?: string;
  tipoCandidatura?: number;
}

export function useAcademicYearDesignation({
  dataInicioPrimeiroSemestre,
  dataFimSegundoSemestre,
  tipoCandidatura=1
}: UseAcademicYearDesignationProps) {
  return useMemo(() => {
    if (!dataInicioPrimeiroSemestre || !dataFimSegundoSemestre) {
      return '';
    }

    let prefix=""
    if(tipoCandidatura!==1 && tipoCandidatura!==2 && tipoCandidatura!==3){
        toast.error("Tipo de candidatura inválido")
        return {designatio:undefined, startYear:undefined, finalYear:undefined};
    }
    if(tipoCandidatura === 2 || tipoCandidatura === 3) {
        prefix= tipoCandidatura ===2 ? "M": "D";
    
    }
    const startYear = new Date(dataInicioPrimeiroSemestre).getFullYear();
    const endYear = new Date(dataFimSegundoSemestre).getFullYear();

    const finalYear = endYear >= startYear ? endYear : startYear + 1;

    const designation = tipoCandidatura=== 1? `${startYear}-${finalYear}` : `${prefix}-${startYear}-${finalYear}`;
    return {designation, startYear, finalYear}
  }, [dataInicioPrimeiroSemestre, dataFimSegundoSemestre, tipoCandidatura]);
}