import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Settings, Pencil, Plus, RefreshCw, Download, Printer } from "lucide-react";
import { toast } from "sonner";

interface Parametro {
  id: number;
  designacao: string;
  sigla: string;
  valor: string;
  tipo: "numero" | "texto" | "boolean";
  descricao: string;
  ativo: boolean;
  ordem: number;
}

const Parametros = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedParam, setSelectedParam] = useState<Parametro | null>(null);
  const [editForm, setEditForm] = useState<Parametro | null>(null);

  const [parametros, setParametros] = useState<Parametro[]>([
    { id: 1, designacao: "Máximo de Horas Semanais por Docente", sigla: "MAX_HORAS", valor: "40", tipo: "numero", descricao: "Número máximo de horas que um docente pode lecionar por semana", ativo: true, ordem: 1 },
    { id: 2, designacao: "Máximo de UCs por Docente", sigla: "MAX_UCS", valor: "5", tipo: "numero", descricao: "Número máximo de unidades curriculares por docente", ativo: true, ordem: 2 },
    { id: 3, designacao: "Permitir Sobreposição de Horários", sigla: "SOBREPOSICAO", valor: "false", tipo: "boolean", descricao: "Permite que um docente tenha aulas no mesmo horário", ativo: false, ordem: 3 },
    { id: 4, designacao: "Validar Disponibilidade", sigla: "VALIDAR_DISP", valor: "true", tipo: "boolean", descricao: "Verifica a disponibilidade do docente antes de afetar", ativo: true, ordem: 4 },
    { id: 5, designacao: "Notificar Docente sobre Novas Afetações", sigla: "NOTIF_AFETACAO", valor: "true", tipo: "boolean", descricao: "Envia email automático quando docente é afetado", ativo: true, ordem: 5 },
    { id: 6, designacao: "Notificar sobre Alterações de Horário", sigla: "NOTIF_HORARIO", valor: "true", tipo: "boolean", descricao: "Alerta docentes sobre mudanças nos horários", ativo: true, ordem: 6 },
    { id: 7, designacao: "Máximo de Horas Extras Mensais", sigla: "MAX_HORAS_EXTRA", valor: "20", tipo: "numero", descricao: "Limite de horas extras mensais permitidas", ativo: true, ordem: 7 },
    { id: 8, designacao: "Período Mínimo entre Aulas (minutos)", sigla: "MIN_INTERVALO", valor: "15", tipo: "numero", descricao: "Intervalo mínimo entre duas aulas consecutivas", ativo: true, ordem: 8 },
    { id: 9, designacao: "Exigir Validação do Diretor de Curso", sigla: "VALID_DIRETOR", valor: "true", tipo: "boolean", descricao: "Requer aprovação do diretor para afetações", ativo: true, ordem: 9 },
    { id: 10, designacao: "Prefixo de Código de Docente", sigla: "PREFIX_COD", valor: "DOC", tipo: "texto", descricao: "Prefixo utilizado na geração de códigos de docente", ativo: true, ordem: 10 },
  ]);

  const handleToggle = (id: number) => {
    setParametros(prev => prev.map(p =>
      p.id === id ? { ...p, ativo: !p.ativo } : p
    ));
    const param = parametros.find(p => p.id === id);
    toast.success(`Parâmetro "${param?.sigla}" ${param?.ativo ? "desativado" : "ativado"}`);
  };

  const handleEdit = (param: Parametro) => {
    setSelectedParam(param);
    setEditForm({ ...param });
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      setParametros(prev => prev.map(p => p.id === editForm.id ? editForm : p));
      toast.success(`Parâmetro "${editForm.sigla}" atualizado com sucesso!`);
      setEditModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/gestao-docentes">Gestão de Docentes</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Parâmetros</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Parâmetros de Gestão de Docentes</h1>
          <p className="text-muted-foreground mt-1">Configure os parâmetros do sistema de gestão docente</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Atualizar</Button>
          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Exportar</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" />Novo Parâmetro</Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Parâmetros</p>
          <p className="text-3xl font-bold">{parametros.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Ativos</p>
          <p className="text-3xl font-bold text-primary">{parametros.filter(p => p.ativo).length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Inativos</p>
          <p className="text-3xl font-bold text-muted-foreground">{parametros.filter(p => !p.ativo).length}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Designação</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : parametros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Nenhum parâmetro encontrado</TableCell>
                </TableRow>
              ) : (
                parametros.map((param) => (
                  <TableRow key={param.id} className={!param.ativo ? "opacity-60" : ""}>
                    <TableCell className="font-mono text-sm">{param.ordem}</TableCell>
                    <TableCell className="font-medium max-w-[200px]">{param.designacao}</TableCell>
                    <TableCell><Badge variant="outline" className="font-mono">{param.sigla}</Badge></TableCell>
                    <TableCell>
                      {param.tipo === "boolean" ? (
                        <Badge variant={param.valor === "true" ? "default" : "secondary"}>{param.valor === "true" ? "Sim" : "Não"}</Badge>
                      ) : (
                        <span className="font-mono">{param.valor}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{param.tipo === "numero" ? "Número" : param.tipo === "boolean" ? "Booleano" : "Texto"}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px] text-sm text-muted-foreground truncate">{param.descricao}</TableCell>
                    <TableCell className="text-center">
                      <Switch checked={param.ativo} onCheckedChange={() => handleToggle(param.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(param)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Editar Parâmetro */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Editar Parâmetro
            </DialogTitle>
            <DialogDescription>Editar o parâmetro: {selectedParam?.sigla}</DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Designação</Label>
                <Input value={editForm.designacao} onChange={(e) => setEditForm({ ...editForm, designacao: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sigla</Label>
                  <Input value={editForm.sigla} onChange={(e) => setEditForm({ ...editForm, sigla: e.target.value })} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input type="number" value={editForm.ordem} onChange={(e) => setEditForm({ ...editForm, ordem: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                {editForm.tipo === "boolean" ? (
                  <div className="flex items-center gap-3 pt-1">
                    <Switch checked={editForm.valor === "true"} onCheckedChange={(v) => setEditForm({ ...editForm, valor: v ? "true" : "false" })} />
                    <span className="text-sm">{editForm.valor === "true" ? "Ativado" : "Desativado"}</span>
                  </div>
                ) : (
                  <Input type={editForm.tipo === "numero" ? "number" : "text"} value={editForm.valor} onChange={(e) => setEditForm({ ...editForm, valor: e.target.value })} />
                )}
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input value={editForm.descricao} onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <Label>Ativo</Label>
                <Switch checked={editForm.ativo} onCheckedChange={(v) => setEditForm({ ...editForm, ativo: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parametros;
