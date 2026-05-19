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
import { Home, Search, Send, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Candidato,
  FilterCandidatoParams,
} from "@/services/access_exam/fetch-candidatos.service";
import { useCandidatos } from "@/hooks/access_exam/use-candidatos";
import { useLancarNotaManual } from "@/hooks/access_exam/use-lancar-nota-manual";

export default function LancarNotaManual() {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilters, setActiveFilters] =
    useState<FilterCandidatoParams | null>(null);
  const [nota, setNota] = useState("");

  const { data, isLoading } = useCandidatos(
    activeFilters ?? { search: undefined, page: 1, limit: 1 },
    { enabled: !!activeFilters }
  );

  const { mutate: lancarNota, isPending } = useLancarNotaManual();

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

    setNota("");
    setActiveFilters({ search: searchInput.trim(), page: 1, limit: 1 });
  }

  function refreshPesquisa() {
    const search = searchInput.trim();
    setActiveFilters(null);
    setTimeout(() => {
      setActiveFilters({ search, page: 1, limit: 1 });
    }, 100);
  }

  function handleLancarNota() {
    if (!candidato) {
      toast({
        title: "Erro",
        description: "Nenhum candidato seleccionado.",
        variant: "destructive",
      });
      return;
    }

    const notaNumerica = parseFloat(nota);

    if (nota === "" || Number.isNaN(notaNumerica)) {
      toast({
        title: "Erro",
        description: "Insira uma nota válida.",
        variant: "destructive",
      });
      return;
    }

    if (notaNumerica < 0 || notaNumerica > 20) {
      toast({
        title: "Erro",
        description: "A nota deve estar entre 0 e 20.",
        variant: "destructive",
      });
      return;
    }

    lancarNota(
      {
        id: candidato.numero_inscricao,
        payload: { nota: notaNumerica },
      },
      {
        onSuccess: () => {
          setNota("");
          refreshPesquisa();
        },
      }
    );
  }

  function handleReprovarSemNota() {
    if (!candidato) {
      toast({
        title: "Erro",
        description: "Nenhum candidato seleccionado.",
        variant: "destructive",
      });
      return;
    }

    lancarNota(
      {
        id: candidato.numero_inscricao,
        payload: { nota: null },
      },
      {
        onSuccess: () => {
          setNota("");
          refreshPesquisa();
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
            <BreadcrumbPage>Lançar Nota Manual</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Lançar Nota Manual
        </h1>
        <p className="text-muted-foreground mt-1">
          Pesquise o candidato e lance manualmente a nota do exame de acesso.
        </p>
      </div>

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
                onChange={(event) => setSearchInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="gap-2"
                disabled={isLoading}
              >
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && pesquisou && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-1/4" />
          </CardContent>
        </Card>
      )}

      {!isLoading && pesquisou && !candidato && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum resultado encontrado</p>
            <p className="text-muted-foreground mt-1">
              Nenhum candidato encontrado para "
              <strong>{activeFilters?.search}</strong>".
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && candidato && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Dados do Candidato</CardTitle>
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-400 bg-blue-50"
              >
                Pronto para lançamento
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-muted-foreground">Nº Inscrição</Label>
                <p className="font-mono font-semibold">
                  {candidato.numero_inscricao}
                </p>
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
                <Label className="text-muted-foreground">
                  Tipo Candidatura
                </Label>
                <p>{candidato.tipo_candidatura}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <Label className="text-base font-semibold">Nota Manual</Label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="w-full sm:max-w-xs space-y-2">
                  <Label>Nota</Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    step={0.1}
                    placeholder="Ex: 14.5"
                    value={nota}
                    onChange={(event) => setNota(event.target.value)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && handleLancarNota()
                    }
                  />
                </div>
                <Button
                  onClick={handleLancarNota}
                  disabled={isPending || !nota}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isPending ? "A lançar..." : "Lançar Nota"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReprovarSemNota}
                  disabled={isPending}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reprovar sem nota
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
