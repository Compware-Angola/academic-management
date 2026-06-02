// src/components/dashboard/QuickActionsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypeConfigurationGeralResponse } from "@/services/academiccalendar/configuration-geral.service";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

interface QuickActionsCardProps {
  title?: string;
  description?: string;
  configuration?: TypeConfigurationGeralResponse | null;
  isLoading?: boolean;
}

export default function QuickActionsCard({
  title = "Ações Rápidas",
  description = "Configuração Académica Atual",
  configuration,
  isLoading = false,
}: QuickActionsCardProps) {
  // Estado vazio (quando não tem dados ou ainda está carregando)
  if (isLoading || !configuration) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tudo em dia!
            </h3>
            <p className="text-sm text-muted-foreground">
              Não há informações académicas disponíveis no momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { anoLectivo, semestreAtual, semestresConfigurados } = configuration;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Ano Letivo */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Ano Letivo</p>
            <p className="text-xl font-semibold">{anoLectivo.designacao}</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>

        {/* Semestre Atual */}
        {semestreAtual.semestre && (
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Semestre Atual</p>
                <p className="text-2xl font-bold text-primary">
                  {semestreAtual.semestre}º Semestre
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {semestreAtual.descricao}
            </p>
            {semestreAtual.dataFim && (
              <p className="text-xs mt-2 text-muted-foreground">
                Fim previsto: {new Date(semestreAtual.dataFim).toLocaleDateString('pt-AO')}
              </p>
            )}
          </div>
        )}

        {/* Semestres Configurados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {semestresConfigurados.primeiroSemestre && (
            <div className="p-4 border rounded-lg">
              <p className="font-medium text-sm mb-2 text-amber-600">1º Semestre</p>
              <p className="text-sm">
                {new Date(semestresConfigurados.primeiroSemestre.dataInicio).toLocaleDateString('pt-AO')} →{" "}
                {new Date(semestresConfigurados.primeiroSemestre.dataFim).toLocaleDateString('pt-AO')}
              </p>
            </div>
          )}

          {semestresConfigurados.segundoSemestre && (
            <div className="p-4 border rounded-lg">
              <p className="font-medium text-sm mb-2 text-blue-600">2º Semestre</p>
              <p className="text-sm">
                {new Date(semestresConfigurados.segundoSemestre.dataInicio).toLocaleDateString('pt-AO')} →{" "}
                {new Date(semestresConfigurados.segundoSemestre.dataFim).toLocaleDateString('pt-AO')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}