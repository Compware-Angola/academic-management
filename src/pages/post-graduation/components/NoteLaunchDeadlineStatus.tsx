import type { ReactNode } from "react";

export type NoteLaunchDeadlineState =
  | "LOADING"
  | "NO_YEAR_SELECTED"
  | "NOT_DEFINED"
  | "OUT_OF_PERIOD"
  | "ALLOWED";

type NoteLaunchDeadlineStatusProps = {
  status: NoteLaunchDeadlineState;
  prompt?: {
    tipo_avaliacao_nome?: string;
    data_inicio: string;
    data_fim: string;
  } | null;
  hasSpecialPermission: boolean;
  isPrivilegedUser: boolean;
};

export function NoteLaunchDeadlineStatus({
  status,
  prompt,
  hasSpecialPermission,
  isPrivilegedUser,
}: NoteLaunchDeadlineStatusProps) {
  if (isPrivilegedUser) {
    return (
      <div className="flex items-center gap-2 border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
        <span className="h-2 w-2 rounded-full bg-purple-500" />
        Acesso privilegiado: lançamento de notas sem restrição de prazo.
      </div>
    );
  }

  if (hasSpecialPermission) {
    return (
      <div className="flex items-center gap-2 border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
        Possui permissão especial de lançamento ativa.
      </div>
    );
  }

  const configurations: Record<
    NoteLaunchDeadlineState,
    {
      className: string;
      title?: string;
      content: ReactNode;
    }
  > = {
    LOADING: {
      className: "border bg-muted text-muted-foreground",
      content: "A verificar o prazo de lançamento de notas...",
    },
    NO_YEAR_SELECTED: {
      className: "border bg-muted text-muted-foreground",
      content: "Selecione o ano lectivo para verificar o prazo de lançamento.",
    },
    NOT_DEFINED: {
      className: "border border-red-200 bg-red-50 text-red-700",
      title: "Nenhum prazo configurado",
      content: `Não existe período definido para ${
        prompt?.tipo_avaliacao_nome ?? "esta avaliação"
      }. Contacte a administração.`,
    },
    OUT_OF_PERIOD: {
      className: "border border-amber-300 bg-amber-50 text-amber-800",
      title: `Fora do prazo: ${
        prompt?.tipo_avaliacao_nome ?? "Lançamento de Notas"
      }`,
      content: prompt ? (
        <>
          O lançamento está permitido apenas de{" "}
          <strong>
            {new Date(prompt.data_inicio).toLocaleDateString("pt-AO")}
          </strong>{" "}
          até{" "}
          <strong>
            {new Date(prompt.data_fim).toLocaleDateString("pt-AO")}
          </strong>
          .
        </>
      ) : (
        "O lançamento de notas encontra-se fora do prazo."
      ),
    },
    ALLOWED: {
      className: "border border-green-200 bg-green-50 text-green-800",
      content: "Dentro do prazo para lançamento de notas.",
    },
  };

  const configuration = configurations[status];

  return (
    <div className={`${configuration.className} p-4 text-sm`}>
      {configuration.title && (
        <p className="mb-1 font-semibold">{configuration.title}</p>
      )}
      <div>{configuration.content}</div>
    </div>
  );
}
