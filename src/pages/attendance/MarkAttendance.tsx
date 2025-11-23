import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Download, Printer, Save, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function MarkAttendance() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data específico para assiduidade
  const mockStudents = [
    { id: "EST001", numero: "20230001", nome: "João Silva", presente: true, justificada: false, observacoes: "" },
    { id: "EST002", numero: "20230002", nome: "Maria Santos", presente: true, justificada: false, observacoes: "" },
    { id: "EST003", numero: "20230003", nome: "Pedro Costa", presente: false, justificada: true, observacoes: "Atestado médico" },
    { id: "EST004", numero: "20230004", nome: "Ana Ferreira", presente: true, justificada: false, observacoes: "" },
    { id: "EST005", numero: "20230005", nome: "Carlos Mendes", presente: false, justificada: false, observacoes: "" },
    { id: "EST006", numero: "20230006", nome: "Sofia Oliveira", presente: true, justificada: false, observacoes: "" },
  ];

  const [students, setStudents] = useState(mockStudents);

  const handlePresenceChange = (id: string, presente: boolean) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, presente } : student
    ));
  };

  const handleJustifiedChange = (id: string, justificada: boolean) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, justificada } : student
    ));
  };

  const handleObservationChange = (id: string, observacoes: string) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, observacoes } : student
    ));
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Assiduidade guardada",
      description: "As presenças foram registadas com sucesso.",
    });
  };

  const presentCount = students.filter(s => s.presente).length;
  const absentCount = students.filter(s => !s.presente).length;
  const justifiedCount = students.filter(s => !s.presente && s.justificada).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Assiduidade</span>
        <span>/</span>
        <span className="text-foreground">Marcar assiduidade</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marcar assiduidade</h1>
          <p className="text-muted-foreground mt-1">Registar presenças e faltas de aulas</p>
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
          <Button size="sm" onClick={handleSaveAttendance}>
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Filtros e informação da aula */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Informação da Aula</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input type="date" id="data" defaultValue={new Date().toISOString().split('T')[0]} />
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
            <Label htmlFor="hora-inicio">Hora Início</Label>
            <Input type="time" id="hora-inicio" defaultValue="08:00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora-fim">Hora Fim</Label>
            <Input type="time" id="hora-fim" defaultValue="10:00" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sala">Sala</Label>
            <Select defaultValue="lab1">
              <SelectTrigger id="sala">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab1">Laboratório 1</SelectItem>
                <SelectItem value="lab2">Laboratório 2</SelectItem>
                <SelectItem value="sala101">Sala 101</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo-aula">Tipo de Aula</Label>
            <Select defaultValue="teorica">
              <SelectTrigger id="tipo-aula">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teorica">Teórica</SelectItem>
                <SelectItem value="pratica">Prática (PL)</SelectItem>
                <SelectItem value="laboratorio">Laboratório</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total de Estudantes</p>
          <p className="text-3xl font-bold">{students.length}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Presentes</p>
          <p className="text-3xl font-bold text-success">{presentCount}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Faltas</p>
          <p className="text-3xl font-bold text-destructive">{absentCount}</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Faltas Justificadas</p>
          <p className="text-3xl font-bold text-warning">{justifiedCount}</p>
        </div>
      </div>

      {/* Tabela de assiduidade */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground">Selecione a aula acima para carregar estudantes</p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Número</TableHead>
                  <TableHead>Nome do Estudante</TableHead>
                  <TableHead className="text-center w-[120px]">Presente</TableHead>
                  <TableHead className="text-center w-[120px]">Justificada</TableHead>
                  <TableHead className="w-[120px]">Estado</TableHead>
                  <TableHead>Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-sm">{student.numero}</TableCell>
                    <TableCell className="font-medium">{student.nome}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={student.presente}
                          onCheckedChange={(checked) => handlePresenceChange(student.id, checked as boolean)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={student.justificada}
                          disabled={student.presente}
                          onCheckedChange={(checked) => handleJustifiedChange(student.id, checked as boolean)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.presente ? (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Presente
                        </Badge>
                      ) : student.justificada ? (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          Justificada
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                          Falta
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        value={student.observacoes}
                        onChange={(e) => handleObservationChange(student.id, e.target.value)}
                        placeholder="Observações..."
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
