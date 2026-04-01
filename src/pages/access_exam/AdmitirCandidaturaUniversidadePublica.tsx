import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Home, Search, ClipboardList, CheckCircle2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { FilterCandidatoParams, Candidato } from "@/services/access_exam/fetch-candidatos.service";
import { useCandidatos } from "@/hooks/access_exam/use-candidatos";
import { useAdmitirCandidato } from "@/hooks/access_exam/use-admit-candidate";

type Fase = "idle" | "nota_preparada" | "lancado"  ;

export default function AdmitirCandidaturaUniversidadePublica() {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterCandidatoParams | null>(null);
  const [notaExame, setNotaExame] = useState("");
  const [fase, setFase] = useState<Fase>("idle");

  const { data, isLoading } = useCandidatos(
    activeFilters ?? { search: undefined, page: 1, limit: 1 },
    { enabled: !!activeFilters }
  );
  const { mutate: admitirCandidato, isPending: isSaving } = useAdmitirCandidato();

  const candidato: Candidato | null = data?.data?.[0] ?? null;
  const pesquisou = !!activeFilters;

  function handleSearch() {
    if (!searchInput.trim()) {
      toast({ title: "Erro", description: "Insira o nome ou BI do candidato.", variant: "destructive" });
      return;
    }
    setNotaExame("");
    setFase("idle");
    setActiveFilters({ search: searchInput.trim(), page: 1, limit: 1 });
  }

  function handlePrepararNota() {
    if (!candidato) return;
    const n = parseFloat(notaExame);
    if (!notaExame || isNaN(n) || n < 0 || n > 20) {
      toast({ title: "Erro", description: "Insira uma nota válida entre 0 e 20.", variant: "destructive" });
      return;
    }
    setFase("nota_preparada");
  }

function handleAdmitir() {
  if (!candidato) return;

  const n = parseFloat(notaExame);

  admitirCandidato(
    {
      id: candidato.numero_inscricao,
      payload: { nota: n },
    },
    {
      onSuccess: () => {
        setFase("lancado"); 
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
              <Link to="/"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Admitir Candidatura — Univ. Pública</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admitir Candidatura — Universidade Pública</h1>
        <p className="text-muted-foreground mt-1">
          Pesquise o candidato, lance a nota do exame e confirme a admissão.
        </p>
      </div>

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

      {/* Dados + Notas + Admissão */}
      {!isLoading && candidato && (
        <>
          {/* Dados do Candidato */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Dados do Candidato</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    fase === "nota_preparada"
                      ? "text-blue-600 border-blue-400 bg-blue-50"
                      : fase === "lancado"
                        ? "text-green-600 border-green-400 bg-green-50"
                        : "text-yellow-600 border-yellow-400 bg-yellow-50"
                  }
                >
                  {fase === "nota_preparada"
                    ? "Nota Preparada"
                    : fase === "lancado"
                      ? "Lançado"
                      : "Pendente de Nota"}
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
            </CardContent>
          </Card>

          {/* Nota do Exame — desaparece após preparar */}
          {fase === "idle" && (
            <Card>
              <CardHeader><CardTitle>Nota do Exame</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end max-w-sm">
                  <div className="flex-1 space-y-2">
                    <Label>Nota <span className="text-muted-foreground text-xs">(0 – 20)</span></Label>
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      step={0.1}
                      placeholder="Ex: 14.5"
                      value={notaExame}
                      onChange={(e) => setNotaExame(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handlePrepararNota}
                    variant="outline"
                    className="gap-2"
                    disabled={!notaExame}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Preparar Nota
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admitir — aparece só após nota preparada, substitui o card da nota */}
          {fase === "nota_preparada" && (
            <Card className="border-green-200 bg-green-50/40">
              <CardHeader>
                <CardTitle className="text-green-800">Admitir Candidatura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Nota <strong>{notaExame}</strong> preparada para{" "}
                  <strong>{candidato.nome}</strong>. Confirme abaixo para admitir
                  oficialmente ao curso de <strong>{candidato.curso}</strong>.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAdmitir}
                    className="gap-2 bg-green-700 hover:bg-green-800"
                    disabled={isSaving}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isSaving ? "A admitir..." : "Confirmar Admissão"}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    disabled={isSaving}
                    onClick={() => setFase("idle")}
                  >
                    <Pencil className="h-4 w-4" />
                    Corrigir Nota
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}