import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Save, X, RefreshCw, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Horários fixos por Período → 7 tempos (T1 a T7)
const HORARIOS_TEMPOS = {
  Manhã: [
    { tempo: "T1", hora: "08:00 - 08:45" },
    { tempo: "T2", hora: "08:55 - 09:40" },
    { tempo: "T3", hora: "09:50 - 10:35" },
    { tempo: "T4", hora: "10:45 - 11:30" },
    { tempo: "T5", hora: "11:40 - 12:25" },
    { tempo: "T6", hora: "14:00 - 14:45" },
    { tempo: "T7", hora: "14:55 - 15:40" },
  ],
  Tarde: [
    { tempo: "T1", hora: "14:00 - 14:45" },
    { tempo: "T2", hora: "14:55 - 15:40" },
    { tempo: "T3", hora: "15:50 - 16:35" },
    { tempo: "T4", hora: "16:45 - 17:30" },
    { tempo: "T5", hora: "17:40 - 18:25" },
    { tempo: "T6", hora: "18:35 - 19:20" },
    { tempo: "T7", hora: "19:30 - 20:15" },
  ],
  Noite: [
    { tempo: "T1", hora: "18:30 - 19:15" },
    { tempo: "T2", hora: "19:25 - 20:10" },
    { tempo: "T3", hora: "20:20 - 21:05" },
    { tempo: "T4", hora: "21:15 - 22:00" },
    { tempo: "T5", hora: "22:10 - 22:55" },
    { tempo: "T6", hora: "23:05 - 23:50" },
    { tempo: "T7", hora: "00:00 - 00:45" },
  ],
};

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function CreateSchedule() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isCheckingCollisions, setIsCheckingCollisions] = useState(false);
  const [hasCollision, setHasCollision] = useState(false);
  const [collisionMessage, setCollisionMessage] = useState("");
  const [diaAberto, setDiaAberto] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    turma: "",
    unidadeCurricular: "",
    docente: "",
    sala: "",
    tipoAula: "",
    horarios: {} as Record<string, string[]>, // { "Segunda": ["T1", "T3"], ... }
  });

  // Dados simulados
  const anosLetivos = ["2024/2025", "2025/2026"];
  const semestres = ["1º Semestre", "2º Semestre"];
  const periodos = ["Manhã", "Tarde", "Noite"];
  const cursos = ["Engenharia Informática", "Gestão", "Direito"];
  const turmas = ["Turma A", "Turma B", "Turma C"];
  const unidadesCurriculares = ["Algoritmos", "Base de Dados", "Programação Web"];
  const docentes = ["Prof. João Silva", "Prof. Maria Santos"];
  const salas = ["Sala 101", "Lab A", "Sala 201"];
  const tiposAula = ["Teórica", "Prática", "Laboratorial"];

  // Toggle de tempo
  const toggleTempo = (dia: string, tempo: string) => {
    setFormData(prev => {
      const horariosDoDia = prev.horarios[dia] || [];
      const jaTem = horariosDoDia.includes(tempo);
      const novosTempos = jaTem
        ? horariosDoDia.filter(t => t !== tempo)
        : [...horariosDoDia, tempo];

      return {
        ...prev,
        horarios: {
          ...prev.horarios,
          [dia]: novosTempos.length > 0 ? novosTempos : [],
        },
      };
    });
  };

  // Verifica se o dia tem tempos selecionados
  const temHorario = (dia: string) => {
    return formData.horarios[dia]?.length > 0;
  };

  const handleCheckCollisions = async () => {
    setIsCheckingCollisions(true);
    await new Promise(r => setTimeout(r, 1200));
    const random = Math.random();
    if (random > 0.6) {
      setHasCollision(true);
      setCollisionMessage("Colisão: Sala ou docente já ocupado neste horário.");
    } else {
      toast({ title: "Sem colisões", description: "Pode prosseguir!" });
    }
    setIsCheckingCollisions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasCollision) {
      toast({ variant: "destructive", title: "Erro", description: "Resolva as colisões." });
      return;
    }
    toast({ title: "Sucesso", description: "Horário criado!" });
    navigate("/horarios/criar");
  };

  const horariosDoPeriodo = formData.periodo ? HORARIOS_TEMPOS[formData.periodo as keyof typeof HORARIOS_TEMPOS] : [];

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/dasboard">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/horarios/criar">Horários</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Criar Horário</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold mt-2">Criar Horário</h1>
        <p className="text-muted-foreground">Selecione os tempos por dia da semana</p>
      </div>

      {hasCollision && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{collisionMessage}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Campos principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Ano Letivo *</Label>
              <Select value={formData.anoLetivo} onValueChange={v => setFormData(prev => ({ ...prev, anoLetivo: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{anosLetivos.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre *</Label>
              <Select value={formData.semestre} onValueChange={v => setFormData(prev => ({ ...prev, semestre: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{semestres.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período *</Label>
              <Select value={formData.periodo} onValueChange={v => setFormData(prev => ({ ...prev, periodo: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar período" /></SelectTrigger>
                <SelectContent>
                  {periodos.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Curso *</Label>
              <Select value={formData.curso} onValueChange={v => setFormData(prev => ({ ...prev, curso: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{cursos.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Turma *</Label>
              <Select value={formData.turma} onValueChange={v => setFormData(prev => ({ ...prev, turma: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{turmas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Unidade Curricular *</Label>
              <Select value={formData.unidadeCurricular} onValueChange={v => setFormData(prev => ({ ...prev, unidadeCurricular: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{unidadesCurriculares.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Docente *</Label>
              <Select value={formData.docente} onValueChange={v => setFormData(prev => ({ ...prev, docente: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{docentes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sala *</Label>
              <Select value={formData.sala} onValueChange={v => setFormData(prev => ({ ...prev, sala: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{salas.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Aula *</Label>
              <Select value={formData.tipoAula} onValueChange={v => setFormData(prev => ({ ...prev, tipoAula: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{tiposAula.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Dias da semana com tempos */}
          {formData.periodo ? (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Selecionar Tempos por Dia</Label>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {DIAS_SEMANA.map(dia => (
                  <div key={dia} className="rounded-lg border bg-muted/30 p-4">
                    <button
                      type="button"
                      onClick={() => setDiaAberto(diaAberto === dia ? null : dia)}
                      className="w-full flex items-center justify-between text-left font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span>{dia}</span>
                        {temHorario(dia) && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            {formData.horarios[dia].length} tempo(s)
                          </span>
                        )}
                      </div>
                      {diaAberto === dia ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {diaAberto === dia && (
                      <div className="mt-4 space-y-3">
                        {horariosDoPeriodo.map(({ tempo, hora }) => (
                          <div key={tempo} className="flex items-center justify-between rounded border bg-card px-3 py-2">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`${dia}-${tempo}`}
                                checked={formData.horarios[dia]?.includes(tempo) || false}
                                onCheckedChange={() => toggleTempo(dia, tempo)}
                              />
                              <label htmlFor={`${dia}-${tempo}`} className="text-sm font-medium cursor-pointer">
                                {tempo}
                              </label>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground">{hora}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Selecione o <strong>Período</strong> para ver os tempos disponíveis
            </div>
          )}

          {/* Botões */}
          <div className="flex flex-wrap gap-3 border-t pt-6 justify-end">
            <Button type="button" variant="outline" onClick={() => navigate("/horarios")}>
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button type="button" variant="outline" onClick={handleCheckCollisions} disabled={isCheckingCollisions}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isCheckingCollisions ? "animate-spin" : ""}`} />
              Verificar Colisões
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Guardar Horário
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}