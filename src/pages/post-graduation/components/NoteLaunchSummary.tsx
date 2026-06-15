import { CircleCheck, CircleDashed, Users } from "lucide-react";

type NoteLaunchSummaryProps = {
  summary: {
    total: number;
    withGrade: number;
    withoutGrade: number;
  };
};

export function NoteLaunchSummary({ summary }: NoteLaunchSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex items-center justify-between border px-4 py-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Total de estudantes
          </p>
          <p className="text-2xl font-semibold">{summary.total}</p>
        </div>
        <Users className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex items-center justify-between border px-4 py-3">
        <div>
          <p className="text-sm text-muted-foreground">Com nota</p>
          <p className="text-2xl font-semibold">{summary.withGrade}</p>
        </div>
        <CircleCheck className="h-5 w-5 text-green-600" />
      </div>

      <div className="flex items-center justify-between border px-4 py-3">
        <div>
          <p className="text-sm text-muted-foreground">Sem nota</p>
          <p className="text-2xl font-semibold">{summary.withoutGrade}</p>
        </div>
        <CircleDashed className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}