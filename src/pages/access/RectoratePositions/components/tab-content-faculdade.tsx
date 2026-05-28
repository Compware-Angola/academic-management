import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryFetchTipoCargo } from "@/hooks/cargo/use-query-fetch-tipo-cargo";
import { useUsers } from "@/hooks/acess/use-query-users";
import { useQueryFetchFaculdades } from "@/hooks/faculdade/use-query-fetch-faculdades";
import { useCursos } from "@/hooks/use-cursos";
import { useDefineFaculdade } from "@/hooks/acess/use-mutation-define-faculdade";

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

export function TabContentFaculdade() {
  // Único estado para todo o formulário
  const [form, setForm] = useState({
    cargo: "0",
    ocupante: "",
    faculdade: "",
    curso: "",
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Hooks de dados
  const { data: tipoCargos = [], isLoading: isLoadingTipoCargo } =
    useQueryFetchTipoCargo();
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useUsers({
    search: debouncedSearch,
  });
  const { data: faculdades = [], isLoading: isLoadingFaculdades } =
    useQueryFetchFaculdades();
  const { data: cursos = [], isLoading: isLoadingCursos } = useCursos();

  const users = usersResponse?.data ?? [];

  // Filtrar apenas cargos válidos para Faculdade
  const cargosFaculdade = tipoCargos.filter((c) =>
    [
      "Responsável do Gabinete de Qualidade e Serviços Pedagógicos",
      "Director",
      "Coordenador",
      "Decano",
    ].includes(c.descricao),
  );
  const { mutate: definirFaculdade, isPending } = useDefineFaculdade();
  const isDecanoCargo = form.cargo === "10";
  const canSubmit = !isDecanoCargo
    ? !form.cargo ||
      !form.ocupante ||
      !form.faculdade ||
      !form.curso ||
      isPending
    : !form.cargo || !form.ocupante || !form.faculdade || isPending;

  // Mutation

  return (
    <TabsContent value="faculdade" className="mt-4">
      <div className="space-y-4">
        <div className="mt-4 rounded-xl border border-border bg-card shadow-sm">
          {/* Filtros */}
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Cargo */}
              <FormCommandSelect
                disabled={isLoadingTipoCargo}
                value={form.cargo}
                label="Cargo"
                width="full"
                options={cargosFaculdade}
                map={(c) => ({
                  key: c.pk_tipo_cargo.toString(),
                  value: c.pk_tipo_cargo.toString(),
                  label: c.descricao,
                })}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, cargo: value }))
                }
              />

              {/* Novo ocupante */}
              <FormCommandSelect
                disabled={isLoadingUsers}
                value={form.ocupante}
                label="Novo Ocupante"
                width="full"
                isLoading={isLoadingUsers || isFetchingUsers}
                options={users ?? []}
                map={(u) => ({
                  key: u.codigo.toString(),
                  value: u.codigo.toString(),
                  label: u.nome,
                })}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, ocupante: value }))
                }
                onSearchChange={setSearch}
              />

              {/* Faculdade */}
              <FormCommandSelect
                disabled={isLoadingFaculdades}
                value={form.faculdade}
                label="Faculdade"
                width="full"
                options={faculdades}
                map={(f) => ({
                  key: f.codigo.toString(),
                  value: f.codigo.toString(),
                  label: f.designacao,
                })}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, faculdade: value }))
                }
              />

              {/* Curso */}
              {!isDecanoCargo && (
                <FormCommandSelect
                  disabled={isLoadingCursos}
                  value={form.curso}
                  label="Curso"
                  width="full"
                  options={cursos}
                  map={(c) => ({
                    key: c.codigo.toString(),
                    value: c.codigo.toString(),
                    label: c.designacao,
                  })}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, curso: value }))
                  }
                />
              )}
            </div>
          </div>

          {/* Ação */}
          <div className="border-t border-border bg-muted/30 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                className="w-full sm:w-auto"
                disabled={canSubmit}
                onClick={() => setConfirmOpen(true)}
              >
                {isPending ? "A definir..." : "Definir"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AlertDialog de confirmação */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmar definição de Faculdade
            </AlertDialogTitle>

            <AlertDialogDescription>
              Tem a certeza que deseja definir este utilizador como ocupante do
              cargo selecionado na Faculdade e Curso?
              <br />
              <span className="font-medium text-destructive">
                Esta ação substitui o ocupante atual.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                definirFaculdade(
                  {
                    tipoCargoId: Number(form.cargo),
                    utilizadorId: Number(form.ocupante),
                    faculdadeId: Number(form.faculdade),
                    cursoId: Number(form.curso),
                  },
                  {
                    onSuccess: () => {
                      setConfirmOpen(false);
                      setForm({
                        cargo: "0",
                        ocupante: "",
                        faculdade: "",
                        curso: "",
                      });
                      setSearch("");
                    },
                  },
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
