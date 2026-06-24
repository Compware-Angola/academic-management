import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PermissionTypeDetails } from '@/constants/permission.type'
import ClassromList from '@/pages/classroom/ClassromList'
import CreateSchedule from '@/pages/schedules/CreateSchedule/CreateSchedule'
import { EditSchedule } from '@/pages/schedules/EditSchedule'
import SchedulesByRoom from '@/pages/schedules/ScheduleByRoom'
import ScheduleList from '@/pages/schedules/ScheduleList'
import ScheduleListEliminated from '@/pages/schedules/ScheduleListEliminated'
import SchedulesWithPermission from '@/pages/schedules/SchedulesWithPermission'
import { Route } from 'react-router-dom'

export const scheduleRoutes = (
    <>
        <Route
            path="/horarios/criar"
            element={
                <ProtectedRoute
                    allowedPermissions={[
                        PermissionTypeDetails.CRIAR_HORARIO.sigla!,
                    ]}
                >
                    <CreateSchedule />
                </ProtectedRoute>
            }
        />
        <Route path="/horarios/listar" element={<ScheduleList />} />
        <Route
            path="/horarios/eliminados"
            element={
                <ProtectedRoute
                    allowedPermissions={[
                        PermissionTypeDetails.LISTAR_HORARIOS_ELIMINADOS
                            .sigla!,
                    ]}
                >
                    <ScheduleListEliminated />
                </ProtectedRoute>
            }
        />
        <Route
            path="/horarios/permissao"
            element={
                <ProtectedRoute
                    allowedPermissions={[
                        PermissionTypeDetails.PERMISSAO_PARA_EDITAR_HORARIO
                            .sigla,
                    ]}
                >
                    <SchedulesWithPermission />
                </ProtectedRoute>
            }
        />
        <Route path="/schedule/:id/edit" element={<EditSchedule />} />
        <Route path="horarios/sala" element={<SchedulesByRoom />} />
        <Route
            path="/salas/listar"
            element={
                <ProtectedRoute
                    allowedPermissions={[
                        PermissionTypeDetails.LISTAR_SALAS.sigla!,
                    ]}
                >
                    <ClassromList />
                </ProtectedRoute>
            }
        />``
    </>
)