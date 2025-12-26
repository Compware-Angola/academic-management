import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export type GuardItem = string;

interface StudentCardProps {
  item: GuardItem;
}

export function GuardsCard({ item }: StudentCardProps) {
  return (
    <>
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="font-medium text-base">{item}</p>

              <p className="text-sm text-muted-foreground">Docente Vigilante</p>

              {/* <p className="text-sm text-muted-foreground">
                {item.year} • Semester {item.semester}
              </p> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
