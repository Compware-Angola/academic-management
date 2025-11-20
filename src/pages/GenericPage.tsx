import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { FilterBar } from "@/components/common/FilterBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, Printer, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { menuStructure } from "@/config/menuStructure";

export default function GenericPage() {
  const location = useLocation();
  
  // Find the page title from menu structure
  const getPageInfo = () => {
    for (const item of menuStructure) {
      if (item.children) {
        const child = item.children.find((c) => c.path === location.pathname);
        if (child) {
          return { title: child.title, parent: item.title };
        }
      }
    }
    return { title: "Página", parent: "Portal" };
  };

  const pageInfo = getPageInfo();

  // Sample data for demonstration
  const sampleColumns = [
    { header: "ID", accessor: "id" },
    { header: "Nome", accessor: "nome" },
    { header: "Curso", accessor: "curso" },
    { header: "Estado", accessor: "estado" },
    {
      header: "Ações",
      accessor: "actions",
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Ver</Button>
          <Button variant="outline" size="sm">Editar</Button>
        </div>
      ),
    },
  ];

  const sampleData = [
    { id: "001", nome: "João Silva", curso: "Engenharia Informática", estado: "Ativo" },
    { id: "002", nome: "Maria Santos", curso: "Gestão de Empresas", estado: "Ativo" },
    { id: "003", nome: "Pedro Costa", curso: "Arquitetura", estado: "Inativo" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageInfo.title}
        subtitle={`${pageInfo.parent} / ${pageInfo.title}`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </>
        }
      />

      <FilterBar>
        <div className="space-y-2">
          <Label htmlFor="search">Pesquisar</Label>
          <Input id="search" placeholder="Nome, código..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="curso">Curso</Label>
          <Select>
            <SelectTrigger id="curso">
              <SelectValue placeholder="Todos os cursos" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Todos os cursos</SelectItem>
              <SelectItem value="eng">Engenharia Informática</SelectItem>
              <SelectItem value="ges">Gestão de Empresas</SelectItem>
              <SelectItem value="arq">Arquitetura</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select>
            <SelectTrigger id="estado">
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Todos os estados</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="periodo">Período</Label>
          <Select>
            <SelectTrigger id="periodo">
              <SelectValue placeholder="Selecionar período" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="2024-1">2024 - 1º Semestre</SelectItem>
              <SelectItem value="2024-2">2024 - 2º Semestre</SelectItem>
              <SelectItem value="2025-1">2025 - 1º Semestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      <DataTable
        columns={sampleColumns}
        data={sampleData}
        currentPage={1}
        totalPages={3}
      />
    </div>
  );
}
