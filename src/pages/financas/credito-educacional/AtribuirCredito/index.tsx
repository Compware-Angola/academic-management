import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryAlunoMatricula } from "@/hooks/financas/alunos/use-query-fecth-aluno";
import { useMutationAtribuirBolsa } from "@/hooks/financas/bolsa/use-mutation-atribuir-bolsa";
import { ConfirmarAlunoModal } from "./components/ConfirmarAlunoModal";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { useAuth } from "@/hooks/use-auth";

function validarPayload(payload: {
  codigoAnoLectivo: string;
  semestre: string;
  codigoBolsa: string;
}) {
  if (!payload.codigoAnoLectivo) return "Ano letivo é obrigatório";
  if (!payload.semestre) return "Semestre é obrigatório";

  if (!payload.codigoBolsa) return "Bolsa é obrigatório";
  return null;
}

export default function AtribuirCredito() {
  const { toast } = useToast();
  const { user } = useAuth();
  const pk_utilizador = user?.user?.pk_utilizador;

  const [matricula, setMatricula] = useState("");
  const [pesquisar, setPesquisar] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [canAtribuir, setCanAtribuir] = useState(false);

  const [payload, setPayload] = useState({
    codigoAnoLectivo: "",
    semestre: "",
    codigoBolsa: "",
  });

  const {
    data: aluno,
    isLoading,
    isError,
    error,
  } = useQueryAlunoMatricula(matricula, pesquisar);
  const { mutateAsync: atribuirCredito, isPending: isAtribuindo } =
    useMutationAtribuirBolsa();

  const resetFormulario = () => {
    setMatricula("");
    setPesquisar(false);
    setCanAtribuir(false);
    setModalAberto(false);
    setPayload({
      codigoAnoLectivo: "",
      semestre: "",
      codigoBolsa: "",
    });
  };

  useEffect(() => {
    if (aluno) setModalAberto(true);
  }, [aluno]);

  useEffect(() => {
    if (isError) {
      toast({
        title: error?.response?.data?.message ?? "Erro ao pesquisar estudante",
        variant: "destructive",
      });
      setPesquisar(false);
    }
  }, [isError, error, toast]);

  const pesquisarAluno = () => {
    if (!matricula) return;
    setCanAtribuir(false);
    setPesquisar(true);
  };

  const handleAtribuir = async () => {
    const erro = validarPayload(payload);
    if (erro) {
      toast({ title: erro, variant: "destructive" });
      return;
    }

    try {
      await atribuirCredito({
        codigoMatricula: Number(matricula),
        codigoAnoLectivo: Number(payload.codigoAnoLectivo),
        semestre: Number(payload.semestre),
        codigoUtilizador: pk_utilizador,
        codigoBolsa: Number(payload.codigoBolsa),
      });
      resetFormulario();
    } catch (error) {
      console.error(error);
    }
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

      {/* Card de Atribuição */}
      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Estudante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Número de matrícula"
              value={matricula}
              disabled={isLoading}
              onChange={(e) => setMatricula(e.target.value)}
            />
            <Button size="icon" disabled={isLoading} onClick={pesquisarAluno}>
              {isLoading ? "..." : <Search className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
            <AcademicYearSelect
              disabled={!aluno}
              value={payload.codigoAnoLectivo}
              onChangeValue={(v) =>
                setPayload((p) => ({ ...p, codigoAnoLectivo: v }))
              }
            />
            <SemestreSelect
              disabled={!aluno}
              value={payload.semestre}
              onChangeValue={(v) => setPayload((p) => ({ ...p, semestre: v }))}
            />

            <BolsaSelect
              disabled={!aluno}
              value={payload.codigoBolsa}
              onChangeValue={(v) =>
                setPayload((p) => ({ ...p, codigoBolsa: v }))
              }
            />
          </div>

          <div className="flex justify-end gap-3 items-center">
            {!canAtribuir && (
              <span className="text-xs text-muted-foreground">
                Confirme o estudante para habilitar a atribuição
              </span>
            )}
            <Button
              disabled={!canAtribuir || isAtribuindo}
              onClick={handleAtribuir}
            >
              <Check className="h-4 w-4 mr-1" />
              {isAtribuindo ? "Atribuindo..." : "Atribuir"}
            </Button>
            <Button onClick={resetFormulario} variant="outline">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmarAlunoModal
        open={modalAberto}
        aluno={aluno}
        onClose={resetFormulario}
        onConfirm={() => {
          setCanAtribuir(true);
          setModalAberto(false);
        }}
      />
    </div>
  );
}
