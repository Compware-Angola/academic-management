import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Home,
  User,
  GraduationCap,
  CreditCard,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useStudentDetail } from "@/hooks/tudents/use-query-students";

// Mock data for a complete student profile
const mockEstudante = {
  // Dados Pessoais
  matricula: "20210001",
  nome: "João Manuel Silva Costa",
  nomePai: "Manuel António Costa",
  nomeMae: "Maria Fernanda Silva",
  dataNascimento: "1998-05-15",
  nacionalidade: "Angolana",
  naturalidade: "Luanda",
  genero: "Masculino",
  estadoCivil: "Solteiro",
  bi: "005123456LA042",
  nif: "123456789",
  foto: "/placeholder.svg",
  
  // Contactos
  telefone: "+244 923 456 789",
  email: "joao.costa@email.com",
  emailInstitucional: "joao.costa@universidade.ao",
  endereco: "Rua da Liberdade, Nº 45, Maianga",
  cidade: "Luanda",
  provincia: "Luanda",
  
  // Dados Académicos
  curso: "Engenharia Informática",
  faculdade: "Faculdade de Engenharia",
  departamento: "Ciências da Computação",
  grau: "Licenciatura",
  regime: "Diurno",
  turma: "EI-2021-A",
  anoIngresso: 2021,
  anoCurricular: 4,
  semestre: "1º Semestre",
  mediaGeral: 14.5,
  creditosObtidos: 180,
  creditosTotais: 240,
  estado: "Activo",
  
  // Dados Financeiros
  saldoDevedor: 45000,
  mensalidadesEmDia: false,
  ultimoPagamento: "2025-12-15",
  valorMensalidade: 25000,
  desconto: 10,
  tipoPagamento: "Mensal",
  bolseiro: false,
};

const mockDisciplinas = [
  { codigo: "INF401", nome: "Inteligência Artificial", creditos: 6, nota: 16, estado: "Aprovado", ano: 4 },
  { codigo: "INF402", nome: "Sistemas Distribuídos", creditos: 6, nota: 14, estado: "Aprovado", ano: 4 },
  { codigo: "INF403", nome: "Segurança Informática", creditos: 5, nota: null, estado: "Em Curso", ano: 4 },
  { codigo: "INF404", nome: "Projecto Final", creditos: 12, nota: null, estado: "Em Curso", ano: 4 },
  { codigo: "INF301", nome: "Base de Dados II", creditos: 6, nota: 15, estado: "Aprovado", ano: 3 },
  { codigo: "INF302", nome: "Redes de Computadores", creditos: 6, nota: 13, estado: "Aprovado", ano: 3 },
  { codigo: "INF303", nome: "Engenharia de Software", creditos: 6, nota: 17, estado: "Aprovado", ano: 3 },
];

const mockPagamentos = [
  { id: 1, referencia: "REF-2025-001", descricao: "Mensalidade Janeiro 2026", valor: 25000, data: "2025-01-10", estado: "Pago" },
  { id: 2, referencia: "REF-2025-002", descricao: "Mensalidade Dezembro 2025", valor: 25000, data: "2025-12-15", estado: "Pago" },
  { id: 3, referencia: "REF-2025-003", descricao: "Mensalidade Novembro 2025", valor: 25000, data: "2025-11-08", estado: "Pago" },
  { id: 4, referencia: "REF-2025-004", descricao: "Mensalidade Outubro 2025", valor: 25000, data: null, estado: "Pendente" },
  { id: 5, referencia: "REF-2025-005", descricao: "Propinas 2024/2025", valor: 15000, data: "2024-10-01", estado: "Pago" },
];

const mockDocumentos = [
  { id: 1, tipo: "Declaração de Matrícula", dataEmissao: "2025-09-01", estado: "Disponível" },
  { id: 2, tipo: "Histórico Escolar", dataEmissao: "2025-08-15", estado: "Disponível" },
  { id: 3, tipo: "Certidão de Notas", dataEmissao: null, estado: "Pendente" },
  { id: 4, tipo: "Comprovativo de Pagamento", dataEmissao: "2025-12-15", estado: "Disponível" },
];

const mockAssiduidade = [
  { disciplina: "Inteligência Artificial", presencas: 28, total: 30, percentagem: 93 },
  { disciplina: "Sistemas Distribuídos", presencas: 25, total: 30, percentagem: 83 },
  { disciplina: "Segurança Informática", presencas: 12, total: 15, percentagem: 80 },
  { disciplina: "Projecto Final", presencas: 8, total: 10, percentagem: 80 },
];

