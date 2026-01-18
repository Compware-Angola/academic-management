import { useState } from "react";
import { Save, RotateCcw, Loader2, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { FormSelect } from "@/components/common/FormSelect";

import { useCreateInstituicao } from "@/hooks/financa/use-create-instituicao";
import { useListInstituicaoTipo } from "@/hooks/financa/use-listar-instituicao";

interface FormData {
  instituicao: string;
  nif: string;
  tipoInstituicaoId: string;
  contacto: string;
  endereco: string;
  sigla: string;
}

export default function CreateInstituicao() {
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    instituicao: "",
    nif: "",
    tipoInstituicaoId: "",
    contacto: "",
    endereco: "",
    sigla: "",
  });

  const { mutateAsync: createInstituicao, isPending } =
    useCreateInstituicao();

  const {
    data: tiposInstituicao = [],
    isLoading: isLoadingTipos,
  } = useListInstituicaoTipo();

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.instituicao ||
      !formData.nif ||
      !formData.tipoInstituicaoId
    ) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

      await createInstituicao({
      payload: {
        instituicao: formData.instituicao,
        nif: formData.nif,
        tipoInstituicaoId: Number(formData.tipoInstituicaoId),
        contacto: formData.contacto || undefined,
        endereco: formData.endereco || undefined,
        sigla: formData.sigla || undefined,
      },
    });

      handleReset();
    
  };

  const handleReset = () => {
    setFormData({
      instituicao: "",
      nif: "",
      tipoInstituicaoId: "",
      contacto: "",
      endereco: "",
      sigla: "",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Breadcrumb */}
      <div className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/financa">
                Finança
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Criar Instituição</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold tracking-tight">
          Criar Instituição
        </h1>
        <p className="text-muted-foreground">
          Preencha os dados para registar uma nova instituição.
        </p>
      </div>

      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados da Instituição
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nome */}
            <div className="space-y-2">
              <Label>Instituição *</Label>
              <Input
                placeholder="Ex: Hospital São Lucas"
                value={formData.instituicao}
                onChange={(e) =>
                  handleInputChange("instituicao", e.target.value)
                }
              />
            </div>

            {/* NIF */}
            <div className="space-y-2">
              <Label>NIF *</Label>
              <Input
                placeholder="Ex: 12345678000190"
                value={formData.nif}
                onChange={(e) =>
                  handleInputChange("nif", e.target.value)
                }
              />
            </div>

            {/* Tipo */}
            <FormSelect
              label="Tipo de Instituição *"
              options={tiposInstituicao}
              map={(t) => ({
                key: t.id,
                label: t.nome,
                value: t.id,
              })}
              value={formData.tipoInstituicaoId}
              onChange={(v) =>
                setFormData({ ...formData, tipoInstituicaoId: v })
              }
              disabled={isLoadingTipos}
              loading={isLoadingTipos}
            />

            {/* Sigla */}
            <div className="space-y-2">
              <Label>Sigla</Label>
              <Input
                placeholder="Ex: HSL"
                value={formData.sigla}
                onChange={(e) =>
                  handleInputChange("sigla", e.target.value)
                }
              />
            </div>

            {/* Contacto */}
            <div className="space-y-2">
              <Label>Contacto</Label>
              <Input
                placeholder="Ex: 923 456 789"
                value={formData.contacto}
                onChange={(e) =>
                  handleInputChange("contacto", e.target.value)
                }
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input
                placeholder="Ex: Av. Principal, nº 123"
                value={formData.endereco}
                onChange={(e) =>
                  handleInputChange("endereco", e.target.value)
                }
              />
            </div>
          </div>

          {/* Ações */}
          <div className="mt-8 flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A criar...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Criar Instituição
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
