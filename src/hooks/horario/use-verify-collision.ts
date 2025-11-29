// src/hooks/horario/use-verify-collision.ts

import { VerifyCollisionPayload, verifyCollisionService } from "@/services/horario/colisao.service";
import { useMutation } from "@tanstack/react-query";


export const useVerifyCollision = () => {
  return useMutation({
    mutationFn: (payload: VerifyCollisionPayload) =>
      verifyCollisionService(payload),
  });
};
