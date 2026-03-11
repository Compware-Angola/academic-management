import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditDocenteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  docente: any
  form: any
  updateField: (field: string, value: string) => void
  onSave: () => void
}

export function EditDocenteDialog({
  open,
  onOpenChange,
  docente,
  form,
  updateField,
  onSave,
}: EditDocenteDialogProps) {
  if (!form) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Docente</DialogTitle>
          <DialogDescription>
            Atualize os dados do docente {docente?.nome}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">

          <div className="space-y-2">
            <Label>Código</Label>
            <Input value={form.codigo} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>Nome Completo</Label>
            <Input
              value={form.nome}
              onChange={(e) => updateField("nome", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Departamento</Label>
            <Select
              value={form.departamento}
              onValueChange={(v) => updateField("departamento", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engenharia Informática">
                  Engenharia Informática
                </SelectItem>
                <SelectItem value="Gestão de Empresas">
                  Gestão de Empresas
                </SelectItem>
                <SelectItem value="Arquitetura">
                  Arquitetura
                </SelectItem>
                <SelectItem value="Engenharia Civil">
                  Engenharia Civil
                </SelectItem>
                <SelectItem value="Matemática">
                  Matemática
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={form.categoria}
              onValueChange={(v) => updateField("categoria", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Professor Catedrático">
                  Professor Catedrático
                </SelectItem>
                <SelectItem value="Professora Associada">
                  Professora Associada
                </SelectItem>
                <SelectItem value="Professor Auxiliar">
                  Professor Auxiliar
                </SelectItem>
                <SelectItem value="Professora Auxiliar">
                  Professora Auxiliar
                </SelectItem>
                <SelectItem value="Assistente">Assistente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Grau Académico</Label>
            <Select
              value={form.grauAcademico}
              onValueChange={(v) => updateField("grauAcademico", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Doutorado">Doutorado</SelectItem>
                <SelectItem value="Mestrado">Mestrado</SelectItem>
                <SelectItem value="Licenciatura">Licenciatura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Especialidade</Label>
            <Input
              value={form.especialidade}
              onChange={(e) => updateField("especialidade", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Regime</Label>
            <Select
              value={form.regime}
              onValueChange={(v) => updateField("regime", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tempo Integral">
                  Tempo Integral
                </SelectItem>
                <SelectItem value="Tempo Parcial">
                  Tempo Parcial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={form.estado}
              onValueChange={(v) => updateField("estado", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Em Licença">Em Licença</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input
              value={form.telefone}
              onChange={(e) => updateField("telefone", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Guardar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}