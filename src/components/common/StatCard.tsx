import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isAvailable?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isAvailable = true,
}: StatCardProps) {
  if (!isAvailable) {
    return (
      <Card className="relative overflow-hidden border-dashed opacity-75">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground/40" />
        </CardHeader>
        <CardContent>
          {/* Valor mascarado com blur */}
          <div className="text-2xl font-bold blur-sm select-none text-muted-foreground">
            — — —
          </div>

          {/* Badge de indisponível */}
          <div className="flex items-center gap-1.5 mt-3 px-2 py-1 rounded-md bg-amber-50 border border-amber-200 w-fit">
            <Clock className="h-3 w-3 text-amber-600 shrink-0" />
            <span className="text-xs font-medium text-amber-700">
              Temporariamente indisponível
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className={`text-xs font-medium ${trend.isPositive ? "text-success" : "text-destructive"
                }`}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}