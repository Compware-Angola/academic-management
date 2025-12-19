import { axiosApexGa } from "@/lib/axios-apex-ga";
export async function deletePrazo(prazoId: number) {
  await axiosApexGa.delete("/auto/fk2_mcal_tb_prazo", {
    data: {
      pk_prazo: prazoId,
    },
  });
}
