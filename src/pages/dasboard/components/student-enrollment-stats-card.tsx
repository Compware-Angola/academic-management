"use client"

import * as React from "react"
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect"
import { useQueryStudentStats } from "@/hooks/statics"
import { parseFilter } from "@/util/parse-filter"
import { StudentStatsCard } from "./student-stats-card"
import { useUserActivity } from "@/hooks/use-user-activity"

export function StudentEnrollmentStatsCard() {
    const isActive = useUserActivity()
    const [tipoCandidatura, setTipoCandidatura] = React.useState("1")

    const {
        data: dataStatics,
        isLoading: isLoadingStatics,
        isError: isErrorStatics,
        error: errorStatics,
    } = useQueryStudentStats({
        codigoCandidatura: parseFilter(tipoCandidatura),
    }, isActive)

    return (
        <StudentStatsCard
            title="Estudantes por Ano Lectivo"
            description="Total de estudantes matriculados"
            headerControls={
                <TipoCandidaturaSelect
                    value={tipoCandidatura}
                    onChangeValue={setTipoCandidatura}
                />
            }
            data={dataStatics?.data}
            isLoading={isLoadingStatics}
            isError={isErrorStatics}
            error={errorStatics}
        />
    )
}