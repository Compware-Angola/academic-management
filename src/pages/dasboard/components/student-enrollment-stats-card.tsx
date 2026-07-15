import * as React from "react"
import { useQueryStudentStats } from "@/hooks/statics"
import { StudentStatsCard } from "./student-stats-card"
import { useUserActivity } from "@/hooks/use-user-activity"

export function StudentEnrollmentStatsCard() {
    const isActive = useUserActivity()
    const {
        data: dataStatics,
        isLoading: isLoadingStatics,
        isError: isErrorStatics,
        error: errorStatics,
    } = useQueryStudentStats(isActive)

    return (
        <StudentStatsCard
            title="Estudantes por Ano Lectivo"
            description="Total de estudantes matriculados"

            data={dataStatics?.data}
            isLoading={isLoadingStatics}
            isError={isErrorStatics}
            error={errorStatics}
        />
    )
}