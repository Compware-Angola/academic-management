import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface ConfigSection {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    disabled?: boolean;
}

interface Props {
    sections: ConfigSection[];
    active: string;
    onChange: (id: string) => void;
}

export function ConfiguracoesSidebar({ sections, active, onChange }: Props) {
    return (
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Secções de configuração">
            {sections.map((s) => (
                <button
                    key={s.id}
                    type="button"
                    disabled={s.disabled}
                    onClick={() => onChange(s.id)}
                    className={cn(
                        "flex min-w-[200px] items-start gap-3 rounded-lg border p-3 text-left transition-colors lg:min-w-0",
                        active === s.id ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/60",
                        s.disabled && "cursor-not-allowed opacity-50",
                    )}
                >
                    <s.icon className={cn("mt-0.5 h-4 w-4 shrink-0", active === s.id ? "text-primary" : "text-muted-foreground")} />
                    <div>
                        <p className="text-sm font-medium leading-none">{s.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                    </div>
                </button>
            ))}
        </nav>
    );
}