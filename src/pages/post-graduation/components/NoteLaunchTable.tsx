import { Badge } from "@/components/ui/badge";
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

type NoteLaunchTableProps = {
  students: PostGraduationNoteLaunchStudent[];
};

export function NoteLaunchTable({ students }: NoteLaunchTableProps) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const lastUpdate =
              student.note.updatedAt ?? student.note.createdAt;

            return (
              <TableRow key={student.studentCurricularGradeId}>
                <TableCell className="font-medium">
                  {student.enrollmentId}
                </TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.academicStatus}</TableCell>
                <TableCell>
                  {student.note.grade === null
                    ? "—"
                    : `${student.note.grade} valores`}
                </TableCell>
                <TableCell className="max-w-72 whitespace-normal break-words">
                  {student.note.observation || "—"}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}