import { Badge } from "@/components/ui/badge";

interface BadgeStatusProps {
    status: number;
}

export function BadgeStatus({ status }: BadgeStatusProps) {
    const config: Record<number, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
        0: { label: "Pendente", variant: "outline" },
        1: { label: "Respondido", variant: "default" },
    };
    const cfg = config[status] || { label: `Status ${status}`, variant: "secondary" };
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}