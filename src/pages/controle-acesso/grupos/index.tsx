import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { GrupoTable } from "./components/table";
import { GrupoFormDialog } from "./components/grupo-form-dialog";
import { Grupo } from "@/services/controle-acesso/listar-grupos.service";
import { useDeleteGrupo } from "@/hooks/controle-acesso/use-delete-grupo";
import { DeleteGrupoDialog } from "./components/delete-grupo-dialog";
import UserGroupModal from "@/pages/access/components/UserGroupModal";

export default function Grupos() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [isUserViewModal, setIsUserViewModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [grupoSelecionado, setGrupoSelecionado] = useState<{
    id: number;
    designacao: string;
    descricao: string;
    sigla: string;
    fkTipoDeGrupo: number;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteMutation = useDeleteGrupo();
  const handleUserView = (grupo: Grupo) => {
    console.log("here!!");
    setGrupoSelecionado({
      id: grupo.codigo,
      designacao: grupo.designacao,
      descricao: grupo.descricao,
      sigla: grupo.sigla,
      fkTipoDeGrupo: grupo.type_group,
    });
    setIsUserViewModal(true);
  };
  const handleEditGrupo = (grupo: Grupo) => {
    setMode("edit");
    setGrupoSelecionado({
      id: grupo.codigo,
      designacao: grupo.designacao,
      descricao: grupo.descricao,
      sigla: grupo.sigla,
      fkTipoDeGrupo: grupo.type_group,
    });
    setModalOpen(true);
  };

  const handleDeleteGrupo = (grupo: Grupo) => {
    setGrupoSelecionado({
      id: grupo.codigo,
      designacao: grupo.designacao,
      descricao: grupo.descricao,
      sigla: grupo.sigla,
      fkTipoDeGrupo: grupo.type_group,
    });
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grupos"
        subtitle="Gestão de grupos de acesso do sistema"
      />
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setMode("create");
                setGrupoSelecionado(null);
                setModalOpen(true);
              }}
            >
              Cadastrar Grupo
            </Button>
          </div>
        </CardContent>
      </Card>
      <GrupoTable
        handleEditGrupo={handleEditGrupo}
        handleDeleteGrupo={handleDeleteGrupo}
        handleUserView={handleUserView}
      />
      <GrupoFormDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={mode}
        initialData={grupoSelecionado}
      />
      <DeleteGrupoDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        grupoId={grupoSelecionado?.id}
        grupoNome={grupoSelecionado?.designacao}
        onDeleted={() => setGrupoSelecionado(null)}
      />
      <UserGroupModal
        onClose={() => setIsUserViewModal(false)}
        isOpen={isUserViewModal}
        grupo={grupoSelecionado}
      />
    </div>
  );
}
