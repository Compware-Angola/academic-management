import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

// 1️⃣ Interface enxuta em inglês
export interface StudentItem {
  fullName: string;
  courseUnit: string;
  year: string;
  semester: string;
}

// 2️⃣ Mapper: converte objeto original para StudentItem
export function mapStudent(original: any): StudentItem {
  return {
    fullName: original.nome_completo,
    courseUnit: original.unidadecurricular,
    year: original.ano,
    semester: original.semestre,
  };
}

// 3️⃣ Componente StudentCard
interface StudentCardProps {
  item: StudentItem;
}

export function ScheduleStudentCard({ item }: StudentCardProps) {
  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-medium text-base">{item.fullName}</p>

              <p className="text-sm text-muted-foreground">{item.courseUnit}</p>

              <p className="text-sm text-muted-foreground">
                {item.year} • Semester {item.semester}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
