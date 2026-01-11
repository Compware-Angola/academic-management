import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { useQueryFetchTipoCargo } from "@/hooks/cargo/use-query-fetch-tipo-cargo";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useUsers } from "@/hooks/acess/use-query-users";
import { useDebounce } from "@/hooks/use-debounce";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDefineReitoria } from "@/hooks/acess/use-mutation-define-reitoria";

export function TabContentReitoria() {
  const [filtroCargo, setFiltroCargo] = useState("0");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [novoOcupante, setNovoOcupante] = useState("");
  const { data: tipoCargos = [], isLoading: isLoadingTipoCargo } =
    useQueryFetchTipoCargo();
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers({
    search: debouncedSearch,
  });
  const { mutate: definirReitoria, isPending } = useDefineReitoria();

  const users = usersResponse?.data ?? [];

  return (
    <TabsContent value="reitoria" className="mt-4">
      <div className="space-y-4">
        <div className="mt-4 rounded-xl border border-border bg-card shadow-sm">
          {/* Conteúdo */}
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Filtros */}
              <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                <FormCommandSelect
                  disabled={isLoadingTipoCargo}
                  value={filtroCargo}
                  label="Cargos"
                  width="full"
                  options={tipoCargos.filter((c) =>
                    c.descricao.toLowerCase().includes("reit")
                  )}
                  map={(c) => ({
                    key: c.pk_tipo_cargo.toString(),
                    value: c.pk_tipo_cargo.toString(),
                    label: c.descricao,
                  })}
                  onChange={setFiltroCargo}
                />

                <FormCommandSelect
                  disabled={isLoadingUsers}
                  value={novoOcupante}
                  label="Novo Ocupante"
                  width="full"
                  isLoading={isLoadingUsers}
                  options={users}
                  map={(u) => ({
                    key: u.codigo.toString(),
                    value: u.codigo.toString(),
                    label: u.nome,
                  })}
                  onChange={setNovoOcupante}
                  onSearchChange={setSearch}
                />
              </div>
            </div>
          </div>

          {/* Ação */}
          <div className="border-t border-border bg-muted/30 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                className="w-full sm:w-auto"
                disabled={!filtroCargo || !novoOcupante || isPending}
                onClick={() => setConfirmOpen(true)}
              >
                Definir
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar definição de Reitoria</AlertDialogTitle>

            <AlertDialogDescription>
              Tem a certeza que deseja definir este utilizador como ocupante do
              cargo selecionado na Reitoria?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                // Só aqui chama a mutation
                definirReitoria(
                  {
                    tipoCargoId: Number(filtroCargo),
                    utilizadorId: Number(novoOcupante),
                  },
                  {
                    onSuccess: () => {
                      setConfirmOpen(false);
                      setNovoOcupante("");
                      setSearch("");
                    },
                  }
                );
              }}
            >
              {isPending ? "A definir..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );
}
