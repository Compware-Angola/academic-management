import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Download, Printer, Save, ChevronLeft, ChevronRight, Unlock, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryNoteReleases } from "@/hooks/avaliacao/use-query-note-release";

export default function LaunchNotes() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Hook que busca dados da API
  const { data: students = [], isLoading } = useQueryNoteReleases({
        anoLectivoId: 21,
        gradeCurricularId: 346,
        tipoProvaId: 1,
        tipoAvaliacao: 2,
        classe: 2,
      });

  // Total de páginas
  const totalPages = Math.ceil(students.length / itemsPerPage);

  // Função para atualizar nota ou descrição no estado local
  const [localStudents, setLocalStudents] = useState(students);

  React.useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  const handleNotaChange = (id: number, field: "notaFinal" | "descricao", value: string) => {
    setLocalStudents((prev) =>
      prev.map((s) => (s.codigo_grade_aluno === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveAll = () => {
    toast({
      title: "Notas guardadas",
      description: "Todas as notas foram guardadas com sucesso.",
    });
    // Aqui podes adicionar chamada à API para salvar todas
  };

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
          <Button variant="outline" size="sm">
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

      {/* Filtros (não conectados à API neste exemplo) */}
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
          {/* Outras opções de filtro */}
        </div>
      </div>

      {/* Tabela de lançamento */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : localStudents.length === 0 ? (
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
                    <TableHead className="w-[120px]">Nº Matrícula</TableHead>
                    <TableHead>Nome do Estudante</TableHead>
                    <TableHead className="w-[600px] text-center">Descrição</TableHead>
                    <TableHead className="w-[140px] text-center">Nota (0-20)</TableHead>
                    <TableHead className="w-[140px] text-center">Estado</TableHead>
                    <TableHead className="w-[120px] text-center">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localStudents
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((student) => {
                      const hasNota = student.nota !== null && student.nota !== undefined;
                      const isValid = hasNota && Number(student.nota) >= 0 && Number(student.nota) <= 20;
                      const [isLocked, setIsLocked] = React.useState(true);

                      return (
                        <TableRow key={student.codigo_grade_aluno}>
                          <TableCell className="font-mono text-sm">{student.numero_de_matricula}</TableCell>
                          <TableCell className="font-medium">{student.nome_completo}</TableCell>

                          {/* Descrição */}
                          <TableCell className="text-center">
                            <Input
                              type="text"
                              value={student.observacao || ""}
                              onChange={(e) => handleNotaChange(student.codigo_grade_aluno, "descricao", e.target.value)}
                              className="w-full mx-auto text-left"
                              placeholder="Pequena descrição..."
                              disabled={isLocked}
                            />
                          </TableCell>

                          {/* Nota */}
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={student.nota ?? ""}
                              onChange={(e) => handleNotaChange(student.codigo_grade_aluno, "notaFinal", e.target.value)}
                              className="w-24 mx-auto text-center"
                              placeholder="0-20"
                              disabled={isLocked}
                            />
                          </TableCell>

                          {/* Estado */}
                          <TableCell className="text-center">
                            {!hasNota ? (
                              <Badge variant="secondary">Pendente</Badge>
                            ) : isValid ? (
                              <Badge variant="default" className="bg-green-600">
                                Lançada
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Inválida</Badge>
                            )}
                          </TableCell>

                          {/* Ação */}
                          <TableCell className="text-center flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsLocked(!isLocked)}
                            >
                              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </Button>

                            <Button
                              size="sm"
                              variant={hasNota ? "default" : "outline"}
                              onClick={() => {
                                if (student.nota === null || student.nota === undefined) {
                                  toast({ title: "Erro", description: "Insira uma nota primeiro", variant: "destructive" });
                                  return;
                                }
                                if (Number(student.nota) < 0 || Number(student.nota) > 20) {
                                  toast({ title: "Erro", description: "A nota deve estar entre 0 e 20", variant: "destructive" });
                                  return;
                                }
                                toast({
                                  title: hasNota ? "Nota atualizada" : "Nota lançada",
                                  description: `${student.nome_completo} → ${student.nota} valores`,
                                });
                                setIsLocked(true);
                              }}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              {hasNota ? "Atualizar" : "Lançar"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, localStudents.length)} de {localStudents.length} registos
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
