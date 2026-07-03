import { queryClient } from "@/lib/react-query";
import {
  closeCashRegisterService,
  listCashRegistersService,
  openCashRegisterService,
  myCashRegisterService,
  avaliableCashRegistersForOpeningService,
  ListCashRegisterFilters,
  getMyCashRegisterSummaryService,
  listAvailableOperatorsService,
  ListAvailableOperatorsFilters,
  OpenCashRegisterPayload,
  verifyMyCashRegisterOpeningCodeService,
  ListCashRegisterMovementsFilters,
  listCashRegisterMovementsService,
  ValidateMovementPayload,
  validateMovementService,
  recoveryOpeningCodeService,
  blockMyCashRegisterService,
  CreateCashRegisterPayload,
  createCashRegisterService,
  UpdateCashRegisterPayload,
  updateCashRegisterService,
  deleteCashRegisterService,
  listPaymentReportsForOperatorService,
  ListPaymentReportsForOperatorFilters,
} from "@/services/finance/cash-register.service";


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useQueryCashRegisters = (filters?: ListCashRegisterFilters) => {
  return useQuery({
    queryKey: ["cash-registers", filters],

    queryFn: () => listCashRegistersService(filters),

    staleTime: 1000 * 60 * 5,
  });
};

export const useOpenCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OpenCashRegisterPayload) =>
      openCashRegisterService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-cash-register"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-cash-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-operators"],
      });
    },
  });
};

export const useCloseCashRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => closeCashRegisterService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-cash-register"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-cash-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cash-register-movements"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-operators"],
      });
    },
  });
};

export const useQueryMyCashRegister = () => {
  return useQuery({
    queryKey: ["my-cash-register"],
    queryFn: myCashRegisterService,
    staleTime: 1000 * 60 * 5,
  });
};

export const useQueryAvailableCashRegistersForOpening = (search?: string) => {
  return useQuery({
    queryKey: ["available-cash-registers", search],
    queryFn: () => avaliableCashRegistersForOpeningService(search),
    staleTime: 1000 * 60 * 5,
  });
};

export const useQueryMyCashSummary = () => {
  return useQuery({
    queryKey: ["my-cash-summary"],
    queryFn: getMyCashRegisterSummaryService,
    staleTime: 1000 * 60 * 5,
  });
};

export const useQueryAvailableOperators = (
  filters?: ListAvailableOperatorsFilters,
) => {
  return useQuery({
    queryKey: ["available-operators", filters],
    queryFn: () => listAvailableOperatorsService(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useVerifyMyCashRegisterOpeningCode = () => {
  return useMutation({
    mutationFn: (openingCode: string) =>
      verifyMyCashRegisterOpeningCodeService(openingCode),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-cash-register"],
      });
    },
  });
};

export const useQueryCashRegisterMovements = (
  filters?: ListCashRegisterMovementsFilters,
) => {
  return useQuery({
    queryKey: ["cash-register-movements", filters],
    queryFn: () => listCashRegisterMovementsService(filters),
    staleTime: 1000 * 60 * 5,
  });
};

export const useValidateMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ValidateMovementPayload) =>
      validateMovementService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash-register-movements"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
      });
    },
  });
};

export const useRecoveryOpeningCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => recoveryOpeningCodeService(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-cash-register"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-cash-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cash-register-movements"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-operators"],
      });
      toast.success("Enviamos um novo codigo de abertura para o seu e-mail");
    },
  });
};

export const useBlockMyCashRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => blockMyCashRegisterService(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-cash-register"],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-cash-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cash-register-movements"],
      });
      queryClient.invalidateQueries({
        queryKey: ["available-operators"],
      });
    },
  });
};


export const useCreateCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCashRegisterPayload) =>
      createCashRegisterService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-registers"] });
      queryClient.invalidateQueries({ queryKey: ["available-cash-registers"] });
      toast.success("Caixa criado com sucesso");
    },
  });
};

export const useUpdateCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCashRegisterPayload) =>
      updateCashRegisterService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-registers"] });
      queryClient.invalidateQueries({ queryKey: ["available-cash-registers"] });
      toast.success("Caixa atualizado com sucesso");
    },
  });
};


export const useDeleteCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCashRegisterService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-registers"] });
      queryClient.invalidateQueries({ queryKey: ["available-cash-registers"] });
      toast.success("Caixa eliminado com sucesso");
    },
  });
};

export const useQueryPaymentReportsForOperator = (
  filters: ListPaymentReportsForOperatorFilters,
) => {
  return useQuery({
    queryKey: ["payment-reports-for-operator", filters],
    queryFn: () => listPaymentReportsForOperatorService(filters),
    enabled: !!filters.operatorId,
    staleTime: 1000 * 60 * 5,
  });
};
