import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Download, RefreshCw, Printer, Check, X, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function PresenceList() {
  const [anoLectivo, setAnoLectivo] = useState("");
  const [semestre, setSemestre] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [curso, setCurso] = useState("");
  const [anoCurricular, setAnoCurricular] = useState("");
  const [unidadeCurricular, setUnidadeCurricular] = useState("");
  const [tipoAvaliacao, setTipoAvaliacao] = useState("");
  const [horario, setHorario] = useState("");
  const [situacaoFinanceira, setSituacaoFinanceira] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [estudantes, setEstudantes] = useState([
    { id: 1, numero: "2024001", nome: "Ana Maria Silva", curso: "Eng. Informática", situacaoFinanceira: "Regular", presente: false },
    { id: 2, numero: "2024002", nome: "Pedro João Santos", curso: "Eng. Informática", situacaoFinanceira: "Regular", presente: false },
    { id: 3, numero: "2024003", nome: "Maria Helena Costa", curso: "Eng. Informática", situacaoFinanceira: "Devedor", presente: false },
    { id: 4, numero: "2024004", nome: "Carlos Alberto Dias", curso: "Eng. Informática", situacaoFinanceira: "Regular", presente: false },
    { id: 5, numero: "2024005", nome: "Sofia Beatriz Lima", curso: "Eng. Informática", situacaoFinanceira: "Isento", presente: false },
    { id: 6, numero: "2024006", nome: "Bruno Miguel Ferreira", curso: "Eng. Informática", situacaoFinanceira: "Devedor", presente: false },
    { id: 7, numero: "2024007", nome: "Carla Patrícia Mendes", curso: "Eng. Informática", situacaoFinanceira: "Regular", presente: false },
    { id: 8, numero: "2024008", nome: "Ricardo José Alves", curso: "Eng. Informática", situacaoFinanceira: "Regular", presente: false },
  ]);

  const handleSearch = () => {
    if (!anoLectivo || !semestre || !curso || !unidadeCurricular || !tipoAvaliacao) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos Ano Lectivo, Semestre, Curso, UC e Tipo de Avaliação.",
        variant: "destructive",
      });
      return;
    }
    setShowResults(true);
    toast({
      title: "Pesquisa realizada",
      description: `Encontrados ${estudantes.length} estudantes inscritos.`,
    });
  };

  const handlePresencaChange = (estudanteId: number, presente: boolean) => {
    setEstudantes(prev => 
      prev.map(est => 
        est.id === estudanteId ? { ...est, presente } : est
      )
    );
  };

  const handleMarcarTodos = (presente: boolean) => {
    setEstudantes(prev => prev.map(est => ({ ...est, presente })));
  };

  const handleSavePresencas = () => {
    const presentes = estudantes.filter(e => e.presente).length;
    const ausentes = estudantes.filter(e => !e.presente).length;
    toast({
      title: "Presenças guardadas",
      description: `${presentes} presentes, ${ausentes} ausentes registados com sucesso.`,
    });
  };

  const getSituacaoFinanceiraBadge = (situacao: string) => {
    switch (situacao) {
      case "Regular":
        return <Badge variant="default" className="bg-green-600">Regular</Badge>;
      case "Devedor":
        return <Badge variant="destructive">Devedor</Badge>;
      case "Isento":
        return <Badge variant="secondary">Isento</Badge>;
      default:
        return <Badge variant="outline">{situacao}</Badge>;
    }
  };

  const totalPresentes = estudantes.filter(e => e.presente).length;
  const totalAusentes = estudantes.filter(e => !e.presente).length;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Avaliações</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Lista de Presença</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Lista de Presença</h1>
      <p className="text-muted-foreground">Gestão de presenças em avaliações académicas.</p>

      <Card>
        <CardHeader><CardTitle>Filtros de Pesquisa</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Lectivo *</label>
              <Select value={anoLectivo} onValueChange={setAnoLectivo}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre *</label>
              <Select value={semestre} onValueChange={setSemestre}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1º Semestre</SelectItem>
                  <SelectItem value="2">2º Semestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                  <SelectItem value="noite">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Curso *</label>
              <Select value={curso} onValueChange={setCurso}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng-informatica">Engenharia Informática</SelectItem>
                  <SelectItem value="direito">Direito</SelectItem>
                  <SelectItem value="medicina">Medicina</SelectItem>
                  <SelectItem value="economia">Economia</SelectItem>
                  <SelectItem value="gestao">Gestão de Empresas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select value={anoCurricular} onValueChange={setAnoCurricular}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">1º Ano</SelectItem>
                  <SelectItem value="2">2º Ano</SelectItem>
                  <SelectItem value="3">3º Ano</SelectItem>
                  <SelectItem value="4">4º Ano</SelectItem>
                  <SelectItem value="5">5º Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular *</label>
              <Select value={unidadeCurricular} onValueChange={setUnidadeCurricular}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prog1">Programação I</SelectItem>
                  <SelectItem value="prog2">Programação II</SelectItem>
                  <SelectItem value="bd">Base de Dados</SelectItem>
                  <SelectItem value="redes">Redes de Computadores</SelectItem>
                  <SelectItem value="so">Sistemas Operativos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Avaliação *</label>
              <Select value={tipoAvaliacao} onValueChange={setTipoAvaliacao}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="teste1">Teste 1</SelectItem>
                  <SelectItem value="teste2">Teste 2</SelectItem>
                  <SelectItem value="exame">Exame Normal</SelectItem>
                  <SelectItem value="recurso">Exame de Recurso</SelectItem>
                  <SelectItem value="especial">Época Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Horário</label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="08-10">08:00 - 10:00</SelectItem>
                  <SelectItem value="10-12">10:00 - 12:00</SelectItem>
                  <SelectItem value="14-16">14:00 - 16:00</SelectItem>
                  <SelectItem value="16-18">16:00 - 18:00</SelectItem>
                  <SelectItem value="18-20">18:00 - 20:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Situação Financeira</label>
              <Select value={situacaoFinanceira} onValueChange={setSituacaoFinanceira}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="devedor">Devedor</SelectItem>
                  <SelectItem value="isento">Isento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full gap-2">
                <Search className="h-4 w-4" />Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => handleMarcarTodos(true)}>
                <Check className="h-4 w-4" />Marcar Todos Presente
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => handleMarcarTodos(false)}>
                <X className="h-4 w-4" />Desmarcar Todos
              </Button>
              <Button className="gap-2" onClick={handleSavePresencas}>
                <Save className="h-4 w-4" />Guardar Presenças
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" />Atualizar</Button>
              <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Excel</Button>
              <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Imprimir</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{estudantes.length}</div>
                <p className="text-sm text-muted-foreground">Total Inscritos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{totalPresentes}</div>
                <p className="text-sm text-muted-foreground">Presentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-destructive">{totalAusentes}</div>
                <p className="text-sm text-muted-foreground">Ausentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  {estudantes.length > 0 ? Math.round((totalPresentes / estudantes.length) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Taxa de Presença</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Estudantes - Programação I - Teste 1</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Presente</TableHead>
                    <TableHead>Nº Estudante</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Situação Financeira</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudantes.map((estudante) => (
                    <TableRow key={estudante.id}>
                      <TableCell>
                        <Checkbox
                          checked={estudante.presente}
                          onCheckedChange={(checked) => handlePresencaChange(estudante.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono">{estudante.numero}</TableCell>
                      <TableCell>{estudante.nome}</TableCell>
                      <TableCell>{estudante.curso}</TableCell>
                      <TableCell>{getSituacaoFinanceiraBadge(estudante.situacaoFinanceira)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
