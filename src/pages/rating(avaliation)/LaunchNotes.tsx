import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Download, Printer, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function LaunchNotes() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data específico para lançamento de notas
  const mockStudents = [
    { id: "EST001", numero: "20230001", nome: "João Silva", teste1: "", teste2: "", exame: "", recurso: "", oral: "", notaFinal: "" },
    { id: "EST002", numero: "20230002", nome: "Maria Santos", teste1: "15.5", teste2: "16.0", exame: "", recurso: "", oral: "", notaFinal: "" },
    { id: "EST003", numero: "20230003", nome: "Pedro Costa", teste1: "12.0", teste2: "13.5", exame: "", recurso: "", oral: "", notaFinal: "" },
    { id: "EST004", numero: "20230004", nome: "Ana Ferreira", teste1: "17.0", teste2: "18.5", exame: "", recurso: "", oral: "", notaFinal: "" },
    { id: "EST005", numero: "20230005", nome: "Carlos Mendes", teste1: "14.0", teste2: "15.0", exame: "", recurso: "", oral: "", notaFinal: "" },
  ];

  const [students, setStudents] = useState(mockStudents);

  const handleNotaChange = (id: string, field: string, value: string) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, [field]: value } : student
    ));
  };

  const handleSaveAll = () => {
    toast({
      title: "Notas guardadas",
      description: "Todas as notas foram guardadas com sucesso.",
    });
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Avaliações</span>
        <span>/</span>
        <span className="text-foreground">Lançamento de notas</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lançamento de notas</h1>
          <p className="text-muted-foreground mt-1">Lançar notas de avaliações por UC e turma</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar lista
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button size="sm" onClick={handleSaveAll}>
            <Save className="h-4 w-4 mr-2" />
            Guardar todas
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ano-letivo">Ano Letivo</Label>
            <Select defaultValue="2024-2025">
              <SelectTrigger id="ano-letivo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024/2025</SelectItem>
                <SelectItem value="2023-2024">2023/2024</SelectItem>
                <SelectItem value="2022-2023">2022/2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semestre">Semestre</Label>
            <Select defaultValue="1">
              <SelectTrigger id="semestre">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1º Semestre</SelectItem>
                <SelectItem value="2">2º Semestre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="curso">Curso</Label>
            <Select defaultValue="eng-info">
              <SelectTrigger id="curso">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eng-info">Engenharia Informática</SelectItem>
                <SelectItem value="gestao">Gestão de Empresas</SelectItem>
                <SelectItem value="arquitetura">Arquitetura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="turma">Turma</Label>
            <Select defaultValue="ei-3a">
              <SelectTrigger id="turma">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ei-3a">EI-3A</SelectItem>
                <SelectItem value="ei-3b">EI-3B</SelectItem>
                <SelectItem value="ei-4a">EI-4A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uc">Unidade Curricular</Label>
            <Select defaultValue="prog3">
              <SelectTrigger id="uc">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prog3">Programação III</SelectItem>
                <SelectItem value="bd">Bases de Dados</SelectItem>
                <SelectItem value="ia">Inteligência Artificial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo-avaliacao">Tipo de Avaliação</Label>
            <Select defaultValue="teste">
              <SelectTrigger id="tipo-avaliacao">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teste">Teste</SelectItem>
                <SelectItem value="exame">Exame</SelectItem>
                <SelectItem value="recurso">Recurso</SelectItem>
                <SelectItem value="oral">Oral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Informação da UC selecionada */}
      <div className="bg-muted/50 border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">UC:</span>
            <span className="ml-2 font-semibold">Programação III</span>
          </div>
          <div>
            <span className="text-muted-foreground">Turma:</span>
            <span className="ml-2 font-semibold">EI-3A</span>
          </div>
          <div>
            <span className="text-muted-foreground">Inscritos:</span>
            <span className="ml-2 font-semibold">5 estudantes</span>
          </div>
          <div>
            <span className="text-muted-foreground">Docente:</span>
            <span className="ml-2 font-semibold">Prof. Dr. António Sousa</span>
          </div>
        </div>
      </div>

      {/* Tabela de lançamento */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground">Selecione os filtros acima para carregar estudantes</p>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Número</TableHead>
                    <TableHead>Nome do Estudante</TableHead>
                    <TableHead className="text-center w-[100px]">Teste 1</TableHead>
                    <TableHead className="text-center w-[100px]">Teste 2</TableHead>
                    <TableHead className="text-center w-[100px]">Exame</TableHead>
                    <TableHead className="text-center w-[100px]">Recurso</TableHead>
                    <TableHead className="text-center w-[100px]">Oral</TableHead>
                    <TableHead className="text-center w-[100px]">Nota Final</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-sm">{student.numero}</TableCell>
                      <TableCell className="font-medium">{student.nome}</TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={student.teste1}
                          onChange={(e) => handleNotaChange(student.id, 'teste1', e.target.value)}
                          className="w-20 text-center mx-auto"
                          placeholder="0-20"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={student.teste2}
                          onChange={(e) => handleNotaChange(student.id, 'teste2', e.target.value)}
                          className="w-20 text-center mx-auto"
                          placeholder="0-20"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={student.exame}
                          onChange={(e) => handleNotaChange(student.id, 'exame', e.target.value)}
                          className="w-20 text-center mx-auto"
                          placeholder="0-20"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={student.recurso}
                          onChange={(e) => handleNotaChange(student.id, 'recurso', e.target.value)}
                          className="w-20 text-center mx-auto"
                          placeholder="0-20"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={student.oral}
                          onChange={(e) => handleNotaChange(student.id, 'oral', e.target.value)}
                          className="w-20 text-center mx-auto"
                          placeholder="0-20"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-lg">
                          {student.notaFinal || "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">Itens por página:</Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger id="items-per-page" className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, students.length)} de {students.length} registos
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
