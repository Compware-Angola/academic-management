import {
  closeCashRegisterService,
  createCashRegisterService,
  deleteCashRegisterService,
  listCashRegistersService,
  ListCashRegisterPayload,
  openCashRegisterService,
  updateCashRegisterService,
  CashRegister,
  myCashRegisterService,
} from "@/services/finance/cash-register.service";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useQueryCashRegisters = (filters?: ListCashRegisterPayload) => {
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
    mutationFn: (id: number) => openCashRegisterService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash-registers"],
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
        queryKey: ["cash-registers"],
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
