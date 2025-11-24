// src/components/dashboard/QuickActionsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, AlertCircle, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  count?: number | string;
  variant?: "warning" | "primary" | "default";
  icon?: React.ReactNode;
}

interface QuickActionsCardProps {
  title?: string;
  description?: string;
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    title: "Pautas para validar",
    description: "Avaliações → Validação",
    count: 8,
    variant: "warning",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    title: "Novos candidatos",
    description: "Exame de Acesso",
    count: 12,
    variant: "primary",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Solicitações pendentes",
    description: "Comunicação",
    count: 3,
    variant: "default",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

export default function QuickActionsCard({
  title = "Ações Rápidas",
  description = "Tarefas pendentes",
  actions = defaultActions,
}: QuickActionsCardProps = {}) {
  const getVariantStyles = (variant: QuickAction["variant"]) => {
    switch (variant) {
      case "warning":
        return "bg-warning/10 border-warning/20 hover:bg-warning/15";
      case "primary":
        return "bg-primary/10 border-primary/20 hover:bg-primary/15";
      case "default":
      default:
        return "bg-accent/50 hover:bg-accent/70";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
           <CardTitle className="text-xl">  {title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer",
              getVariantStyles(action.variant)
            )}
          >
            <div className="mt-0.5">
              {action.icon || <AlertCircle className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold flex items-center gap-2">
                {action.title}
                {action.count !== undefined && (
                  <span className="inline-flex items-center justify-center min-w-6 h-6 rounded-full bg-background text-foreground text-xs font-bold border">
                    {action.count}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}