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
import { Home, Search, Printer, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";

import { useResultadoProva } from "@/hooks/access_exam/use-resultado-prova";
import { ResultadoProva } from "@/services/access_exam/fetch-resultado-prova.service";



export default function ConsultarProva() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState<string>("");

 
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

  const candidato: ResultadoProva | null = data?.data?.[0] ?? null;
  const pesquisou = !!activeSearch;


  const pdfData = candidato
    ? {
        filtros: `Pesquisa: ${activeSearch}`,
        total: 1,
        rows: [
          {
            numeroInscricao: candidato.numero_inscricao,
            nome: candidato.nome,
            numeroBilhete: candidato.numero_bilhete,
            curso: candidato.curso,
            faculdade: candidato.faculdade || "",
            periodo: candidato.periodo,
            sala: candidato.sala || "",
            dataRealizacao: candidato.data_realizacao || "",
            nota: candidato.nota,
            resultado: candidato.resultado === 1 ? "Admitido" : "Reprovado",
          },
        ],
      }
    : null;

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Resultado Individual - Exame de Acesso"
      subtitle="Consulta de Prova"
      infoSections={[
        { title: "Pesquisa Realizada", content: pdfData.filtros },
        { title: "Resumo", content: [`Candidato: ${candidato?.nome}`] },
      ]}
      mainTable={{
        headers: [
          { key: "numeroInscricao", label: "Nº Inscrição", width: "15%" },
          { key: "nome", label: "Nome", width: "25%" },
          { key: "numeroBilhete", label: "BI", width: "15%" },
          { key: "curso", label: "Curso", width: "20%" },
          { key: "periodo", label: "Período", width: "10%" },
          { key: "nota", label: "Nota", width: "8%" },
          { key: "resultado", label: "Resultado", width: "12%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  function handleSearch() {
    if (!searchInput.trim()) {
      toast({
        title: "Erro",
        description: "Insira o nome ou BI do candidato.",
        variant: "destructive",
      });
      return;
    }


    setActiveSearch(searchInput.trim());
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
            <BreadcrumbPage>Consultar Prova Individual</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Consultar Prova — Exame de Acesso</h1>
        <p className="text-muted-foreground mt-1">
          Pesquise pelo nome ou BI do candidato para consultar o resultado da prova.
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
              Nenhum candidato encontrado para "<strong>{activeSearch}</strong>".
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resultado Encontrado */}
      {!isLoading && candidato && (
      <Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Resultado da Prova</CardTitle>
      <div className="flex gap-2">
        {pdfContent && (
          <PDFActions
            document={pdfContent}
            fileName={`Prova_${candidato.numero_inscricao}_${new Date().toISOString().slice(0, 10)}.pdf`}
            showDownload
            showPrint
          />
        )}
      </div>
    </div>
  </CardHeader>
<CardContent className="pt-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">

    {/* Informações Pessoais */}
    <div>
      <Label className="text-muted-foreground">Nº de Inscrição</Label>
      <p className="font-mono font-semibold text-lg mt-1">{candidato.numero_inscricao}</p>
    </div>
    <div>
      <Label className="text-muted-foreground">Nome Completo</Label>
      <p className="font-medium text-lg mt-1">{candidato.nome}</p>
    </div>
    <div>
      <Label className="text-muted-foreground">Bilhete de Identidade</Label>
      <p className="font-mono mt-1">{candidato.numero_bilhete}</p>
    </div>

    {/* Informações Acadêmicas */}
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

    {/* Nota */}
    <div>
      <Label className="text-muted-foreground">Nota Obtida</Label>
      <div className="mt-2">
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
      </div>
    </div>

    {/* Resultado Final - Span completo */}
    <div className="lg:col-span-3 pt-6 border-t">
      <Label className="text-muted-foreground">Resultado Final</Label>
      <div className="mt-3">
        <Badge
          className={`text-lg px-10 py-2.5 font-medium ${
            candidato.resultado === 1 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {candidato.resultado === 1 ? "ADMITIDO" : " REPROVADO"}
        </Badge>
      </div>
    </div>

  </div>
</CardContent>
</Card>
      )}
    </div>
  );
}