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
import type { PostGraduationNoteLaunchStudent } from "@/services/post-graduation/fetch-note-launch-students.service";
import { formatDateTimePt } from "@/util/date-formate";
import { Loader2 } from "lucide-react";

import { EditableNote } from "../NoteLaunch";
import { Button } from "@/components/ui/button";

type NoteLaunchTableProps = {
  students: PostGraduationNoteLaunchStudent[];
  editableNotes: Record<number, EditableNote>;
  disabled: boolean;
  savingStudents: number[];
  onGradeChange: (studentId: number, value: string) => void;
  onObservationChange: (studentId: number, value: string) => void;
  onSaveOne: (studentId: number) => void;
};

export function NoteLaunchTable({
  students,
  editableNotes,
  disabled,
  savingStudents,
  onGradeChange,
  onObservationChange,
  onSaveOne,
}: NoteLaunchTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Matrícula</TableHead>
            <TableHead>Estudante</TableHead>
            <TableHead>Estado Acadêmico</TableHead>
            <TableHead>Nota</TableHead>
            <TableHead>Observação</TableHead>
            <TableHead>Estado da Nota</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const { studentCurricularGradeId } = student;
            const note = editableNotes[studentCurricularGradeId];
            const isSaving = savingStudents.includes(studentCurricularGradeId);
            const lastUpdate =
              student.note.updatedAt ?? student.note.createdAt;

            return (
              <TableRow key={studentCurricularGradeId}>
                <TableCell className="font-medium">
                  {student.enrollmentId}
                </TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.academicStatus}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    step="0.1"
                    value={note?.grade ?? ""}
                    disabled={disabled || isSaving}
                    onChange={(e) =>
                      onGradeChange(studentCurricularGradeId, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell className="max-w-72 whitespace-normal break-words">
                  <Input
                    value={note?.observation ?? ""}
                    disabled={disabled || isSaving}
                    onChange={(e) =>
                      onObservationChange(studentCurricularGradeId, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  {student.note.id === null ? (
                    <Badge variant="secondary">Não lançada</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Lançada
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {lastUpdate ? formatDateTimePt(lastUpdate) : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    disabled={disabled || isSaving}
                    onClick={() => onSaveOne(studentCurricularGradeId)}
                  >
                    {isSaving ? (
                      
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Guardar"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}