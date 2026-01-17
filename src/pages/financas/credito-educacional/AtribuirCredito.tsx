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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Home, Search, Check } from "lucide-react";
import { Link } from "react-router-dom";

type Aluno = {
  nome: string;
  matricula: string;
  curso: string;
  instituicao: string;
};

export default function AtribuirCredito() {
  const [alunoEncontrado, setAlunoEncontrado] = useState<Aluno | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [matricula, setMatricula] = useState("");

  // Simulação de pesquisa
  const pesquisarAluno = () => {
    if (!matricula) return;

    // Simula resposta da API
    const aluno: Aluno = {
      nome: "Ana Silva",
      matricula,
      curso: "Engenharia Informática",
      instituicao: "INAGBE",
    };

    setAlunoEncontrado(aluno);
    setModalAberto(true);
    setConfirmado(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
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
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Atribuir Crédito Educacional</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Card principal */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Estudante</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Pesquisa */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Introduza o número de matrícula do estudante"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
            <Button size="icon" onClick={pesquisarAluno}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filtros linha 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ano Lectivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo Instituição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="renuncia">Com Renúncia</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Instituição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inagbe">INAGBE</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Bolsa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="integral">Integral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtros linha 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Afectação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Desconto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50">50%</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Período de Bolsa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button disabled={!confirmado}>
              <Check className="h-4 w-4 mr-1" />
              Atribuir
            </Button>
            <Button variant="outline">Cancelar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Dados do Estudante</DialogTitle>
          </DialogHeader>

          {alunoEncontrado && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Nome:</strong> {alunoEncontrado.nome}
              </p>
              <p>
                <strong>Matrícula:</strong> {alunoEncontrado.matricula}
              </p>
              <p>
                <strong>Curso:</strong> {alunoEncontrado.curso}
              </p>
              <p>
                <strong>Instituição:</strong> {alunoEncontrado.instituicao}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setConfirmado(true);
                setModalAberto(false);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
