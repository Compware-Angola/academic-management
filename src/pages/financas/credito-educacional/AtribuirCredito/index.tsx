import { useEffect, useState, useRef } from "react";
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
import { useMutationAtribuirBolsa } from "@/hooks/financas/bolsa/use-mutation-atribuir-bolsa";
import { ConfirmarAlunoModal } from "./components/ConfirmarAlunoModal";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { useQueryValidarEstudanteCredito } from "@/hooks/financas/credito-educacional/use-query-validar-estudante-credito";
import { FormSelect } from "@/components/common/FormSelect";
import { IsentarMultaSelect } from "@/components/common/global-selects/insentar-multa-select";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";

function validarPayload(payload: {
  codigoAnoLectivo: string;
  semestre: string;
  codigoBolsa: string;
  isentaMulta: string;
}) {
  if (!payload.codigoAnoLectivo) return "Ano letivo é obrigatório";
  if (!payload.semestre) return "Semestre é obrigatório";
  if (!payload.codigoBolsa) return "Bolsa é obrigatório";
  if (!payload.isentaMulta) return "Isentar multa é obrigatório";
  return null;
}

export default function AtribuirCredito() {
  const { toast } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const [matricula, setMatricula] = useState("");
  const [pesquisar, setPesquisar] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [canAtribuir, setCanAtribuir] = useState(false);
  const [tipoCandidatura, setTipoCandidatura] = useState("1");

  const [payload, setPayload] = useState({
    codigoAnoLectivo: "",
    semestre: "",
    codigoBolsa: "",
    isentaMulta: "",
  });

  const {
    data: aluno,
    isLoading,
    isError,
    error,
  } = useQueryValidarEstudanteCredito(
    {
      codigoMatricula: Number(matricula),
      codigoAnoLectivo: Number(payload.codigoAnoLectivo),
      semestre: Number(payload.semestre),
    },
    pesquisar,
  );

  const { mutateAsync: atribuirCredito, isPending: isAtribuindo } =
    useMutationAtribuirBolsa();
  const { data: tiposCandidatura, isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();

  const resetFormulario = () => {
    setMatricula("");
    setPesquisar(false);
    setCanAtribuir(false);
    setModalAberto(false);
    setTipoCandidatura("1");
    setPayload({
      codigoAnoLectivo: "",
      semestre: "",
      codigoBolsa: "",
      isentaMulta: "",
    });
    inputRef.current?.focus();
  };

  // Foco automático ao carregar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
    if (!payload.codigoAnoLectivo) {
      toast({ title: "Ano letivo é obrigatório", variant: "destructive" });
      return;
    }
    if (!payload.semestre) {
      toast({ title: "Semestre é obrigatório", variant: "destructive" });
      return;
    }
    if (!matricula?.trim()) {
      toast({ title: "Digite o número de matrícula", variant: "destructive" });
      return;
    }
    setCanAtribuir(false);
    setPesquisar(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      pesquisarAluno();
    }
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
        codigoBolsa: Number(payload.codigoBolsa),
        isentaMulta: payload.isentaMulta as "NAO" | "SIM",
      });
      resetFormulario();
    } catch (error) {
      console.error(error);
    }
  };

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
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Atribuir Crédito Educacional</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Pesquisar Estudante</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <FormSelect
              label="Tipo de Candidatura"
              value={tipoCandidatura}
              loading={isLoadingTiposCandidatura}
              onChange={(v) => {
                setTipoCandidatura(v);
                setPayload((p) => ({
                  ...p,
                  codigoAnoLectivo: "",
                  semestre: "",
                }));
                setPesquisar(false);
                setCanAtribuir(false);
                setModalAberto(false);
              }}
              options={tiposCandidatura}
              map={(tipo) => ({
                key: tipo.codigo,
                label: tipo.designacao,
                value: tipo.codigo,
              })}
              placeholder="Selecione o tipo..."
            />

            <AcademicYearsAvailableForOperationSelect
              disabled={isLoading}
              value={payload.codigoAnoLectivo}
              tipoCandidaturaId={parseFilter(tipoCandidatura) ?? 1}
              onlyConfigurable={false}
              onChangeValue={(v) => {
                setPayload((p) => ({ ...p, codigoAnoLectivo: v }));
                setPesquisar(false);
                setCanAtribuir(false);
                setModalAberto(false);
              }}
            />

            <SemestreSelect
              disabled={isLoading}
              yearly
              value={payload.semestre}
              onChangeValue={(v) => {
                setPayload((p) => ({ ...p, semestre: v }));
                setPesquisar(false);
                setCanAtribuir(false);
                setModalAberto(false);
              }}
            />
          </div>

          {/* SEGUNDO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="number"
                placeholder="Número de matrícula"
                value={matricula}
                disabled={isLoading}
                onChange={(e) => {
                  setMatricula(e.target.value);
                  setPesquisar(false);
                  setCanAtribuir(false);
                  setModalAberto(false);
                }}
                onKeyDown={handleKeyDown}
              />

              <Button
                size="icon"
                disabled={
                  isLoading ||
                  !matricula ||
                  !payload.codigoAnoLectivo ||
                  !payload.semestre
                }
                onClick={pesquisarAluno}
              >
                {isLoading ? "..." : <Search className="h-4 w-4" />}
              </Button>
            </div>
            <IsentarMultaSelect
              label="Isentar Multa"
              value={payload.isentaMulta}
              disabled={!aluno || aluno.ja_bolsista}
              onChangeValue={(value) => {
                setPayload((prev) => ({
                  ...prev,
                  isentaMulta: value,
                }));
              }}
            />
            <BolsaSelect
              disabled={!aluno || aluno.ja_bolsista}
              value={payload.codigoBolsa}
              onChangeValue={(v) =>
                setPayload((p) => ({ ...p, codigoBolsa: v }))
              }
            />
          </div>

          {/* AÇÕES */}
          <div className="flex flex-col md:flex-row justify-end gap-3 items-center">
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

const INSENTAR_MULTA = [
  {
    label: "Sim",
    value: "SIM",
  },
  {
    label: "Não",
    value: "NAO",
  },
];
