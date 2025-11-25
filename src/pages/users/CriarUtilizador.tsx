import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CriarUtilizador = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [perfil, setPerfil] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/utilizadores">Criar/Editar Utilizadores</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Criar Utilizador</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Criar Novo Utilizador</h1>

      <Card className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Dados do Utilizador</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome completo"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@universidade.ao"
            />
          </div>

          <div>
            <Label htmlFor="username">Nome de Utilizador *</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
          </div>

          <div>
            <Label htmlFor="senha">Senha *</Label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Senha temporária"
            />
          </div>

          <div>
            <Label htmlFor="perfil">Perfil de Acesso *</Label>
            <Select value={perfil} onValueChange={setPerfil}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="docente">Docente</SelectItem>
                <SelectItem value="estudante">Estudante</SelectItem>
                <SelectItem value="secretaria">Secretaria</SelectItem>
                <SelectItem value="rh">Recursos Humanos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="departamento">Departamento *</Label>
            <Select value={departamento} onValueChange={setDepartamento}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engenharia">Engenharia</SelectItem>
                <SelectItem value="medicina">Medicina</SelectItem>
                <SelectItem value="direito">Direito</SelectItem>
                <SelectItem value="economia">Economia</SelectItem>
                <SelectItem value="reitoria">Reitoria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="+244 923 456 789"
            />
          </div>

          <div>
            <Label htmlFor="bi">Número do BI</Label>
            <Input
              id="bi"
              placeholder="000000000LA000"
            />
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg mt-6">
          <h3 className="font-medium mb-2">Informações Importantes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• O utilizador receberá um email com as credenciais de acesso</li>
            <li>• A senha deve ser alterada no primeiro acesso</li>
            <li>• Certifique-se de que o email está correto</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-6">
          <Button variant="default">Criar Utilizador</Button>
          <Button variant="outline">Limpar Formulário</Button>
          <Button variant="ghost">Cancelar</Button>
        </div>
      </Card>
    </div>
  );
};

export default CriarUtilizador;
