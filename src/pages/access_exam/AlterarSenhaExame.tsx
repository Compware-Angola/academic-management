import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Search, KeyRound, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { FilterCandidatoParams, Candidato } from "@/services/access_exam/fetch-candidatos.service";
import { useCandidatos } from "@/hooks/access_exam/use-candidatos";
import { useUpdateCandidato } from "@/hooks/access_exam/use-update-candidato";

export default function AlterarSenhaExame() {
  // valor digitado no input — não dispara query
  const [searchInput, setSearchInput] = useState("");

  // só actualizado ao clicar em Pesquisar — este sim dispara query
  const [activeFilters, setActiveFilters] = useState<FilterCandidatoParams | null>(null);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { data, isLoading } = useCandidatos(
    activeFilters ?? { search: undefined, page: 1, limit: 1 },
    { enabled: !!activeFilters } // só executa quando activeFilters tiver valor
  );
  const { mutate: updateCandidato, isPending: isSaving } = useUpdateCandidato();

  const candidato: Candidato | null = data?.data?.[0] ?? null;
  const pesquisou = !!activeFilters;

  function handleSearch() {
    if (!searchInput.trim()) {
      toast({
        title: "Erro",
        description: "Insira o nome ou BI do candidato.",
        variant: "destructive",
      });
      return;
    }
    setNovaSenha("");
    setConfirmarSenha("");
    setActiveFilters({ search: searchInput.trim(), page: 1, limit: 1 });
  }

  function handleAlterarSenha() {
    if (!candidato) return;

    if (!novaSenha || !confirmarSenha) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }
    if (novaSenha.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }

    updateCandidato(
      { id: candidato.numero_inscricao, payload: { senha: novaSenha } },
      {
        onSuccess: () => {
          toast({
            title: "Senha alterada",
            description: `Senha de ${candidato.nome} alterada com sucesso.`,
          });
          setNovaSenha("");
          setConfirmarSenha("");
        },
        onError: () => {
          toast({ title: "Erro", description: "Não foi possível alterar a senha.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Alterar Senha</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold tracking-tight">Alterar Senha do Candidato</h1>
      <p className="text-muted-foreground">Alterar a senha de acesso de um candidato ao exame de acesso.</p>

      {/* Pesquisa */}
      <Card>
        <CardHeader><CardTitle>Pesquisar Candidato</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Nome ou BI do Candidato</Label>
              <Input
                placeholder="Ex: João Silva ou 004567890LA042"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="gap-2" disabled={isLoading}>
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isLoading && pesquisou && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/4" />
          </CardContent>
        </Card>
      )}

      {/* Não encontrado */}
      {!isLoading && pesquisou && !candidato && (
        <Card>
          <CardContent className="pt-6 text-center py-10">
            <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Nenhum candidato encontrado para "<strong>{activeFilters?.search}</strong>".
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dados do candidato */}
      {!isLoading && candidato && (
        <>
          <Card>
            <CardHeader><CardTitle>Dados do Candidato</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nº Inscrição</Label>
                  <p className="font-mono font-semibold">{candidato.numero_inscricao}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{candidato.nome}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">BI</Label>
                  <p className="font-mono">{candidato.numero_bilhete}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Curso</Label>
                  <p>{candidato.curso}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Período</Label>
                  <p>{candidato.periodo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ano Lectivo</Label>
                  <p>{candidato.ano_lectivo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{candidato.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contacto</Label>
                  <p>{candidato.contato}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo Candidatura</Label>
                  <p>{candidato.tipo_candidatura}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nova Senha */}
          <Card>
            <CardHeader><CardTitle>Nova Senha</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <div className="space-y-2">
                  <Label>Nova Senha</Label>
                  <div className="relative">
                    <Input
                      type={mostrarSenha ? "text" : "password"}
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setMostrarSenha((v) => !v)}
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Senha</Label>
                  <Input
                    type={mostrarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                  />
                </div>
              </div>
              <Button
                onClick={handleAlterarSenha}
                className="mt-4 gap-2"
                disabled={isSaving}
              >
                <KeyRound className="h-4 w-4" />
                {isSaving ? "A guardar..." : "Alterar Senha"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}