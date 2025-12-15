import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowRight, Users, Search, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Estudante {
  id: number;
  numero: string;
  nome: string;
  email: string;
}

interface Horario {
  id: number;
  dia: string;
  horaInicio: string;
  horaFim: string;
  sala: string;
  docente: string;
  tipo: string;
  totalEstudantes: number;
  capacidade: number;
}
export const estudantesPorHorario: Record<number, Estudante[]> = {
  1: [
    {
      id: 1,
      numero: "2024001",
      nome: "Ana Maria Silva",
      email: "ana.silva@email.com",
    },
    {
      id: 2,
      numero: "2024002",
      nome: "Bruno Costa Santos",
      email: "bruno.santos@email.com",
    },
    {
      id: 3,
      numero: "2024003",
      nome: "Carla Dias Ferreira",
      email: "carla.ferreira@email.com",
    },
    {
      id: 4,
      numero: "2024004",
      nome: "Daniel Alves Pereira",
      email: "daniel.pereira@email.com",
    },
    {
      id: 5,
      numero: "2024005",
      nome: "Eva Martins Oliveira",
      email: "eva.oliveira@email.com",
    },
  ],
  2: [
    {
      id: 6,
      numero: "2024006",
      nome: "Fábio Ramos Lima",
      email: "fabio.lima@email.com",
    },
    {
      id: 7,
      numero: "2024007",
      nome: "Gabriela Nunes",
      email: "gabriela.nunes@email.com",
    },
    {
      id: 8,
      numero: "2024008",
      nome: "Hugo Fernandes",
      email: "hugo.fernandes@email.com",
    },
  ],
  3: [
    {
      id: 9,
      numero: "2024009",
      nome: "Inês Cardoso",
      email: "ines.cardoso@email.com",
    },
    {
      id: 10,
      numero: "2024010",
      nome: "João Pedro Reis",
      email: "joao.reis@email.com",
    },
  ],
  4: [
    {
      id: 11,
      numero: "2024011",
      nome: "Kátia Sousa",
      email: "katia.sousa@email.com",
    },
    {
      id: 12,
      numero: "2024012",
      nome: "Luís Mendes",
      email: "luis.mendes@email.com",
    },
    {
      id: 13,
      numero: "2024013",
      nome: "Marta Ribeiro",
      email: "marta.ribeiro@email.com",
    },
  ],
  5: [
    {
      id: 14,
      numero: "2024014",
      nome: "Nuno Pinto",
      email: "nuno.pinto@email.com",
    },
    {
      id: 15,
      numero: "2024015",
      nome: "Olga Teixeira",
      email: "olga.teixeira@email.com",
    },
  ],
};
export default function MovimentarEstudantes() {
  const [anoLectivo, setAnoLectivo] = useState("");
  const [curso, setCurso] = useState("");
  const [classe, setClasse] = useState("");
  const [uc, setUc] = useState("");
  const [horarioOrigemId, setHorarioOrigemId] = useState<number | null>(null);
  const [horarioDestinoId, setHorarioDestinoId] = useState<number | null>(null);
  const [estudantesSelecionados, setEstudantesSelecionados] = useState<
    number[]
  >([]);
  const [mostrarHorarios, setMostrarHorarios] = useState(false);

  // Mock data - Horários disponíveis
  const horariosDisponiveis: Horario[] = [
    {
      id: 1,
      dia: "Segunda-feira",
      horaInicio: "08:00",
      horaFim: "10:00",
      sala: "Sala A101",
      docente: "Prof. João Silva",
      tipo: "Teórica",
      totalEstudantes: 35,
      capacidade: 50,
    },
    {
      id: 2,
      dia: "Segunda-feira",
      horaInicio: "10:00",
      horaFim: "12:00",
      sala: "Sala A102",
      docente: "Prof. João Silva",
      tipo: "Teórica",
      totalEstudantes: 28,
      capacidade: 50,
    },
    {
      id: 3,
      dia: "Terça-feira",
      horaInicio: "14:00",
      horaFim: "16:00",
      sala: "Lab. Info 1",
      docente: "Prof. Maria Santos",
      tipo: "Prática",
      totalEstudantes: 22,
      capacidade: 30,
    },
    {
      id: 4,
      dia: "Quarta-feira",
      horaInicio: "08:00",
      horaFim: "10:00",
      sala: "Sala B201",
      docente: "Prof. Pedro Costa",
      tipo: "Teórica",
      totalEstudantes: 40,
      capacidade: 50,
    },
    {
      id: 5,
      dia: "Quinta-feira",
      horaInicio: "16:00",
      horaFim: "18:00",
      sala: "Lab. Info 2",
      docente: "Prof. Ana Ferreira",
      tipo: "Prática",
      totalEstudantes: 18,
      capacidade: 25,
    },
  ];

  // Mock data - Estudantes por horário

  const handlePesquisar = () => {
    if (anoLectivo && curso && classe && uc) {
      setMostrarHorarios(true);
      setHorarioOrigemId(null);
      setHorarioDestinoId(null);
      setEstudantesSelecionados([]);
    } else {
      toast.error("Por favor, preencha todos os filtros");
    }
  };

  const handleSelecionarHorarioOrigem = (id: number) => {
    setHorarioOrigemId(id);
    setEstudantesSelecionados([]);
    setHorarioDestinoId(null);
  };

  const handleToggleEstudante = (estudanteId: number) => {
    setEstudantesSelecionados((prev) =>
      prev.includes(estudanteId)
        ? prev.filter((id) => id !== estudanteId)
        : [...prev, estudanteId]
    );
  };

  const handleSelecionarTodos = () => {
    if (horarioOrigemId) {
      const todosIds =
        estudantesPorHorario[horarioOrigemId]?.map((e) => e.id) || [];
      setEstudantesSelecionados(todosIds);
    }
  };

  const handleDesmarcarTodos = () => {
    setEstudantesSelecionados([]);
  };

  const handleMovimentar = () => {
    if (
      !horarioOrigemId ||
      !horarioDestinoId ||
      estudantesSelecionados.length === 0
    ) {
      toast.error(
        "Selecione o horário de origem, estudantes e horário de destino"
      );
      return;
    }

    const horarioDestino = horariosDisponiveis.find(
      (h) => h.id === horarioDestinoId
    );
    if (horarioDestino) {
      const espacoDisponivel =
        horarioDestino.capacidade - horarioDestino.totalEstudantes;
      if (estudantesSelecionados.length > espacoDisponivel) {
        toast.error(
          `O horário de destino só tem ${espacoDisponivel} vagas disponíveis`
        );
        return;
      }
    }

    toast.success(
      `${estudantesSelecionados.length} estudante(s) movimentado(s) com sucesso!`
    );
    setEstudantesSelecionados([]);
    setHorarioOrigemId(null);
    setHorarioDestinoId(null);
  };

  const horarioOrigem = horariosDisponiveis.find(
    (h) => h.id === horarioOrigemId
  );
  const horarioDestino = horariosDisponiveis.find(
    (h) => h.id === horarioDestinoId
  );
  const estudantesDoHorario = horarioOrigemId
    ? estudantesPorHorario[horarioOrigemId] || []
    : [];
  const horariosDestinoDisponiveis = horariosDisponiveis.filter(
    (h) => h.id !== horarioOrigemId
  );

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Horários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Movimentar Estudantes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">
          Movimentar Estudantes entre Horários
        </h1>
        <p className="text-muted-foreground">
          Transferir estudantes de um horário para outro da mesma UC.
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={anoLectivo} onValueChange={setAnoLectivo}>
              <SelectTrigger>
                <SelectValue placeholder="Ano Lectivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>

            <Select value={curso} onValueChange={setCurso}>
              <SelectTrigger>
                <SelectValue placeholder="Curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ei">Engenharia Informática</SelectItem>
                <SelectItem value="ec">Engenharia Civil</SelectItem>
                <SelectItem value="em">Engenharia Mecânica</SelectItem>
                <SelectItem value="dir">Direito</SelectItem>
                <SelectItem value="med">Medicina</SelectItem>
              </SelectContent>
            </Select>

            <Select value={classe} onValueChange={setClasse}>
              <SelectTrigger>
                <SelectValue placeholder="Classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1º Ano</SelectItem>
                <SelectItem value="2">2º Ano</SelectItem>
                <SelectItem value="3">3º Ano</SelectItem>
                <SelectItem value="4">4º Ano</SelectItem>
                <SelectItem value="5">5º Ano</SelectItem>
              </SelectContent>
            </Select>

            <Select value={uc} onValueChange={setUc}>
              <SelectTrigger>
                <SelectValue placeholder="Unidade Curricular" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prog1">Programação I</SelectItem>
                <SelectItem value="prog2">Programação II</SelectItem>
                <SelectItem value="bd">Bases de Dados</SelectItem>
                <SelectItem value="redes">Redes de Computadores</SelectItem>
                <SelectItem value="ia">Inteligência Artificial</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handlePesquisar} className="gap-2">
              <Search className="h-4 w-4" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {mostrarHorarios && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Horário de Origem */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Horário de Origem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Dia</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Estudantes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {horariosDisponiveis.map((horario) => (
                    <TableRow
                      key={horario.id}
                      className={`cursor-pointer ${
                        horarioOrigemId === horario.id ? "bg-primary/10" : ""
                      }`}
                      onClick={() => handleSelecionarHorarioOrigem(horario.id)}
                    >
                      <TableCell>
                        <input
                          type="radio"
                          checked={horarioOrigemId === horario.id}
                          onChange={() =>
                            handleSelecionarHorarioOrigem(horario.id)
                          }
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell>{horario.dia}</TableCell>
                      <TableCell>
                        {horario.horaInicio} - {horario.horaFim}
                      </TableCell>
                      <TableCell>{horario.sala}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {horario.totalEstudantes}/{horario.capacidade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Lista de Estudantes do Horário Selecionado */}
              {horarioOrigemId && (
                <div className="mt-4 border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">
                      Estudantes no Horário ({estudantesDoHorario.length})
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelecionarTodos}
                      >
                        Selecionar Todos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDesmarcarTodos}
                      >
                        Desmarcar Todos
                      </Button>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {estudantesDoHorario.map((estudante) => (
                      <div
                        key={estudante.id}
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                          estudantesSelecionados.includes(estudante.id)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleToggleEstudante(estudante.id)}
                      >
                        <Checkbox
                          checked={estudantesSelecionados.includes(
                            estudante.id
                          )}
                          onCheckedChange={() =>
                            handleToggleEstudante(estudante.id)
                          }
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {estudante.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Nº {estudante.numero}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {estudantesSelecionados.length > 0 && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium text-primary">
                        {estudantesSelecionados.length} estudante(s)
                        selecionado(s)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Horário de Destino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MoveRight className="h-5 w-5" />
                Horário de Destino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!horarioOrigemId ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowRight className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Selecione primeiro um horário de origem</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Dia</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Sala</TableHead>
                        <TableHead>Ocupação</TableHead>
                        <TableHead>Vagas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {horariosDestinoDisponiveis.map((horario) => {
                        const vagasDisponiveis =
                          horario.capacidade - horario.totalEstudantes;
                        const temEspaco =
                          vagasDisponiveis >= estudantesSelecionados.length;

                        return (
                          <TableRow
                            key={horario.id}
                            className={`cursor-pointer ${
                              horarioDestinoId === horario.id
                                ? "bg-primary/10"
                                : !temEspaco &&
                                  estudantesSelecionados.length > 0
                                ? "opacity-50"
                                : ""
                            }`}
                            onClick={() =>
                              temEspaco || estudantesSelecionados.length === 0
                                ? setHorarioDestinoId(horario.id)
                                : null
                            }
                          >
                            <TableCell>
                              <input
                                type="radio"
                                checked={horarioDestinoId === horario.id}
                                onChange={() => setHorarioDestinoId(horario.id)}
                                disabled={
                                  !temEspaco &&
                                  estudantesSelecionados.length > 0
                                }
                                className="h-4 w-4"
                              />
                            </TableCell>
                            <TableCell>{horario.dia}</TableCell>
                            <TableCell>
                              {horario.horaInicio} - {horario.horaFim}
                            </TableCell>
                            <TableCell>{horario.sala}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  vagasDisponiveis > 10
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {horario.totalEstudantes}/{horario.capacidade}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  vagasDisponiveis > 0
                                    ? "text-green-600"
                                    : "text-destructive"
                                }
                              >
                                {vagasDisponiveis} vagas
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {horarioDestinoId && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Resumo da Movimentação
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Origem:</p>
                          <p className="font-medium">
                            {horarioOrigem?.dia} {horarioOrigem?.horaInicio}-
                            {horarioOrigem?.horaFim}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {horarioOrigem?.sala}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Destino:</p>
                          <p className="font-medium">
                            {horarioDestino?.dia} {horarioDestino?.horaInicio}-
                            {horarioDestino?.horaFim}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {horarioDestino?.sala}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm">
                          <span className="font-medium">
                            {estudantesSelecionados.length}
                          </span>{" "}
                          estudante(s) a movimentar
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Após movimentação:{" "}
                          {horarioDestino &&
                            horarioDestino.totalEstudantes +
                              estudantesSelecionados.length}
                          /{horarioDestino?.capacidade} estudantes
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botão de Movimentar */}
      {horarioOrigemId &&
        horarioDestinoId &&
        estudantesSelecionados.length > 0 && (
          <div className="flex justify-end">
            <Button size="lg" onClick={handleMovimentar} className="gap-2">
              <MoveRight className="h-5 w-5" />
              Movimentar {estudantesSelecionados.length} Estudante(s)
            </Button>
          </div>
        )}
    </div>
  );
}
