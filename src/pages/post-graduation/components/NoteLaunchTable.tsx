import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PostGraduationNoteLaunchStudent } from "@/services/post-graduation/fetch-note-launch-students.service";
import { Loader2, Lock, RefreshCw, Save, Unlock } from "lucide-react";

import type { EditableNote } from "../NoteLaunch";
import { Button } from "@/components/ui/button";

type NoteLaunchTableProps = {
  students: PostGraduationNoteLaunchStudent[];
  editableNotes: Record<number, EditableNote>;
  disabled: boolean;
  savingStudents: number[];
  lockedStudents: Record<number, boolean>;
  onGradeChange: (studentId: number, value: string) => void;
  onObservationChange: (studentId: number, value: string) => void;
  onSaveOne: (studentId: number) => void;
  onResetOne: (studentId: number) => void;
  onToggleLock: (studentId: number) => void;
  isChanged: (studentId: number) => boolean;
};

export function NoteLaunchTable({
  students,
  editableNotes,
  disabled,
  savingStudents,
  lockedStudents,
  onGradeChange,
  onObservationChange,
  onSaveOne,
  onResetOne,
  onToggleLock,
  isChanged,
}: NoteLaunchTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Nº Matrícula</TableHead>
              <TableHead>Nome do Estudante</TableHead>
              <TableHead className="w-[600px] text-center">Descrição</TableHead>
              <TableHead className="w-[140px] text-center">
                Nota (0-20)
              </TableHead>
              <TableHead className="w-[140px] text-center">Estado</TableHead>
              <TableHead className="w-[150px] text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const { studentCurricularGradeId } = student;
              const note = editableNotes[studentCurricularGradeId];
              const isSaving = savingStudents.includes(
                studentCurricularGradeId,
              );
              const isLocked = lockedStudents[studentCurricularGradeId] ?? true;

              return (
                <TableRow key={studentCurricularGradeId} className="h-[68px]">
                  <TableCell className="font-mono text-sm">
                    {student.enrollmentId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.fullName}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={note?.observation ?? ""}
                      placeholder="Pequena descrição..."
                      className="min-w-[360px]"
                      disabled={disabled || isSaving || isLocked}
                      onChange={(e) =>
                        onObservationChange(
                          studentCurricularGradeId,
                          e.target.value,
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min={0}
                      max={20}
                      step="0.1"
                      value={note?.grade ?? ""}
                      className="mx-auto w-24 text-center"
                      placeholder="0-20"
                      disabled={disabled || isSaving || isLocked}
                      onChange={(e) =>
                        onGradeChange(studentCurricularGradeId, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {student.note.id === null ? (
                      <Badge variant="secondary">Pendente</Badge>
                    ) : (
                      <Badge className="bg-green-600 hover:bg-green-600">
                        Lançada
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={disabled || isSaving}
                            onClick={() =>
                              onToggleLock(studentCurricularGradeId)
                            }
                          >
                            {isLocked ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {isLocked ? "Desbloquear" : "Bloquear"}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant={
                              student.note.id === null
                                ? "outline"
                                : "destructive"
                            }
                            disabled={
                              disabled ||
                              isSaving ||
                              isLocked ||
                              !isChanged(studentCurricularGradeId)
                            }
                            onClick={() => onSaveOne(studentCurricularGradeId)}
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {student.note.id === null ? "Lançar" : "Atualizar"}
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={
                              disabled ||
                              isSaving ||
                              isLocked ||
                              student.note.id === null
                            }
                            onClick={() => onResetOne(studentCurricularGradeId)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Resetar</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
