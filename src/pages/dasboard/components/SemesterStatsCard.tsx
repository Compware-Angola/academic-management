// src/components/dashboard/SemesterStatsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  isPositive?: boolean; // opcional: para cor verde
}

interface SemesterStatsCardProps {
  title?: string;
  description?: string;
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { label: "Taxa de Aprovação", value: "87%", isPositive: true },
  { label: "Assiduidade Média", value: "92%", isPositive: true },
  { label: "Avaliações Realizadas", value: "1,246" },
];

export default function SemesterStatsCard({
  title = "Estatísticas do Semestre",
  description = "Dados académicos",
  stats = defaultStats,
}: SemesterStatsCardProps = {}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
           <CardTitle className="text-xl">  {title}</CardTitle>
       
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 rounded-lg bg-accent/50 transition-colors hover:bg-accent/70"
          >
            <span className="text-sm font-medium text-foreground">
              {stat.label}
            </span>
            <span
              className={`text-sm font-bold ${
                stat.isPositive ? "text-success" : "text-foreground"
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}