import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Save, X, RefreshCw, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function CreateSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingCollisions, setIsCheckingCollisions] = useState(false);
  const [hasCollision, setHasCollision] = useState(false);
  const [collisionMessage, setCollisionMessage] = useState("");

  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    turma: "",
    unidadeCurricular: "",
    docente: "",
    sala: "",
    diasSemana: [] as string[],
    horariosPorDia: {} as Record<string, { horaInicio: string; horaFim: string }>,
    tipoAula: "",
    capacidadeSala: "40",
  });

  const anosLetivos = ["2024/2025", "2023/2024", "2022/2023"];
  const semestres = ["1º Semestre", "2º Semestre"];
  const periodos = ["Manhã", "Tarde", "Noite"];
  const cursos = [
    "Engenharia Informática",
    "Engenharia Civil",
    "Arquitetura",
    "Gestão de Empresas",
    "Direito",
  ];
  const turmas = ["Turma A", "Turma B", "Turma C", "Turma D"];
  const unidadesCurriculares = [
    "Algoritmos e Estruturas de Dados",
    "Base de Dados",
    "Programação Web",
    "Sistemas Operativos",
    "Redes de Computadores",
  ];
  const docentes = [
    "Prof. Dr. João Silva",
    "Prof. Dr. Maria Santos",
    "Prof. Dra. Ana Costa",
    "Prof. Dr. Pedro Gomes",
  ];
  const salas = ["Sala 101", "Sala 102", "Sala 103", "Sala 201", "Sala 202", "Lab A", "Lab B"];
  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const tiposAula = ["Teórica", "Prática Laboratorial", "Laboratório"];

  const handleCheckCollisions = async () => {
    setIsCheckingCollisions(true);
    setHasCollision(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const random = Math.random();
    if (random > 0.7) {
      setHasCollision(true);
      setCollisionMessage("Colisão detectada: A sala já está ocupada neste horário.");
    } else if (random > 0.4) {
      setHasCollision(true);
      setCollisionMessage("Colisão detectada: O docente já tem aula neste horário.");
    } else {
      toast({
        title: "Sem colisões",
        description: "Não foram detectadas colisões de horário.",
      });
    }
    
    setIsCheckingCollisions(false);
  };

  const handleSubmit = (saveAndNew: boolean = false) => {
    if (hasCollision) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não é possível guardar com colisões detectadas.",
      });
      return;
    }

    toast({
      title: "Horário criado",
      description: "O horário foi criado com sucesso.",
    });

    if (saveAndNew) {
      setFormData({
        anoLetivo: formData.anoLetivo,
        semestre: formData.semestre,
        periodo: formData.periodo,
        curso: "",
        turma: "",
        unidadeCurricular: "",
        docente: "",
        sala: "",
        diasSemana: [],
        horariosPorDia: {},
        tipoAula: "",
        capacidadeSala: "40",
      });
    } else {
      navigate("/horarios");
    }
  };

  const handleClear = () => {
    setFormData({
      anoLetivo: "",
      semestre: "",
      periodo: "",
      curso: "",
      turma: "",
      unidadeCurricular: "",
      docente: "",
      sala: "",
      diasSemana: [],
      horariosPorDia: {},
      tipoAula: "",
      capacidadeSala: "40",
    });
    setHasCollision(false);
    setCollisionMessage("");
  };

  const toggleDia = (dia: string) => {
    setFormData(prev => {
      const isRemoving = prev.diasSemana.includes(dia);
      const newDiasSemana = isRemoving 
        ? prev.diasSemana.filter(d => d !== dia)
        : [...prev.diasSemana, dia];
      
      const newHorariosPorDia = { ...prev.horariosPorDia };
      if (isRemoving) {
        delete newHorariosPorDia[dia];
      } else {
        newHorariosPorDia[dia] = { horaInicio: "", horaFim: "" };
      }
      
      return {
        ...prev,
        diasSemana: newDiasSemana,
        horariosPorDia: newHorariosPorDia
      };
    });
  };

  const updateHorarioDia = (dia: string, campo: 'horaInicio' | 'horaFim', valor: string) => {
    setFormData(prev => ({
      ...prev,
      horariosPorDia: {
        ...prev.horariosPorDia,
        [dia]: {
          ...prev.horariosPorDia[dia],
          [campo]: valor
        }
      }
    }));
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Criar Horário</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Criar Horário</h1>
          <p className="text-muted-foreground">Criar novo horário de aulas</p>
        </div>
      </div>

      {hasCollision && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{collisionMessage}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Ano Letivo */}
            <div className="space-y-2">
              <Label htmlFor="anoLetivo" className="text-foreground">
                Ano Letivo <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.anoLetivo} onValueChange={(value) => setFormData(prev => ({ ...prev, anoLetivo: value }))}>
                <SelectTrigger id="anoLetivo" className="bg-background">
                  <SelectValue placeholder="Selecionar ano letivo" />
                </SelectTrigger>
                <SelectContent>
                  {anosLetivos.map(ano => (
                    <SelectItem key={ano} value={ano}>{ano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semestre */}
            <div className="space-y-2">
              <Label htmlFor="semestre" className="text-foreground">
                Semestre <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.semestre} onValueChange={(value) => setFormData(prev => ({ ...prev, semestre: value }))}>
                <SelectTrigger id="semestre" className="bg-background">
                  <SelectValue placeholder="Selecionar semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semestres.map(sem => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="space-y-2">
              <Label htmlFor="periodo" className="text-foreground">
                Período <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.periodo} onValueChange={(value) => setFormData(prev => ({ ...prev, periodo: value }))}>
                <SelectTrigger id="periodo" className="bg-background">
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map(per => (
                    <SelectItem key={per} value={per}>{per}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <Label htmlFor="curso" className="text-foreground">
                Curso <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.curso} onValueChange={(value) => setFormData(prev => ({ ...prev, curso: value }))}>
                <SelectTrigger id="curso" className="bg-background">
                  <SelectValue placeholder="Selecionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map(curso => (
                    <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Turma */}
            <div className="space-y-2">
              <Label htmlFor="turma" className="text-foreground">
                Turma <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.turma} onValueChange={(value) => setFormData(prev => ({ ...prev, turma: value }))}>
                <SelectTrigger id="turma" className="bg-background">
                  <SelectValue placeholder="Selecionar turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map(turma => (
                    <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Unidade Curricular */}
            <div className="space-y-2">
              <Label htmlFor="uc" className="text-foreground">
                Unidade Curricular <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.unidadeCurricular} onValueChange={(value) => setFormData(prev => ({ ...prev, unidadeCurricular: value }))}>
                <SelectTrigger id="uc" className="bg-background">
                  <SelectValue placeholder="Selecionar UC" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesCurriculares.map(uc => (
                    <SelectItem key={uc} value={uc}>{uc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Docente */}
            <div className="space-y-2">
              <Label htmlFor="docente" className="text-foreground">
                Docente <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.docente} onValueChange={(value) => setFormData(prev => ({ ...prev, docente: value }))}>
                <SelectTrigger id="docente" className="bg-background">
                  <SelectValue placeholder="Selecionar docente" />
                </SelectTrigger>
                <SelectContent>
                  {docentes.map(doc => (
                    <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sala */}
            <div className="space-y-2">
              <Label htmlFor="sala" className="text-foreground">
                Sala <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.sala} onValueChange={(value) => setFormData(prev => ({ ...prev, sala: value }))}>
                <SelectTrigger id="sala" className="bg-background">
                  <SelectValue placeholder="Selecionar sala" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map(sala => (
                    <SelectItem key={sala} value={sala}>{sala}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Capacidade da Sala */}
            <div className="space-y-2">
              <Label htmlFor="capacidade" className="text-foreground">Capacidade da Sala</Label>
              <Input
                id="capacidade"
                type="text"
                value={formData.capacidadeSala}
                readOnly
                className="bg-muted text-muted-foreground"
              />
            </div>

            {/* Tipo de Aula */}
            <div className="space-y-2">
              <Label htmlFor="tipoAula" className="text-foreground">
                Tipo de Aula <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.tipoAula} onValueChange={(value) => setFormData(prev => ({ ...prev, tipoAula: value }))}>
                <SelectTrigger id="tipoAula" className="bg-background">
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAula.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dias da Semana */}
          <div className="space-y-3">
            <Label className="text-foreground">
              Dias da Semana <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {diasSemana.map(dia => (
                <div key={dia} className="flex items-center space-x-2">
                  <Checkbox
                    id={dia}
                    checked={formData.diasSemana.includes(dia)}
                    onCheckedChange={() => toggleDia(dia)}
                  />
                  <label
                    htmlFor={dia}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                  >
                    {dia}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Horários por Dia da Semana */}
          {formData.diasSemana.length > 0 && (
            <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
              <Label className="text-lg font-semibold text-foreground">
                Horário por Dia da Semana
              </Label>
              <div className="space-y-4">
                {formData.diasSemana.map(dia => (
                  <div key={dia} className="grid grid-cols-1 gap-4 rounded border border-border bg-card p-4 md:grid-cols-3">
                    <div className="flex items-center">
                      <Label className="font-semibold text-foreground">{dia}</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${dia}-inicio`} className="text-sm text-foreground">
                        Hora Início <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`${dia}-inicio`}
                        type="time"
                        value={formData.horariosPorDia[dia]?.horaInicio || ""}
                        onChange={(e) => updateHorarioDia(dia, 'horaInicio', e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${dia}-fim`} className="text-sm text-foreground">
                        Hora Fim <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`${dia}-fim`}
                        type="time"
                        value={formData.horariosPorDia[dia]?.horaFim || ""}
                        onChange={(e) => updateHorarioDia(dia, 'horaFim', e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verificar Colisões */}
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckCollisions}
              disabled={isCheckingCollisions}
              className="w-full md:w-auto"
            >
              {isCheckingCollisions ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Verificar Colisões
                </>
              )}
            </Button>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/horarios")}
              className="md:w-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="md:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Limpar Formulário
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit(true)}
              className="md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Guardar e Criar Novo
            </Button>
            <Button type="submit" className="md:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
