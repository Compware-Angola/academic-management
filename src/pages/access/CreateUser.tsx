import { useState } from "react";
import { UserPlus, Save, RotateCcw, Loader2 } from "lucide-react";
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
import { useCreatePersonUser } from "@/hooks/acess/use-create-person-user";
import { useQueryEstadoCivil } from "@/hooks/acess/use-query-estado-civil";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryNacionalidade } from "@/hooks/acess/use-query-nacionalidade";
import { useQueryTipoDocumento } from "@/hooks/acess/use-query-tipo-documento";
import { useQuerySexo } from "@/hooks/acess/use-query-sexo";
import { useAuth } from "@/hooks/use-auth";

interface FormData {
  nomeCompleto: string;
  numDocIdentificacao: string;
  email: string;
  dataDeNascimento: string;
  tipoDocumentoId: string;
  sexoId: string;
  estadoCivilId: string;
  nacionalidadeId: string;
  telefone1: string;
  telefone2: string;
}

const DEFAULT_PASSWORD = "Compware@123";

export default function CreateUser() {
  const { toast } = useToast();
  const { user: userData } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    numDocIdentificacao: "",
    email: "",
    dataDeNascimento: "",
    tipoDocumentoId: "",
    sexoId: "",
    estadoCivilId: "",
    nacionalidadeId: "",
    telefone1: "",
    telefone2: "",
  });

  const { mutateAsync: CreateUser, isPending } = useCreatePersonUser();

  const { data: estadosCivis = [], isLoading: isLoadingEstadosCivis } =
    useQueryEstadoCivil();
  const { data: estadosNacionalidade = [], isLoading: isLoadingNacionalidade } =
    useQueryNacionalidade();
  const { data: estadosTipoDocumento = [], isLoading: isLoadingTipoDocumento } =
    useQueryTipoDocumento();
  const { data: estadosSexo = [], isLoading: isLoadingSexo } = useQuerySexo();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.nomeCompleto.trim() ||
      !formData.numDocIdentificacao.trim() ||
      !formData.email.trim() ||
      !formData.dataDeNascimento
    ) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha nome, documento, email e data de nascimento.",
        variant: "destructive",
      });
      return;
    }

    try {
      await CreateUser({
        payload: {
          nomeCompleto: formData.nomeCompleto.trim(),
          numDocIdentificacao: formData.numDocIdentificacao.trim(),
          email: formData.email.trim(),
          dataDeNascimento: formData.dataDeNascimento,
          tipoDocumentoId: Number(formData.tipoDocumentoId) || undefined,
          sexoId: Number(formData.sexoId) || undefined,
          estadoCivilId: Number(formData.estadoCivilId) || undefined,
          nacionalidadeId: Number(formData.nacionalidadeId) || undefined,
          telefone1: formData.telefone1.trim() || undefined,
          telefone2: formData.telefone2.trim() || undefined,
          senha: formData.numDocIdentificacao,           // ← sempre esta senha
        },
      });

      toast({
        title: "Utilizador criado",
        description:
          "O utilizador foi criado com sucesso. A senha inicial será o número do documento e deverá ser alterada no primeiro acesso.",
        variant: "default",
      });


      handleReset();
    } catch (error: any) {
      toast({
        title: "Erro ao criar utilizador",
        description: error?.message || "Ocorreu um problema inesperado.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      nomeCompleto: "",
      numDocIdentificacao: "",
      email: "",
      dataDeNascimento: "",
      tipoDocumentoId: "",
      sexoId: "",
      estadoCivilId: "",
      nacionalidadeId: "",
      telefone1: "",
      telefone2: "",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Criar Utilizador</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Criar Utilizador
        </h1>
        <p className="text-muted-foreground">
          Preencha os dados para criar um novo utilizador no sistema.
        </p>
      </div>

      {/* Card informativo – agora mais direto */}
        <Card className="w-full max-w-6xl bg-amber-50 border border-amber-400">
        <CardHeader>
          <CardTitle className="text-amber-800">Senha Inicial</CardTitle>
        </CardHeader>
        <CardContent className="text-amber-900 space-y-2">
          <p>
            A senha inicial do utilizador será definida automaticamente com base
            no <strong>Número do Documento de Identificação</strong>.
          </p>
          <p className="text-sm text-amber-800">
            Por motivos de segurança, o utilizador será obrigado a alterar a senha
            no primeiro acesso ao sistema.
          </p>
        </CardContent>
      </Card>


      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Dados do Utilizador
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome Completo *</Label>
              <Input
                id="nomeCompleto"
                placeholder="Ex: João António da Silva"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numDocIdentificacao">Nº Documento de Identificação *</Label>
              <Input
                id="numDocIdentificacao"
                placeholder="Ex: 001234567LA047"
                value={formData.numDocIdentificacao}
                onChange={(e) => handleInputChange("numDocIdentificacao", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: joao.silva@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataDeNascimento">Data de Nascimento *</Label>
              <Input
                id="dataDeNascimento"
                type="date"
                value={formData.dataDeNascimento}
                onChange={(e) => handleInputChange("dataDeNascimento", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone1">Telefone 1</Label>
              <Input
                id="telefone1"
                placeholder="Ex: 923 456 789"
                value={formData.telefone1}
                onChange={(e) => handleInputChange("telefone1", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone2">Telefone 2</Label>
              <Input
                id="telefone2"
                placeholder="Ex: 999 888 777"
                value={formData.telefone2}
                onChange={(e) => handleInputChange("telefone2", e.target.value)}
              />
            </div>

            <FormSelect
              label="Estado Civil"
              options={estadosCivis}
              map={(e) => ({ key: e.codigo, label: e.designacao, value: e.codigo })}
              value={formData.estadoCivilId}
              onChange={(val) => handleInputChange("estadoCivilId", val)}
              disabled={isLoadingEstadosCivis}
              loading={isLoadingEstadosCivis}
            />

            <FormSelect
              label="Nacionalidade"
              options={estadosNacionalidade}
              map={(n) => ({ key: n.codigo, label: n.designacao, value: n.codigo })}
              value={formData.nacionalidadeId}
              onChange={(val) => handleInputChange("nacionalidadeId", val)}
              disabled={isLoadingNacionalidade}
              loading={isLoadingNacionalidade}
            />

            <FormSelect
              label="Sexo"
              options={estadosSexo}
              map={(s) => ({ key: s.codigo, label: s.designacao, value: s.codigo })}
              value={formData.sexoId}
              onChange={(val) => handleInputChange("sexoId", val)}
              disabled={isLoadingSexo}
              loading={isLoadingSexo}
            />

            <FormSelect
              label="Tipo de Documento"
              options={estadosTipoDocumento}
              map={(d) => ({ key: d.codigo, label: d.designacao, value: d.codigo })}
              value={formData.tipoDocumentoId}
              onChange={(val) => handleInputChange("tipoDocumentoId", val)}
              disabled={isLoadingTipoDocumento}
              loading={isLoadingTipoDocumento}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A criar...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Criar Utilizador
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}