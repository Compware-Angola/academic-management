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
import { Home, Search, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

import { useResultadoProva } from "@/hooks/access_exam/use-resultado-prova";
import { ResultadoProva } from "@/services/access_exam/fetch-resultado-prova.service";
import { useLancarNotaArquitecturaEUrbanismo } from "@/hooks/access_exam/use-lancar-nota-arquitetura-urbanismo";


export default function LancarNotaArquitectura() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState<string>("");
  const [notaPratica, setNotaPratica] = useState<string>("");

  const { data, isLoading } = useResultadoProva(
    {
      search: activeSearch || undefined,
      page: 1,
      limit: 1,
    },
    {
      enabled: !!activeSearch,
    }
  );

  const { mutate: lancarNota, isPending: isLancando } =
    useLancarNotaArquitecturaEUrbanismo();

  const candidato: ResultadoProva | null = data?.data?.[0] ?? null;
  const pesquisou = !!activeSearch;

  function handleSearch() {
    if (!searchInput.trim()) {
      toast({
        title: "Erro",
        description: "Insira o nome ou BI do candidato.",
        variant: "destructive",
      });
      return;
    }
    setNotaPratica("");
    setActiveSearch(searchInput.trim());
  }

  function handleLancarNota() {
    const nota = parseFloat(notaPratica);

    if (notaPratica === "" || isNaN(nota)) {
      toast({
        title: "Erro",
        description: "Insira uma nota válida.",
        variant: "destructive",
      });
      return;
    }

    if (nota < 0 || nota > 20) {
      toast({
        title: "Erro",
        description: "A nota deve estar entre 0 e 20.",
        variant: "destructive",
      });
      return;
    }

    if (!candidato?.numero_inscricao) {
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
        payload: { notaPratica: nota },
      },
      {
        onSuccess: () => {
          // Refaz a pesquisa para actualizar os dados exibidos
          setActiveSearch("");
          setTimeout(() => setActiveSearch(searchInput.trim()), 100);
          setNotaPratica("");
        },
      }
    );
  }

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
            <BreadcrumbPage>Lançar Nota — Arquitectura e Urbanismo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Lançar Nota — Arquitectura e Urbanismo
        </h1>
        <p className="text-muted-foreground mt-1">
          Pesquise pelo nome ou BI do candidato e lance a nota prática.
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
              Nenhum candidato encontrado para "
              <strong>{activeSearch}</strong>".
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resultado Encontrado */}
      {!isLoading && candidato && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Candidato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">

              {/* Informações Pessoais */}
              <div>
                <Label className="text-muted-foreground">Nº de Inscrição</Label>
                <p className="font-mono font-semibold text-lg mt-1">
                  {candidato.numero_inscricao}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Nome Completo</Label>
                <p className="font-medium text-lg mt-1">{candidato.nome}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Bilhete de Identidade</Label>
                <p className="font-mono mt-1">{candidato.numero_bilhete}</p>
              </div>

              {/* Informações Académicas */}
              <div>
                <Label className="text-muted-foreground">Curso</Label>
                <p className="font-medium mt-1">{candidato.curso}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Faculdade</Label>
                <p className="mt-1">{candidato.faculdade || "—"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Período</Label>
                <p className="mt-1">{candidato.periodo}</p>
              </div>

              {/* Detalhes da Prova */}
              <div>
                <Label className="text-muted-foreground">Sala</Label>
                <p className="mt-1">{candidato.sala || "—"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Realização</Label>
                <p className="mt-1">{candidato.data_realizacao || "—"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Horário da Prova</Label>
                <p className="font-medium mt-1">
                  {candidato.hora_inicio || "--:--"} — {candidato.hora_fim || "--:--"}
                </p>
              </div>

              {/* Nota actual */}
              <div>
                <Label className="text-muted-foreground">Nota da prova teórica</Label>
                <div className="mt-2">
                  {candidato.nota != null ? (
                    <Badge
                      variant="outline"
                      className={`text-xl px-6 py-2 font-semibold ${
                        candidato.nota >= 14
                          ? "bg-green-500/10 text-green-700 border-green-500"
                          : candidato.nota >= 10
                          ? "bg-yellow-500/10 text-yellow-700 border-yellow-500"
                          : "bg-red-500/10 text-red-700 border-red-500"
                      }`}
                    >
                      {candidato.nota.toFixed(1)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-base px-4 py-1 text-muted-foreground">
                      Sem nota
                    </Badge>
                  )}
                </div>
              </div>

     
              {/* Separador + Input para lançar nota */}
              <div className="lg:col-span-3 pt-6 border-t">
                <Label className="text-base font-semibold">Lançar Nota Prática</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Introduza a nota prática do candidato (0 a 20) e confirme.
                </p>
                <div className="flex gap-4 items-end max-w-sm">
                  <div className="flex-1 space-y-2">
                    <Label>Nota Prática</Label>
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      step={0.1}
                      placeholder="Ex: 14.5"
                      value={notaPratica}
                      onChange={(e) => setNotaPratica(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleLancarNota()}
                    />
                  </div>
                  <Button
                    onClick={handleLancarNota}
                    disabled={isLancando || !notaPratica}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isLancando ? "A lançar..." : "Lançar Nota"}
                  </Button>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}