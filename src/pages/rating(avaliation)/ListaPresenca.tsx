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
import { FormSelect } from "@/components/common/FormSelect";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelectIsaac } from "@/components/common/FormSelectIsaac";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { Estudante, ListaEstudantesPDF } from "@/components/list-student";

export default function PresenceList() {

  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    unidadeCurricular: "",
    horarioId: "",
    classes: "",
    tipoAvaliacao: "",
    tipoProva: "",
    verHoario: "",
    filtro: "",
  });
  const [showResults, setShowResults] = useState(false);
const estudantes2: Estudante[] = [
  {
    id: 1,
    numeroProcesso: '2025/001',
    nome: 'João Alberto Silva',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 923 456 789',
  },
  {
    id: 2,
    numeroProcesso: '2025/002',
    nome: 'Maria Fernanda Lopes',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 912 345 678',
  },
  {
    id: 3,
    numeroProcesso: '2025/003',
    nome: 'Pedro António Manuel',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 934 567 890',
  },
  {
    id: 4,
    numeroProcesso: '2025/004',
    nome: 'Ana Paula dos Santos',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 927 123 456',
  },
  {
    id: 5,
    numeroProcesso: '2025/005',
    nome: 'José Eduardo Kumba',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 931 789 012',
  },
  {
    id: 6,
    numeroProcesso: '2025/006',
    nome: 'Luísa Margarida Neto',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 945 234 567',
  },
  {
    id: 7,
    numeroProcesso: '2025/007',
    nome: 'Carlos Domingos Vicente',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 919 876 543',
  },
  {
    id: 8,
    numeroProcesso: '2025/008',
    nome: 'Beatriz Sofia Cardoso',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 933 456 789',
  },
  {
    id: 9,
    numeroProcesso: '2025/009',
    nome: 'António Francisco Mendes',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 926 789 012',
  },
  {
    id: 10,
    numeroProcesso: '2025/010',
    nome: 'Catarina Isabel Domingos',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 938 123 456',
  },
  {
    id: 11,
    numeroProcesso: '2025/011',
    nome: 'Manuel João Baptista',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 941 567 890',
  },
  {
    id: 12,
    numeroProcesso: '2025/012',
    nome: 'Rosa Maria Fernandes',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 929 345 678',
  },
  {
    id: 13,
    numeroProcesso: '2025/013',
    nome: 'David Jeremias Costa',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 935 678 901',
  },
  {
    id: 14,
    numeroProcesso: '2025/014',
    nome: 'Elsa Patrícia Augusto',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 922 456 789',
  },
  {
    id: 15,
    numeroProcesso: '2025/015',
    nome: 'Tiago Miguel de Almeida',
    curso: 'Licenciatura em Informática',
    ano: '2º',
    turma: 'A',
    contacto: '+244 937 890 123',
  },
]

  const titulo = 'Lista de Estudantes - Licenciatura em Informática - 2025/2026'
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
      const canLoadTurmas =
        !!formData.anoLetivo &&
        !!formData.semestre &&
        !!formData.periodo &&
        !!formData.curso &&
        !!formData.unidadeCurricular;
    
      const { data: scheduleResponse, isLoading: loadingschedule } = useQuerySchedulesByUc(
        {
          anoLectivo: Number(formData.anoLetivo),
          semestre: Number(formData.semestre),
          periodo: Number(formData.periodo),
          curso: Number(formData.curso),
          unidadeCurricular: Number(formData.unidadeCurricular),
         
        },
        { enabled: canLoadTurmas }
      );
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });
  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();
  const { data: tipoProva = [], isLoading: isLoadingTipoProva } =
    useQueryTipoProva();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

 const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: formData.classes,
      curso: formData.curso,
      semestre: formData.semestre,
    });
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <FormSelect
                   disabled={isLoadingAcademicYear}
                   loading={isLoadingAcademicYear}
                   label="Ano Letivo"
                   value={formData.anoLetivo}
                   onChange={(v) => setFormData({ ...formData, anoLetivo: v })}
                   options={academicYear}
                   map={(a) => ({
                     key: a.codigo,
                     label: a.designacao,
                     value: a.codigo,
                   })}
                 />
                 <FormSelect
                   disabled={
                     isLoadingPeriodos ||
                     isLoadingAcademicYear ||
                     formData.anoLetivo === ""
                   }
                   loading={isLoadingPeriodos}
                   label="Período"
                   value={formData.periodo}
                   onChange={(v) => setFormData({ ...formData, periodo: v })}
                   options={periodos}
                   map={(p) => ({
                     key: p.codigo,
                     label: p.designacao,
                     value: p.codigo,
                   })}
                 />
                 <FormSelect
                   disabled={isLoadingSemestres}
                   loading={isLoadingSemestres}
                   label="Semestre"
                   value={formData.semestre}
                   onChange={(v) => setFormData({ ...formData, semestre: v })}
                   options={semestres}
                   map={(s) => ({
                     key: s.codigo,
                     label: s.designacao,
                     value: s.codigo,
                   })}
                 />
                 <FormSelect
                   disabled={isLoadingCurso}
                   loading={isLoadingCurso}
                   label="Curso"
                   value={formData.curso}
                   onChange={(v) => setFormData({ ...formData, curso: v })}
                   options={cursos}
                   map={(c) => ({
                     key: c.codigo,
                     label: c.designacao,
                     value: c.codigo,
                   })}
                 />
                 <FormSelect
                   label="Ano Curricular"
                   value={formData.classes}
                   disabled={isLoadingClasses || !formData.curso}
                   onChange={(v) => setFormData({ ...formData, classes: v })}
                   options={classes}
                   map={(c) => ({
                     key: c.codigo,
                     label: c.designacao,
                     value: c.codigo,
                   })}
                   loading={isLoadingClasses}
                 />
                      {/* UC */}
                 <FormSelect
                   label="Unidade Curricular"
                   value={formData.unidadeCurricular}
                   disabled={
                     isLoadingUC ||
                     !formData.semestre ||
                     !formData.curso ||
                     !formData.classes
                   }
                   onChange={(v) => setFormData({ ...formData, unidadeCurricular: v })}
                   options={unidadesCurriculares}
                   map={(u) => ({
                     key: u.codigo,
                     label: u.descricao,
                     value: u.pk,
                   })}
                   loading={isLoadingUC}
                 />
                 <FormSelectIsaac
                   label="Horario"
                   value={formData.horarioId}
                   disabled={
                     loadingschedule ||
                     !formData.semestre ||
                     !formData.classes
                   }
                   onChange={(v) => setFormData({ ...formData, horarioId: v })}
                   options={scheduleResponse?.data}
                   map={(u, index) => ({
                     key: index,
                     value: u.codigo,
                     label: `${u.designacao}`,
                   })}
                   loading={loadingschedule}
                 />
                 <FormSelect
                   label="Tipo de Prova"
                   value={formData.tipoProva}
                   disabled={isLoadingTipoProva}
                   onChange={(v) => setFormData({ ...formData, tipoProva: v })}
                   options={tipoProva}
                   map={(u) => ({
                     key: u.codigo,
                     label: u.designacao,
                     value: u.codigo,
                   })}
                   loading={isLoadingTipoProva}
                 />
                 <FormSelect
                   label="Tipo de Avaliação"
                   value={formData.tipoAvaliacao}
                   disabled={isLoadingTipoAvaliacao}
                   onChange={(v) => setFormData({ ...formData, tipoAvaliacao: v })}
                   options={tipoAvaliacao}
                   map={(u) => ({
                     key: u.codigo,
                     label: u.designacao,
                     value: u.codigo,
                   })}
                   loading={isLoadingTipoAvaliacao}
                 />
       
                 {/* Botão Listar na mesma linha */}
                 <div className="flex items-end">
                   <Button
                     className="w-full"
                    
                   >
                     <RefreshCw className="h-5 w-5 mr-2" />
                     Listar
                   </Button>
                 </div>
               </div>
        </CardContent>
      </Card>

   <div className="flex flex-wrap gap-2 items-center justify-between">
           
            <div className="flex gap-2">
            
              <ListaEstudantesPDF 
        estudantes={estudantes2} 
        titulo={titulo} 
      />
            </div>
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
    </div>
  );
}
