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
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsers({
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
    ].includes(c.descricao)
  );

  // Mutation
  const { mutate: definirFaculdade, isPending } = useDefineFaculdade();

  return (
    <TabsContent value="faculdade" className="mt-4">
      <div className="space-y-4">
        <div className="mt-4 flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
          <div className="grid md:grid-cols-4 gap-4 md:col-span-2">
            {/* Cargo */}
            <FormCommandSelect
              disabled={isLoadingTipoCargo}
              value={form.cargo}
              label="Cargo"
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
              options={users}
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
            <FormCommandSelect
              disabled={isLoadingCursos}
              value={form.curso}
              label="Curso"
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
          </div>

          <div className="mt-4 min-w-full lg:min-w-[200px]">
            <Button
              className="w-full"
              disabled={
                !form.cargo ||
                !form.ocupante ||
                !form.faculdade ||
                !form.curso ||
                isPending
              }
              onClick={() => setConfirmOpen(true)}
            >
              {isPending ? "A definir..." : "Definir"}
            </Button>
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
