import { MesPago } from "@/services/avaliacao/fetch-presence-attendance";

interface VerificarPagamentoProps {
  prestacao: number;
  mesPagos: MesPago[];
  situacao: number;
}
const verificarPagamento = ({
  mesPagos,
  prestacao,
  situacao,
}: VerificarPagamentoProps) => {
  switch (situacao) {
    case 1:
      return mesPagos.length == prestacao;
    case 2:
      return mesPagos.length < prestacao;
  }
};
export { verificarPagamento };
