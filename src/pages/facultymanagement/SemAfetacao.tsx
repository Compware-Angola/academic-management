import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus, Eye, AlertTriangle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SemAfetacao = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departamento, setDepartamento] = useState("all");
  const [categoria, setCategoria] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const mockData = [
    { id: 1, codigo: "DOC015", nome: "Prof. Dr. Alberto Santos", departamento: "Matemática", categoria: "Professor Auxiliar", grauAcademico: "Doutorado", especialidade: "Análise Matemática", disponibilidade: "Disponível" },
    { id: 2, codigo: "DOC023", nome: "Prof.ª MSc. Teresa Costa", departamento: "Física", categoria: "Assistente", grauAcademico: "Mestrado", especialidade: "Física Quântica", disponibilidade: "Disponível" },
    { id: 3, codigo: "DOC031", nome: "Prof. Lic. Manuel José", departamento: "Química", categoria: "Monitor", grauAcademico: "Licenciatura", especialidade: "Química Orgânica", disponibilidade: "Parcialmente Disponível" },
    { id: 4, codigo: "DOC042", nome: "Prof. Dr. Sérgio Manuel", departamento: "Biologia", categoria: "Professor Auxiliar", grauAcademico: "Doutorado", especialidade: "Genética", disponibilidade: "Disponível" },
    { id: 5, codigo: "DOC056", nome: "Prof.ª MSc. Paula Ferreira", departamento: "Engenharia", categoria: "Assistente", grauAcademico: "Mestrado", especialidade: "Eng. Eletrotécnica", disponibilidade: "Disponível" },
  ];

  const getDisponibilidadeBadge = (disponibilidade: string) => {
    const variants = {
      "Disponível": "default",
      "Parcialmente Disponível": "secondary",
      "Indisponível": "destructive",
    };
    return <Badge variant={variants[disponibilidade as keyof typeof variants] as any}>{disponibilidade}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gestao-docentes">Gestão de Docentes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sem Afetação</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">Docentes Sem Afetação</h1>

      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-secondary mt-0.5" />
        <div>
          <h3 className="font-semibold text-secondary mb-1">{mockData.length} docentes sem afetação</h3>
          <p className="text-sm text-muted-foreground">Estes docentes estão disponíveis para serem afetados a unidades curriculares.</p>
        </div>
      </div>

      <PageHeader title="Sem Afetação" />

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Pesquisar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={departamento} onValueChange={setDepartamento}>
            <SelectTrigger>
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Departamentos</SelectItem>
              <SelectItem value="matematica">Matemática</SelectItem>
              <SelectItem value="fisica">Física</SelectItem>
              <SelectItem value="quimica">Química</SelectItem>
              <SelectItem value="biologia">Biologia</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="catedratico">Professor Catedrático</SelectItem>
              <SelectItem value="auxiliar">Professor Auxiliar</SelectItem>
              <SelectItem value="assistente">Assistente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default">Filtrar</Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Grau Académico</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : mockData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum docente sem afetação encontrado
                </TableCell>
              </TableRow>
            ) : (
              mockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.codigo}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell>{item.departamento}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{item.grauAcademico}</TableCell>
                  <TableCell>{item.especialidade}</TableCell>
                  <TableCell>{getDisponibilidadeBadge(item.disponibilidade)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                      <Button variant="default" size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Afetar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar</span>
          <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">registos por página</span>
        </div>
      </div>
    </div>
  );
};

export default SemAfetacao;
