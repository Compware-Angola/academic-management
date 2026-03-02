import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, Plus, CheckCircle2, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { usePoloDropdown } from "@/hooks/shared/use-query-fetch-polo";
// import outros hooks que você precise (turmas, disciplinas, alunos, etc.)

export default function MarcarAssiduidade() {
  const { toast } = useToast();
  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: polos, isLoading: loadingPolo } = usePoloDropdown();

  // Filtros comuns / base (podem ser compartilhados ou separados por aba)
  const [filters, setFilters] = useState({
    anoLetivo: "",
    polo: "",
    turma: "",           // pode vir de outro hook
    disciplina: "",      // pode vir de outro hook
    data: "",            // formato YYYY-MM-DD
  });

  // Controla qual aba está ativa (útil para resetar filtros ou carregar dados diferentes)
  const [activeTab, setActiveTab] = useState<"normal" | "prova" | "campo">("normal");

  // Aqui você deve trazer as queries reais de acordo com o tipo
  // Por enquanto usando placeholders
  const isLoading = false; // substituir por isLoading real da query
  const assiduidades = []; // substituir por dados reais (array paginado)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // resetar página se houver paginação
  };

  const handleSearch = () => {
    toast({
      title: "Pesquisando...",
      description: `Filtros: ${JSON.stringify(filters)}`,
    });
    // chamar refetch / invalidate queries aqui
  };

  return (
    <div className="p-6 space-y-6">
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
            <BreadcrumbLink>Académico</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Marcar Assiduidade</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marcação de Assiduidade</h1>
          <p className="text-muted-foreground">
            Registo de presença  em aulas, provas e atividades de campo
          </p>
        </div>
    
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-3xl grid-cols-3 mb-6">
          <TabsTrigger value="normal" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Assiduidade Normal
          </TabsTrigger>
          <TabsTrigger value="prova" className="gap-2">
            <Calendar className="h-4 w-4" />
            Provas / Exames
          </TabsTrigger>
          <TabsTrigger value="campo" className="gap-2">
            <MapPin className="h-4 w-4" />
            Aulas de Campo
          </TabsTrigger>
        </TabsList>

        {/* Filtros comuns às 3 abas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-end flex-wrap">
              <div className="min-w-[220px]">
                <FormSelect
                  label="Ano Letivo"
                  value={filters.anoLetivo}
                  onChange={(v) => handleFilterChange("anoLetivo", v)}
                  options={anosAcademicos ?? []}
                  map={(a) => ({
                    key: String(a.codigo),
                    label: a.designacao,
                    value: String(a.codigo),
                  })}
                  disabled={isLoadingAcademicYear}
                  placeholder="Selecione o ano..."
                />
              </div>

              <div className="min-w-[220px]">
                <FormSelect
                  label="Polo / Campus"
                  value={filters.polo}
                  onChange={(v) => handleFilterChange("polo", v)}
                  options={polos ?? []}
                  map={(p) => ({
                    key: String(p.id),
                    label: p.designacao,
                    value: String(p.id),
                  })}
                  disabled={loadingPolo}
                  placeholder="Selecione o campus..."
                />
              </div>

              {/* Campos que você deve adaptar conforme suas entidades reais */}
          

           
              <div className="min-w-[180px]">
                <label className="text-sm font-medium">Data</label>
                <Input
                  type="date"
                  value={filters.data}
                  onChange={(e) => handleFilterChange("data", e.target.value)}
                />
              </div>

              <Button onClick={handleSearch} className="mt-6 md:mt-0">
                <Search className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo das abas */}
        <TabsContent value="normal">
          <AssiduidadeTable
            title="Aulas Normais / Diárias"
            data={assiduidades}
            isLoading={isLoading}
            type="normal"
          />
        </TabsContent>

        <TabsContent value="prova">
          <AssiduidadeTable
            title="Provas, Testes e Exames"
            data={assiduidades}
            isLoading={isLoading}
            type="prova"
          />
        </TabsContent>

        <TabsContent value="campo">
          <AssiduidadeTable
            title="Aulas de Campo"
            data={assiduidades}
            isLoading={isLoading}
            type="campo"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente auxiliar para evitar repetição (pode personalizar colunas por tipo)
function AssiduidadeTable({
  title,
  data,
  isLoading,
  type,
}: {
  title: string;
  data: any[];
  isLoading: boolean;
  type: "normal" | "prova" | "campo";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Docente</TableHead>
              {type === "prova" && <TableHead>Tipo de Prova</TableHead>}
              {type === "campo" && <TableHead>Local</TableHead>}
              <TableHead>Presentes</TableHead>
              <TableHead>Faltas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  A carregar registos...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.turma}</TableCell>
                  <TableCell>{item.disciplina}</TableCell>
                  <TableCell>{item.docente}</TableCell>
                  {type === "prova" && <TableCell>{item.tipoProva || "—"}</TableCell>}
                  {type === "campo" && <TableCell>{item.local || "—"}</TableCell>}
                  <TableCell className="text-green-600 font-medium">{item.presentes}</TableCell>
                  <TableCell className="text-red-600 font-medium">{item.faltas}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Ver / Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Aqui você coloca paginação quando implementar */}
      </CardContent>
    </Card>
  );
}