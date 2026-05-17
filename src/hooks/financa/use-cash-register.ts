import {
  closeCashRegisterService,
  createCashRegisterService,
  deleteCashRegisterService,
  listCashRegistersService,
  openCashRegisterService,
  updateCashRegisterService,
  CashRegister,
  myCashRegisterService,
  avaliableCashRegistersForOpeningService,
  CreateCashRegisterPayload,
  ListCashRegisterFilters,
  getMyCashRegisterSummaryService,
  ListAvailableOperatorsResponse,
  listAvailableOperatorsService,
  ListAvailableOperatorsFilters,
} from "@/services/finance/cash-register.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useQueryCashRegisters = (filters?: ListCashRegisterFilters) => {
  return useQuery({
    queryKey: ["cash-registers", filters],

    queryFn: () => listCashRegistersService(filters),

    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCashRegisterService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
      });
    },
  });
};

export const useUpdateCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CashRegister>;
    }) => updateCashRegisterService(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
      });
    },
  });
};

export const useOpenCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCashRegisterPayload) =>
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
    },
  });
};

export const useDeleteCashRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCashRegisterService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
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
