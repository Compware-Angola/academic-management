import { useState } from "react";
import { UserPlus, Save, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface FormData {
  nomeCompleto: string;
  numDocIdentificacao: string;
  email: string;
  dataDeNascimento: string;
  tipoDocumentoId: string;
  sexoId: string;
  estadoCivilId: string;
  nacionalidadeId: string;
}

const tiposDocumento = [
  { id: "1", nome: "Bilhete de Identidade" },
  { id: "2", nome: "Passaporte" },
  { id: "3", nome: "Cartão de Residência" },
];

const sexos = [
  { id: "1", nome: "Masculino" },
  { id: "2", nome: "Feminino" },
];

const estadosCivis = [
  { id: "1", nome: "Solteiro(a)" },
  { id: "2", nome: "Casado(a)" },
  { id: "3", nome: "Divorciado(a)" },
  { id: "4", nome: "Viúvo(a)" },
  { id: "5", nome: "União de Facto" },
];

const nacionalidades = [
  { id: "1", nome: "Angolana" },
  { id: "2", nome: "Portuguesa" },
  { id: "3", nome: "Brasileira" },
  { id: "4", nome: "Cabo-verdiana" },
  { id: "5", nome: "Moçambicana" },
  { id: "6", nome: "São-tomense" },
  { id: "7", nome: "Guineense" },
  { id: "8", nome: "Outra" },
];

export default function CreateUser() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    numDocIdentificacao: "",
    email: "",
    dataDeNascimento: "",
    tipoDocumentoId: "",
    sexoId: "",
    estadoCivilId: "",
    nacionalidadeId: "",
  });
  const  {mutateAsync:CreateUser} = useCreatePersonUser()

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
 
  const  handleSubmit = async () => {
    if (!formData.nomeCompleto || !formData.numDocIdentificacao || !formData.email || !formData.dataDeNascimento) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    
    const response = await CreateUser({
        nomeCompleto: formData.nomeCompleto,
        numDocIdentificacao: formData.numDocIdentificacao,
        email: formData.email,
        dataDeNascimento: formData.dataDeNascimento,
        tipoDocumentoId: formData.tipoDocumentoId,
        sexoId: formData.sexoId,
        estadoCivilId: formData.estadoCivilId,
        nacionalidadeId: formData.nacionalidadeId,
    })
    

  
  }

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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Criar Utilizador</h1>
        <p className="text-muted-foreground">Preencha os dados para criar um novo utilizador no sistema.</p>
      </div>

      <Card className="max-w-4xl">
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
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numDocIdentificacao">Nº Documento de Identificação *</Label>
              <Input
                id="numDocIdentificacao"
                placeholder="Ex: 001234567LA047"
                value={formData.numDocIdentificacao}
                onChange={(e) => handleInputChange("numDocIdentificacao", e.target.value)}
                className="bg-background"
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
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataDeNascimento">Data de Nascimento *</Label>
              <Input
                id="dataDeNascimento"
                type="date"
                value={formData.dataDeNascimento}
                onChange={(e) => handleInputChange("dataDeNascimento", e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoDocumentoId">Tipo de Documento</Label>
              <Select
                value={formData.tipoDocumentoId}
                onValueChange={(value) => handleInputChange("tipoDocumentoId", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sexoId">Sexo</Label>
              <Select
                value={formData.sexoId}
                onValueChange={(value) => handleInputChange("sexoId", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  {sexos.map((sexo) => (
                    <SelectItem key={sexo.id} value={sexo.id}>
                      {sexo.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoCivilId">Estado Civil</Label>
              <Select
                value={formData.estadoCivilId}
                onValueChange={(value) => handleInputChange("estadoCivilId", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione o estado civil" />
                </SelectTrigger>
                <SelectContent>
                  {estadosCivis.map((estado) => (
                    <SelectItem key={estado.id} value={estado.id}>
                      {estado.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nacionalidadeId">Nacionalidade</Label>
              <Select
                value={formData.nacionalidadeId}
                onValueChange={(value) => handleInputChange("nacionalidadeId", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Selecione a nacionalidade" />
                </SelectTrigger>
                <SelectContent>
                  {nacionalidades.map((nac) => (
                    <SelectItem key={nac.id} value={nac.id}>
                      {nac.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Criar Utilizador
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
