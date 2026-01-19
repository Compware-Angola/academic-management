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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryAlunoMatricula } from "@/hooks/financas/alunos/use-query-fecth-aluno";
import { useMutationAtribuirCreditoEducacional } from "@/hooks/financas/credito-educacional/use-mutation-atribuir-credito";
import { ConfirmarAlunoModal } from "./components/ConfirmarAlunoModal";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { CreditoEducacionalSelect } from "@/components/common/global-selects/CreditoEducacionalSelect";
import { useAuth } from "@/hooks/use-auth";
import { useQueryFetchCreditoEducacionalEstudante } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional-estudante";

function validarPayload(payload: {
  codigoAnoLectivo: string;
  semestre: string;
  codigoInstituicao: string;
  codigoCredito: string;
}) {
  if (!payload.codigoAnoLectivo) return "Ano letivo é obrigatório";
  if (!payload.semestre) return "Semestre é obrigatório";
  if (!payload.codigoInstituicao) return "Instituição é obrigatória";
  if (!payload.codigoCredito) return "Crédito educacional é obrigatório";
  return null;
}

export default function AtribuirCredito() {
  const { toast } = useToast();

  const [matricula, setMatricula] = useState("");
  const [pesquisar, setPesquisar] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [canAtribuir, setCanAtribuir] = useState(false);
  const [filtroNome, setFiltroNome] = useState("");

  const {
    user: {
      user: { pk_utilizador },
    },
  } = useAuth();

  const [payload, setPayload] = useState({
    codigoAnoLectivo: "",
    semestre: "",
    codigoInstituicao: "",
    codigoCredito: "",
  });

  const {
    data: creditoEstudantes,
    isLoading: isLoadingCreditos,
    isError: isErrorCreditos,
    error: errorCreditos,
  } = useQueryFetchCreditoEducacionalEstudante();

  const {
    data: aluno,
    isLoading,
    isError,
    error,
  } = useQueryAlunoMatricula(matricula, pesquisar);

  const { mutateAsync: atribuirCredito, isPending: isAtribuindo } =
    useMutationAtribuirCreditoEducacional();

  const resetFormulario = () => {
    setMatricula("");
    setPesquisar(false);
    setCanAtribuir(false);
    setModalAberto(false);

    setPayload({
      codigoAnoLectivo: "",
      semestre: "",
      codigoInstituicao: "",
      codigoCredito: "",
    });
  };

  useEffect(() => {
    if (aluno) {
      setModalAberto(true);
      setPesquisar(false);
    }
  }, [aluno]);

  useEffect(() => {
    if (isError) {
      setPesquisar(false);
      toast({
        title: error?.response?.data?.message ?? "Erro ao pesquisar estudante",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  useEffect(() => {
    if (isErrorCreditos) {
      toast({
        title: errorCreditos?.message ?? "Erro ao carregar lista de estudantes",
        variant: "destructive",
      });
    }
  }, [isErrorCreditos, errorCreditos, toast]);

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
        codigoInstituicao: Number(payload.codigoInstituicao),
        codigoCredito: Number(payload.codigoCredito),
        codigoUtilizador: pk_utilizador,
      });

      resetFormulario();
    } catch (error) {
      console.error();
    }
  };

  // Filtrar estudantes por nome
  const estudantesFiltrados = creditoEstudantes?.items.filter((estudante) =>
    estudante.nome_completo.toLowerCase().includes(filtroNome.toLowerCase()),
  );

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
          {/* Pesquisa */}
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

          {/* Payload */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

            <InstituicaoSelect
              disabled={!aluno}
              value={payload.codigoInstituicao}
              onChangeValue={(v) =>
                setPayload((p) => ({ ...p, codigoInstituicao: v }))
              }
            />

            <CreditoEducacionalSelect
              disabled={!aluno}
              value={payload.codigoCredito}
              onChangeValue={(v) =>
                setPayload((p) => ({ ...p, codigoCredito: v }))
              }
            />
          </div>

          {/* Ações */}
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

            <Button onClick={() => resetFormulario()} variant="outline">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card de Listagem */}
      <Card>
        <CardHeader>
          <CardTitle>Estudantes com Crédito Educacional</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Filtrar por nome..."
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoadingCreditos ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Matrícula</TableHead>
                    <TableHead className="min-w-[250px]">
                      Nome Completo
                    </TableHead>
                    <TableHead className="w-[150px]">BI</TableHead>
                    <TableHead className="min-w-[200px]">Curso</TableHead>
                    <TableHead className="min-w-[200px]">Instituição</TableHead>
                    <TableHead className="w-[100px]">Ano Letivo</TableHead>
                    <TableHead className="w-[90px]">Semestre</TableHead>
                    <TableHead className="w-[120px]">Crédito</TableHead>
                    <TableHead className="w-[90px]">Desconto</TableHead>
                    <TableHead className="w-[120px]">Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudantesFiltrados && estudantesFiltrados.length > 0 ? (
                    estudantesFiltrados.map((estudante) => (
                      <TableRow key={estudante.codigo}>
                        <TableCell>{estudante.codigo_matricula}</TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {estudante.nome_completo}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {estudante.bilhete_identidade}
                        </TableCell>
                        <TableCell>{estudante.curso}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {estudante.instituicao}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {estudante.ano_lectivo}
                        </TableCell>
                        <TableCell className="text-center">
                          {estudante.semestre ? `${estudante.semestre}º` : "-"}
                        </TableCell>
                        <TableCell>{estudante.credito}</TableCell>
                        <TableCell className="text-center">
                          {estudante.desconto}
                          {estudante.tipo_desconto === "PERCENTUAL" ? "%" : ""}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs  px-2 py-1 rounded whitespace-nowrap">
                            {estudante.tipo_desconto}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        {filtroNome
                          ? "Nenhum estudante encontrado com esse nome"
                          : "Nenhum estudante com crédito educacional"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {estudantesFiltrados && estudantesFiltrados.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Total: {estudantesFiltrados.length} estudante(s)
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <ConfirmarAlunoModal
        open={modalAberto}
        aluno={aluno}
        onClose={() => resetFormulario()}
        onConfirm={() => {
          setCanAtribuir(true);
          setModalAberto(false);
        }}
      />
    </div>
  );
}