export default function PerfilEstudante() {
  const { matricula } = useParams<{ matricula: string }>();
  const [activeTab, setActiveTab] = useState("geral");
  
  // In a real app, you would fetch the student data based on matricula
    const {
      data: student,
      isLoading,
      isFetching,
      error
    } = useStudentDetail(matricula);


     if (!matricula) {
    return <div>Matrícula inválida</div>;
  }

  if (isLoading || isFetching) {
    return <div>A carregar dados do estudante...</div>;
  }

  if (error || !student) {
    return <div>Estudante não encontrado</div>;
  }

  const estudante = mockEstudante;
  
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-500 hover:bg-green-600">Activo</Badge>;
      case "Inactivo":
        return <Badge variant="destructive">Inactivo</Badge>;
      case "Suspenso":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Suspenso</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };
  
  const getPagamentoEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pago":
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Pago</Badge>;
      case "Pendente":
        return <Badge variant="destructive"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Estudantes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Perfil do Estudante</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with student info */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={estudante.foto} alt={student.nome_completo} />
                <AvatarFallback className="text-3xl">{student?.nome_completo?.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl font-bold">{student.nome_completo}</h1>
                  {getEstadoBadge(student.estado)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span><strong>Matrícula:</strong> {student.codigo_matricula}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span><strong>Curso:</strong> {student.curso}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span><strong>Ano:</strong> {estudante.anoCurricular}º Ano</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{student.telefonicos || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{student.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{estudante.cidade}, {estudante.provincia}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:w-80">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{estudante.mediaGeral}</p>
              <p className="text-xs text-muted-foreground">Média Geral</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{estudante.creditosObtidos}/{estudante.creditosTotais}</p>
              <p className="text-xs text-muted-foreground">Créditos</p>
            </CardContent>
          </Card>
          <Card className={estudante.saldoDevedor > 0 ? "border-destructive" : ""}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${estudante.saldoDevedor > 0 ? 'text-destructive' : 'text-green-500'}`}>
                {estudante.saldoDevedor.toLocaleString()} Kz
              </p>
              <p className="text-xs text-muted-foreground">Saldo Devedor</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Progress value={(estudante.creditosObtidos / estudante.creditosTotais) * 100} className="mb-2" />
              <p className="text-xs text-muted-foreground">{Math.round((estudante.creditosObtidos / estudante.creditosTotais) * 100)}% Concluído</p>
            </CardContent>
          </Card>
        </div>
      </div>

 

      {/* Tabs with detailed information */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
          <TabsTrigger value="geral" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Dados Gerais</span>
            <span className="md:hidden">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="academico" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden md:inline">Académico</span>
            <span className="md:hidden">Acad.</span>
          </TabsTrigger>
          <TabsTrigger value="disciplinas" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Disciplinas</span>
            <span className="md:hidden">Disc.</span>
          </TabsTrigger>
          <TabsTrigger value="financas" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Finanças</span>
            <span className="md:hidden">Fin.</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Documentos</span>
            <span className="md:hidden">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="assiduidade" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Assiduidade</span>
            <span className="md:hidden">Assid.</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Dados Gerais */}
        <TabsContent value="geral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Nome Completo:</span>
                  <span className="font-medium">{student.nome_completo}</span>
                  
                  <span className="text-muted-foreground">Nome do Pai:</span>
                  <span className="font-medium">{student.pai}</span>
                  
                  <span className="text-muted-foreground">Nome da Mãe:</span>
                  <span className="font-medium">{student.mae}</span>
                  
                  <span className="text-muted-foreground">Data de Nascimento:</span>
                  <span className="font-medium">{new Date(student.data_nascimento).toLocaleDateString('pt-AO')}</span>
                  
                  <span className="text-muted-foreground">Nacionalidade:</span>
                  <span className="font-medium">{student.nacionalidade}</span>
                  
                  <span className="text-muted-foreground">Naturalidade:</span>
                  <span className="font-medium">{student.naturalidade}</span>
                  
                  <span className="text-muted-foreground">Género:</span>
                  <span className="font-medium">{student.sexo}</span>
                  
                  <span className="text-muted-foreground">Estado Civil:</span>
                  <span className="font-medium">{student.estado_civil}</span>
                  
                  <span className="text-muted-foreground">BI:</span>
                  <span className="font-medium">{student.bi}</span>
                  
             
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contactos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-medium">{student.telefonicos}</span>
                  
                  <span className="text-muted-foreground">Email Pessoal:</span>
                  <span className="font-medium">{student.email}</span>
                  
                
                  
                  <span className="text-muted-foreground">Endereço:</span>
                  <span className="font-medium">{estudante.endereco}</span>
                  
                  <span className="text-muted-foreground">Cidade:</span>
                  <span className="font-medium">{estudante.cidade}</span>
                  
                  <span className="text-muted-foreground">Província:</span>
                  <span className="font-medium">{estudante.provincia}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Académico */}
        <TabsContent value="academico" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informação do Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Curso:</span>
                  <span className="font-medium">{estudante.curso}</span>
                  
                  <span className="text-muted-foreground">Faculdade:</span>
                  <span className="font-medium">{estudante.faculdade}</span>
                  
                  <span className="text-muted-foreground">Departamento:</span>
                  <span className="font-medium">{estudante.departamento}</span>
                  
                  <span className="text-muted-foreground">Grau:</span>
                  <span className="font-medium">{estudante.grau}</span>
                  
                  <span className="text-muted-foreground">Regime:</span>
                  <span className="font-medium">{estudante.regime}</span>
                  
                  <span className="text-muted-foreground">Turma:</span>
                  <span className="font-medium">{estudante.turma}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progresso Académico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Ano de Ingresso:</span>
                  <span className="font-medium">{estudante.anoIngresso}</span>
                  
                  <span className="text-muted-foreground">Ano Curricular:</span>
                  <span className="font-medium">{estudante.anoCurricular}º Ano</span>
                  
                  <span className="text-muted-foreground">Semestre Atual:</span>
                  <span className="font-medium">{estudante.semestre}</span>
                  
                  <span className="text-muted-foreground">Média Geral:</span>
                  <span className="font-medium text-primary text-lg">{estudante.mediaGeral}</span>
                  
                  <span className="text-muted-foreground">Créditos Obtidos:</span>
                  <span className="font-medium">{estudante.creditosObtidos} / {estudante.creditosTotais}</span>
                  
                  <span className="text-muted-foreground">Estado:</span>
                  <span>{getEstadoBadge(estudante.estado)}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Progresso do Curso</p>
                  <Progress value={(estudante.creditosObtidos / estudante.creditosTotais) * 100} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {Math.round((estudante.creditosObtidos / estudante.creditosTotais) * 100)}% concluído
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Disciplinas */}
        <TabsContent value="disciplinas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Disciplinas</CardTitle>
              <CardDescription>Lista de todas as disciplinas cursadas e em curso</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="text-center">Ano</TableHead>
                    <TableHead className="text-center">Créditos</TableHead>
                    <TableHead className="text-center">Nota</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDisciplinas.map((disc) => (
                    <TableRow key={disc.codigo}>
                      <TableCell className="font-mono">{disc.codigo}</TableCell>
                      <TableCell className="font-medium">{disc.nome}</TableCell>
                      <TableCell className="text-center">{disc.ano}º</TableCell>
                      <TableCell className="text-center">{disc.creditos}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {disc.nota !== null ? disc.nota : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {disc.estado === "Aprovado" ? (
                          <Badge className="bg-green-500 hover:bg-green-600">{disc.estado}</Badge>
                        ) : disc.estado === "Em Curso" ? (
                          <Badge className="bg-blue-500 hover:bg-blue-600">{disc.estado}</Badge>
                        ) : (
                          <Badge variant="destructive">{disc.estado}</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Finanças */}
        <TabsContent value="financas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={estudante.saldoDevedor > 0 ? "border-destructive" : "border-green-500"}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Devedor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-bold ${estudante.saldoDevedor > 0 ? 'text-destructive' : 'text-green-500'}`}>
                  {estudante.saldoDevedor.toLocaleString()} Kz
                </p>
                {estudante.saldoDevedor > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                    Pagamento pendente
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Mensalidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{estudante.valorMensalidade.toLocaleString()} Kz</p>
                {estudante.desconto > 0 && (
                  <p className="text-xs text-green-500 mt-1">Desconto de {estudante.desconto}% aplicado</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Último Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{new Date(estudante.ultimoPagamento).toLocaleDateString('pt-AO')}</p>
                <p className="text-xs text-muted-foreground mt-1">{estudante.tipoPagamento}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
              <CardDescription>Registo de todos os pagamentos efetuados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referência</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-center">Data</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPagamentos.map((pag) => (
                    <TableRow key={pag.id}>
                      <TableCell className="font-mono">{pag.referencia}</TableCell>
                      <TableCell>{pag.descricao}</TableCell>
                      <TableCell className="text-right font-medium">{pag.valor.toLocaleString()} Kz</TableCell>
                      <TableCell className="text-center">
                        {pag.data ? new Date(pag.data).toLocaleDateString('pt-AO') : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {getPagamentoEstadoBadge(pag.estado)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Documentos */}
        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documentos Disponíveis</CardTitle>
              <CardDescription>Documentos académicos e administrativos do estudante</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Documento</TableHead>
                    <TableHead className="text-center">Data de Emissão</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDocumentos.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.tipo}</TableCell>
                      <TableCell className="text-center">
                        {doc.dataEmissao ? new Date(doc.dataEmissao).toLocaleDateString('pt-AO') : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {doc.estado === "Disponível" ? (
                          <Badge className="bg-green-500 hover:bg-green-600">{doc.estado}</Badge>
                        ) : (
                          <Badge variant="secondary">{doc.estado}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.estado === "Disponível" && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Assiduidade */}
        <TabsContent value="assiduidade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registo de Assiduidade</CardTitle>
              <CardDescription>Presenças por disciplina no semestre atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAssiduidade.map((item) => (
                  <div key={item.disciplina} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.disciplina}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.presencas}/{item.total} presenças ({item.percentagem}%)
                      </span>
                    </div>
                    <Progress 
                      value={item.percentagem} 
                      className={`h-2 ${item.percentagem < 75 ? '[&>div]:bg-destructive' : ''}`}
                    />
                    {item.percentagem < 75 && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Assiduidade abaixo do mínimo exigido (75%)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
