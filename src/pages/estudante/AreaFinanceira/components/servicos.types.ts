import { Cadeira } from "@/services/students/fetch-recurso-uc.service";

export type StatusServico = "pendente" | "processando" | "sucesso" | "erro";

export type ServicoItem = {
  nome: string;
  sigla: string;
  quantidade: number;
  valor: number;
  codigo: number;
  cadeirasRecursoIds?: Cadeira[];
  status?: StatusServico;
  mensagemErro?: string;
};
