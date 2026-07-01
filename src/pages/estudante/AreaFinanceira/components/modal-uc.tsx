import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

// ---------- Tipos ----------
interface CadeiraRecurso {
  id: number;
  codigo: string;
  disciplina: string;
  anoAcademico: string; // ex: "2025-2026"
}

interface ModalCadeirasRecursoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anoAcademico: string; // parâmetro recebido de fora, define o filtro
  onConfirm?: (idsSelecionados: number[]) => void;
}

// ---------- Dados mocados ----------
const CADEIRAS_MOCK: CadeiraRecurso[] = [
  {
    id: 1,
    codigo: "1544502",
    disciplina: "Direito Administrativo I",
    anoAcademico: "2025-2026",
  },
  {
    id: 2,
    codigo: "1544503",
    disciplina: "História do Pensamento Jurídico",
    anoAcademico: "2025-2026",
  },
  {
    id: 3,
    codigo: "1544504",
    disciplina: "Bioética e Biodireito",
    anoAcademico: "2025-2026",
  },
  {
    id: 4,
    codigo: "1544505",
    disciplina: "Direito Comercial I",
    anoAcademico: "2025-2026",
  },
  {
    id: 5,
    codigo: "1544506",
    disciplina: "Direito das Obrigações I",
    anoAcademico: "2025-2026",
  },
  {
    id: 6,
    codigo: "1544507",
    disciplina: "Direito do Ambiente",
    anoAcademico: "2025-2026",
  },
  {
    id: 7,
    codigo: "1544508",
    disciplina: "Direito do Registo e Notariado",
    anoAcademico: "2025-2026",
  },
  {
    id: 8,
    codigo: "1544510",
    disciplina: "Direito Fiscal I",
    anoAcademico: "2025-2026",
  },
  {
    id: 9,
    codigo: "1544511",
    disciplina: "Direito Processual Civil I",
    anoAcademico: "2025-2026",
  },
  {
    id: 10,
    codigo: "1544509",
    disciplina: "Direito do Trabalho e Segurança Social",
    anoAcademico: "2025-2026",
  },
  {
    id: 11,
    codigo: "1533201",
    disciplina: "Direito Civil III",
    anoAcademico: "2024-2025",
  },
  {
    id: 12,
    codigo: "1533202",
    disciplina: "Direito Penal II",
    anoAcademico: "2024-2025",
  },
];

export function ModalCadeirasRecurso({
  open,
  onOpenChange,
  anoAcademico,
  onConfirm,
}: ModalCadeirasRecursoProps) {
  const [selecionadas, setSelecionadas] = useState<Set<number>>(new Set());

  // Filtra as cadeiras pelo ano académico recebido como parâmetro
  const cadeiras = CADEIRAS_MOCK.filter((c) => c.anoAcademico === anoAcademico);

  const totalSelecionadas = selecionadas.size;
  const todasSelecionadas =
    cadeiras.length > 0 && selecionadas.size === cadeiras.length;

  // Sempre que o modal reabre ou o ano muda, limpa a seleção
  useEffect(() => {
    if (open) {
      setSelecionadas(new Set());
    }
  }, [open, anoAcademico]);

  // ---------- Métodos ----------
  const handleToggleCadeira = (id: number) => {
    setSelecionadas((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  };

  const handleToggleTodas = () => {
    if (todasSelecionadas) {
      setSelecionadas(new Set());
    } else {
      setSelecionadas(new Set(cadeiras.map((c) => c.id)));
    }
  };

  const handleConfirmar = () => {
    const idsSelecionados = Array.from(selecionadas);
    onConfirm?.(idsSelecionados);
    handleFechar();
  };

  const handleFechar = () => {
    setSelecionadas(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle>
            Seleciona a(s) Cadeira(s) para o Exame de Recurso — {anoAcademico}
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={todasSelecionadas}
                    onCheckedChange={handleToggleTodas}
                  />
                </TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Disciplina</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cadeiras.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-6"
                  >
                    Nenhuma cadeira de recurso encontrada para {anoAcademico}.
                  </TableCell>
                </TableRow>
              ) : (
                cadeiras.map((cadeira) => (
                  <TableRow key={cadeira.id}>
                    <TableCell>
                      <Checkbox
                        checked={selecionadas.has(cadeira.id)}
                        onCheckedChange={() => handleToggleCadeira(cadeira.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {cadeira.codigo}
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {cadeira.disciplina}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleFechar}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} disabled={totalSelecionadas === 0}>
            Adicionar {totalSelecionadas > 0 && `(${totalSelecionadas})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
