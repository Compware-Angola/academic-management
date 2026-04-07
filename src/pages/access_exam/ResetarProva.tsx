import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Home, Search, RotateCcw, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

import { FilterCandidatoParams, Candidato } from "@/services/access_exam/fetch-candidatos.service";
import { useCandidatos } from "@/hooks/access_exam/use-candidatos";
import { useResetarProva } from "@/hooks/access_exam/use-resetar-prova";

export default function ResetarProva() {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterCandidatoParams | null>(null);

  const { data, isLoading } = useCandidatos(
    activeFilters ?? { search: undefined, page: 1, limit: 1 },
    { enabled: !!activeFilters }
  );

  const { mutate: resetarProva, isPending: isResetando } = useResetarProva();

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
    setActiveFilters({ search: searchInput.trim(), page: 1, limit: 1 });
  }

  const handleResetarConfirm = () => {
    if (!candidato) return;
    resetarProva(candidato.numero_inscricao);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Exame de Acesso</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resetar Prova</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resetar Prova</h1>
        <p className="text-muted-foreground mt-1">
          Pesquise o candidato e resetar a prova (limpar atribuição e nota).
        </p>
      </div>

      {/* Card de Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Candidato</CardTitle>
        </CardHeader>
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
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground mt-1">
              Nenhum candidato encontrado para "<strong>{activeFilters?.search}</strong>".
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dados do Candidato + Botão Resetar com AlertDialog */}
      {!isLoading && candidato && (
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-orange-700">Dados do Candidato</CardTitle>
              <Badge variant="outline" className="text-orange-600 border-orange-400 bg-orange-50">
                Resetar Prova
              </Badge>
            </div>
          </CardHeader>
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

            {/* AlertDialog */}
            <div className="mt-10 flex justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="gap-3 px-12"
                    disabled={isResetando}
                  >
                    <RotateCcw className="h-5 w-5" />
                    Resetar Prova
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-5 w-5" />
                      Confirmar Reset da Prova
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      Tem certeza que deseja <strong>resetar a prova</strong> do candidato{" "}
                      <strong>#{candidato.numero_inscricao}</strong> — {candidato.nome}?
                      <br />
                      Esta ação irá limpar a atribuição e a nota da prova.
                      <br />
                      <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetarConfirm}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={isResetando}
                    >
                      {isResetando ? "A resetar..." : "Sim, Resetar Prova"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Esta ação irá limpar a atribuição e nota da prova do candidato.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}