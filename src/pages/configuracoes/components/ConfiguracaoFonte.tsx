import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Info, RotateCcw, Type } from "lucide-react";
import {
    DEFAULT_FONT_SETTINGS, FONT_FAMILIES, FONT_WEIGHTS, FontSettings,
} from "@/lib/settingsApi";

interface Props {
    value: FontSettings;
    onChange: (value: FontSettings) => void;
    isLoading?: boolean;
}

function Hint({ text }: { text: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px]">{text}</TooltipContent>
        </Tooltip>
    );
}

export function ConfiguracaoFonte({ value, onChange, isLoading }: Props) {
    const set = <K extends keyof FontSettings>(key: K, v: FontSettings[K]) =>
        onChange({ ...value, [key]: v });

    if (isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-5 w-56" /></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Type className="h-4 w-4 text-primary" />
                        Tipo de letra dos documentos
                    </CardTitle>
                    <CardDescription>
                        Configuração global aplicada a todos os documentos gerados pelo sistema.
                    </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => onChange(DEFAULT_FONT_SETTINGS)}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Repor padrão
                </Button>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Família da fonte</Label>
                    <Select value={value.fontFamily} onValueChange={(v) => set("fontFamily", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {FONT_FAMILIES.map((f) => (
                                <SelectItem key={f} value={f}><span style={{ fontFamily: f }}>{f}</span></SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Peso da fonte</Label>
                    <Select value={value.fontWeight} onValueChange={(v) => set("fontWeight", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {FONT_WEIGHTS.map((w) => (
                                <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                        Tamanho da fonte <span className="text-muted-foreground">({value.fontSize}px)</span>
                        <Hint text="Tamanho do texto corrente do documento." />
                    </Label>
                    <Slider min={8} max={24} step={1} value={[value.fontSize]}
                        onValueChange={([v]) => set("fontSize", v)} />
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                        Espaçamento entre linhas <span className="text-muted-foreground">({value.lineHeight})</span>
                        <Hint text="Multiplicador da altura da linha em relação ao tamanho da fonte." />
                    </Label>
                    <Slider min={1} max={2.5} step={0.1} value={[value.lineHeight]}
                        onValueChange={([v]) => set("lineHeight", Number(v.toFixed(1)))} />
                </div>

                <div className="space-y-2">
                    <Label>Tamanho do título ({value.titleSize}px)</Label>
                    <Slider min={12} max={40} step={1} value={[value.titleSize]}
                        onValueChange={([v]) => set("titleSize", v)} />
                </div>

                <div className="space-y-2">
                    <Label>Tamanho dos subtítulos ({value.subtitleSize}px)</Label>
                    <Slider min={10} max={30} step={1} value={[value.subtitleSize]}
                        onValueChange={([v]) => set("subtitleSize", v)} />
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <Label>Cor da fonte</Label>
                    <div className="flex items-center gap-3">
                        <Input type="color" value={value.color} onChange={(e) => set("color", e.target.value)}
                            className="h-10 w-16 cursor-pointer p-1" />
                        <Input value={value.color} onChange={(e) => set("color", e.target.value)}
                            className="max-w-[140px] font-mono uppercase" maxLength={7} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}