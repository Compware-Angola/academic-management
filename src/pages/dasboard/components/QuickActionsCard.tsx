// src/components/dashboard/QuickActionsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsCardProps {
  title?: string;
  description?: string;
}

const defaultEmptyState = {
  title: "Tudo em dia!",
  description: "Não tens tarefas ou ações pendentes no momento.",
  icon: <CheckCircle2 className="h-10 w-10 text-green-500" />,
  emoji: "😊",
};

export default function QuickActionsCard({
  title = "Ações Rápidas",
  description = "Tarefas pendentes",
}: QuickActionsCardProps = {}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Estado vazio bonito */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4">
            {defaultEmptyState.icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {defaultEmptyState.title}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {defaultEmptyState.description}
          </p>
          <div className="mt-4 text-4xl">
            {defaultEmptyState.emoji}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}