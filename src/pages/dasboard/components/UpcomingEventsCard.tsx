import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Users } from "lucide-react";
import { useState } from "react";

import { formatarData } from "@/util/date-formate";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { useQueryAtividades } from "@/hooks/queries/use-query-atividades";

export default function UpcomingEventsCard() {
  const [anoLetivoId, setAnoLetivoId] = useState<string>("");
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState<string>("1");

  const {
    data: tiposCandidatura = [],
    isLoading: loadingTiposCandidatura,
  } = useQueryTipoCandidatura();

  const {
    data: anosLetivos = [],
    isLoading: loadingAnosLetivos,
  } = useQueryAnoAcademico();

  const { data: atividades = [] } = useQueryAtividades({
    anoLetivoId,
    tipoCandidaturaId,
  });

  const getIconAndColor = (index: number) => {
    const configs = [
      { icon: Calendar, bg: "bg-blue-50", text: "text-blue-600" },
      { icon: Clock, bg: "bg-amber-50", text: "text-amber-600" },
      { icon: Users, bg: "bg-purple-50", text: "text-purple-600" },
    ];
    return configs[index] || configs[0];
  };

  const anoSelecionado = anosLetivos.find(
    (a) => a.codigo.toString() === anoLetivoId
  );
  const tipoSelecionado = tiposCandidatura.find(
    (t) => t.codigo.toString() === tipoCandidaturaId
  );

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Próximos Compromissos</CardTitle>
              <CardDescription>
                Agenda académica e institucional
              </CardDescription>
            </div>
          </div>

          {/* Ano Letivo + Tipo de Candidatura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Letivo</label>
              <Select value={anoLetivoId} onValueChange={setAnoLetivoId}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingAnosLetivos ? "Carregando..." : "Selecione"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {anosLetivos.map((ano) => (
                    <SelectItem
                      key={ano.codigo}
                      value={ano.codigo.toString()}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{ano.designacao}</span>
                        {!ano.estado
                          .toLowerCase()
                          .includes("desactiv") && (
                          <span className="text-xs text-green-600 font-medium ml-2">
                            (Ativo)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tipo de Candidatura
              </label>
              <Select
                value={tipoCandidaturaId}
                onValueChange={setTipoCandidaturaId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingTiposCandidatura
                        ? "Carregando..."
                        : "Selecione"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {tiposCandidatura.map((tipo) => (
                    <SelectItem
                      key={tipo.codigo}
                      value={tipo.codigo.toString()}
                    >
                      {tipo.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Título dinâmico */}
          {anoSelecionado && tipoSelecionado && (
            <div className="text-center -mt-2">
              <p className="text-sm font-medium text-primary">
                {tipoSelecionado.designacao} —{" "}
                {anoSelecionado.designacao}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

     <CardContent className="pt-4">
  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
    {loadingAnosLetivos ? (
      Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-lg border"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))
    ) : !anoLetivoId ? (
      <p className="text-center text-muted-foreground py-8">
        Selecione o ano letivo para visualizar as atividades
      </p>
    ) : atividades.length === 0 ? (
      <p className="text-center text-muted-foreground py-8">
        Nenhuma atividade encontrada para os filtros selecionados
      </p>
    ) : (
      atividades.map((atividade, index) => {
        const { icon: Icon, bg, text } = getIconAndColor(index);
        return (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-all"
          >
            <div className={`p-3 rounded-full ${bg}`}>
              <Icon className={`h-5 w-5 ${text}`} />
            </div>

            <div className="flex-1">
              <p className="font-medium text-foreground">
                {atividade.descricao}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatarData(atividade.data_inicio)}
                {atividade.data_termino &&
                  atividade.data_inicio !== atividade.data_termino && (
                    <> → {formatarData(atividade.data_termino)}</>
                  )}
              </p>
            </div>
          </div>
        );
      })
    )}
  </div>
</CardContent>

    </Card>
  );
}
