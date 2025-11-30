// src/components/dashboard/SemesterStatsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";

interface SemesterStatsCardProps {
  title?: string;
  description?: string;
}

export default function SemesterStatsCard({
  title = "Estatísticas do Semestre",
  description = "Dados académicos",
}: SemesterStatsCardProps = {}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-5 mb-5">
            <Calendar className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Sem dados disponíveis
          </h3>
          
          <p className="text-sm text-muted-foreground max-w-xs">
            As estatísticas do semestre atual serão apresentadas assim que 
            o período letivo iniciar ou houver atividade académica registada.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Em breve aqui estarão as tuas métricas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}