import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, User as UserIcon } from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { useQueryEstadoCivil } from "@/hooks/acess/use-query-estado-civil";
import { useQueryNacionalidade } from "@/hooks/acess/use-query-nacionalidade";
import { useQuerySexo } from "@/hooks/acess/use-query-sexo";
import { useQueryTipoDocumento } from "@/hooks/acess/use-query-tipo-documento";
import { User } from "@/services/access/fect-users.service";
import { useUpdatePersonUser } from "@/hooks/acess/useUpdatePersonUser";

interface UserEditModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

function isValidEmail(email: string) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBI(bi: string) {
  if (!bi) return true;
  return /^\d{9}[A-Z]{2}\d{3}$/.test(bi.toUpperCase());
}

export function UserEditModal({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserEditModalProps) {
  const { mutateAsync: updateUser, isPending } = useUpdatePersonUser();

  const { data: estadosCivis = [], isLoading: isLoadingEstadosCivis } =
    useQueryEstadoCivil();
  const { data: nacionalidades = [], isLoading: isLoadingNacionalidade } =
    useQueryNacionalidade();
  const { data: sexos = [], isLoading: isLoadingSexo } = useQuerySexo();
  const { data: tiposDocumento = [], isLoading: isLoadingTipoDocumento } =
    useQueryTipoDocumento();

  const [formData, setFormData] = useState<any>({});
  const [initialData, setInitialData] = useState<any>(null);

  function formatToInputDate(date: string | null) {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  }

  function formatToApiDate(date: string) {
    if (!date) return null;
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    if (user && open) {
      const data = {
        nome: user.nome ?? "",
        numerodocumento: user.numerodocumento ?? "",
        email: user.email ?? "",
        datadenascimento: formatToInputDate(user.datadenascimento),
        telefone1: user.telefone1 ?? "",
        telefone2: user.telefone2 ?? "",
        genero: user.genero?.toString() ?? "",
        estadocivil: user.estadocivil?.toString() ?? "",
        nacionalidade: user.nacionalidade?.toString() ?? "",
        tipoDocumentoId: user.numerodocumento?.toString() ?? "",
      };

      setFormData(data);
      setInitialData(data);
    }
  }, [user, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const emailValido = isValidEmail(formData?.email || "");
  const biValido = isValidBI(formData?.numerodocumento || "");

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  const formValido = formData?.nome?.trim() !== "" && emailValido && biValido;

  async function handleSubmit() {
    if (!formValido || !hasChanges) return;
    try {
      await updateUser({
        id: user.codigo,
        payload: {
          nomeCompleto: formData.nome,
          numDocIdentificacao: formData.numerodocumento || null,
          email: formData.email || null,
          dataDeNascimento: formData.datadenascimento,
          telefone1: formData.telefone1 || null,
          telefone2: formData.telefone2 || null,
          sexoId: formData.genero ? Number(formData.genero) : null,
          estadoCivilId: formData.estadocivil
            ? Number(formData.estadocivil)
            : null,
          nacionalidadeId: formData.nacionalidade
            ? Number(formData.nacionalidade)
            : null,
          tipoDocumentoId: formData.tipoDocumentoId
            ? Number(formData.tipoDocumentoId)
            : null,
        },
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar utilizador:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <UserIcon className="h-6 w-6 text-primary" />
            Editar Utilizador – {user?.nome}
            <Badge variant="outline">Código: {user?.codigo}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Nome */}
          <div className="space-y-2 md:col-span-2">
            <Label>Nome Completo *</Label>
            <Input
              value={formData?.nome || ""}
              onChange={(e) => handleInputChange("nome", e.target.value)}
            />
          </div>

          {/* BI */}
          <div className="space-y-2">
            <Label>Nº Documento</Label>
            <Input
              value={formData?.numerodocumento || ""}
              onChange={(e) =>
                handleInputChange(
                  "numerodocumento",
                  e.target.value.toUpperCase(),
                )
              }
              className={
                formData?.numerodocumento && !biValido
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {formData?.numerodocumento && !biValido && (
              <p className="text-sm text-destructive">
                Formato inválido. Ex: 001234567LA047
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData?.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={
                formData?.email && !emailValido
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {formData?.email && !emailValido && (
              <p className="text-sm text-destructive">Email inválido</p>
            )}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label>Data de Nascimento</Label>
            <Input
              type="date"
              value={formData?.datadenascimento || ""}
              onChange={(e) =>
                handleInputChange("datadenascimento", e.target.value)
              }
            />
          </div>

          {/* Telefones */}
          <div className="space-y-2">
            <Label>Telefone 1</Label>
            <Input
              value={formData?.telefone1 || ""}
              onChange={(e) => handleInputChange("telefone1", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Telefone 2</Label>
            <Input
              value={formData?.telefone2 || ""}
              onChange={(e) => handleInputChange("telefone2", e.target.value)}
            />
          </div>

          {/* Selects */}
          <FormSelect
            label="Estado Civil"
            options={estadosCivis}
            map={(e) => ({
              key: e.codigo,
              label: e.designacao,
              value: e.codigo,
            })}
            value={formData?.estadocivil}
            onChange={(val) => handleInputChange("estadocivil", val)}
            disabled={isLoadingEstadosCivis}
            loading={isLoadingEstadosCivis}
          />

          <FormSelect
            label="Nacionalidade"
            options={nacionalidades}
            map={(n) => ({
              key: n.codigo,
              label: n.designacao,
              value: n.codigo,
            })}
            value={formData?.nacionalidade}
            onChange={(val) => handleInputChange("nacionalidade", val)}
            disabled={isLoadingNacionalidade}
            loading={isLoadingNacionalidade}
          />

          <FormSelect
            label="Sexo"
            options={sexos}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
            value={formData?.genero}
            onChange={(val) => handleInputChange("genero", val)}
            disabled={isLoadingSexo}
            loading={isLoadingSexo}
          />

          <FormSelect
            label="Tipo Documento"
            options={tiposDocumento}
            map={(d) => ({
              key: d.codigo,
              label: d.designacao,
              value: d.codigo,
            })}
            value={formData?.tipoDocumentoId}
            onChange={(val) => handleInputChange("tipoDocumentoId", val)}
            disabled={isLoadingTipoDocumento}
            loading={isLoadingTipoDocumento}
          />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isPending || !hasChanges || !formValido}
            className="flex items-center gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "A guardar..." : "Guardar alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
