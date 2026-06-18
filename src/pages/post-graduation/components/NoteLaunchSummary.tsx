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
    <div className="flex flex-wrap items-center">
      <div className="flex min-w-40 items-center gap-3 border-r px-4 py-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-none">{summary.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total de alunos</p>
        </div>
      </div>

      <div className="flex min-w-36 items-center gap-3 border-r px-4 py-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CircleCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-none text-emerald-600">
            {summary.withGrade}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Com nota</p>
        </div>
      </div>

      <div className="flex min-w-36 items-center gap-3 px-4 py-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <CircleDashed className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold leading-none text-amber-600">
            {summary.withoutGrade}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Sem nota</p>
        </div>
      </div>
    </div>
  );
}
