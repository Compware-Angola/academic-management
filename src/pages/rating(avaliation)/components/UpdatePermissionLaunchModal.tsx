import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { UpdatePermissionPayload } from "@/services/avaliacao/update-permission-launch.service";
import { useMutationUpdatePermissionAssessment } from "@/hooks/avaliacao/use-mutation-update-permission-launch";
import { AssessmentPermissionItem } from "@/services/avaliacao/fetch-permission-assessment";

type UpdatePermissionLaunchModalProps = {
  permission?: AssessmentPermissionItem;
  isOpen: boolean;
  onClose: () => void;
};

export default function UpdatePermissionLaunchModal({
  isOpen,
  onClose,
  permission,
}: UpdatePermissionLaunchModalProps) {
  const { mutate: updatePermission, isPending: isUpdateLoadingPermission } =
    useMutationUpdatePermissionAssessment();

  const [filters, setFilters] = useState({
    dataInicio: "",
    dataFim: "",
  });

  useEffect(() => {
    if (permission?.data_inicio && permission?.data_fim) {
      const dataInicio = new Date(permission.data_inicio);
      const dataFim = new Date(permission.data_fim);

      setFilters({
        dataInicio: dataInicio.toISOString().split("T")[0],
        dataFim: dataFim.toISOString().split("T")[0],
      });
    }
  }, [permission]);

  const closeModal = () => {
    onClose();
  };
  const handleCreatePermission = async () => {
    const payload: UpdatePermissionPayload = {
      dataFim: filters.dataFim,
      dataInicio: filters.dataInicio,
    };
    updatePermission(
      {
        payload,
        permissionId: permission.codigo_permissao,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-5xl! w-full! max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl">Actualizar Permissões</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>

        <div className="flex-1 overflow-y-auto py-6 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {" "}
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Input
                type="date"
                placeholder="Data Início"
                value={filters.dataInicio}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dataInicio: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Input
                type="date"
                placeholder="Data Fim"
                value={filters.dataFim}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dataFim: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={closeModal} size="lg">
            Fechar
          </Button>
          <Button
            disabled={isUpdateLoadingPermission}
            onClick={handleCreatePermission}
            size="lg"
          >
            {isUpdateLoadingPermission ? <Loader /> : "Actualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
