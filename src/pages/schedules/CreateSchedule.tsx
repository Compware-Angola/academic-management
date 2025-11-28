import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Save,
  X,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryTemposDisponiveis } from "@/hooks/tempos/use-query-tempos-disponiveis";
import { Input } from "@/components/ui/input";
import ScheduleGrid from "./teste";

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
    tipoAula: "",
    horarios: {} as Record<string, string[]>, // { "Segunda": ["T1", "T3"], ... }
  });

  // Dados simulados
  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();
  const { data: periodos, isLoading: isLoadingPeriodo } = useQueryPeriod();
  const { data: temposDisponiveis = [], isLoading: isLoadingTempoDisponiveis } =
    useQueryTemposDisponiveis({
      anoLectivo: Number(formData.anoLetivo),
      periodo: Number(formData.periodo),
    });

  const unidadesCurriculares = [
    "Algoritmos",
    "Base de Dados",
    "Programação Web",
  ];

  const salas = ["Sala 101", "Lab A", "Sala 201"];

  const handleCheckCollisions = async () => {
    setIsCheckingCollisions(true);
    await new Promise((r) => setTimeout(r, 1200));
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
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Resolva as colisões.",
      });
      return;
    }
    toast({ title: "Sucesso", description: "Horário criado!" });
    navigate("/horarios/criar");
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dasboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/horarios/criar">Horários</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Criar Horário</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold mt-2">Criar Horário</h1>
        <p className="text-muted-foreground">
          Selecione os tempos por dia da semana
        </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Ano Letivo *</Label>
              <Select
                value={formData.anoLetivo}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, anoLetivo: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {academicYear
                    ?.filter((a) => a.estado.toLowerCase() === "activo")
                    ?.map((a) => (
                      <SelectItem key={a.codigo} value={String(a.codigo)}>
                        {a.designacao}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Curso *</Label>
              <Select
                value={formData.curso}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, curso: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {cursos?.map((c) => (
                    <SelectItem key={c.codigo} value={c.codigo.toString()}>
                      {c.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre *</Label>
              <Select
                value={formData.semestre}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, semestre: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {semestres?.map((s) => (
                    <SelectItem key={s.codigo} value={s.codigo.toString()}>
                      {s.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período *</Label>
              <Select
                value={formData.periodo}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, periodo: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  {periodos?.map((p) => (
                    <SelectItem key={p.codigo} value={p.codigo.toString()}>
                      {p.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ano curricular *</Label>
              <Select
                value={formData.unidadeCurricular}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, unidadeCurricular: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesCurriculares.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Unidade Curricular *</Label>
              <Select
                value={formData.unidadeCurricular}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, unidadeCurricular: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesCurriculares.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descrição *</Label>
              <Input disabled value={"sera montado de forma auto"} />
            </div>

            <div className="space-y-2">
              <Label>Sala *</Label>
              <Select
                value={formData.sala}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, sala: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {salas.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dias da semana com tempos */}
          {temposDisponiveis.length > 0 && (
            <ScheduleGrid scheduleData={temposDisponiveis} />
          )}

          {/* Botões */}
          <div className="flex flex-wrap gap-3 border-t pt-6 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/horarios")}
            >
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckCollisions}
              disabled={isCheckingCollisions}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isCheckingCollisions ? "animate-spin" : ""
                }`}
              />
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

/**
 Passos para montar deseginaco do horario
 - O curso pegar as inicia de cada palavra do curso
 - Ano curicular
 - pegar as inicias de cada palavavar da unidade curricular
 sequencia do horario que pode ser H1
 */
