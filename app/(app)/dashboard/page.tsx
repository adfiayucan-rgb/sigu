'use client'

import { useSemestres, useMaterias, useActividades } from '@/lib/hooks'
import { UrgentWidget } from '@/components/dashboard/urgent-widget'
import { GradeOverview } from '@/components/dashboard/grade-overview'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { data: semestres, isLoading: loadingSemestres } = useSemestres()
  const { data: materias, isLoading: loadingMaterias } = useMaterias()
  const { data: actividades, isLoading: loadingActividades } = useActividades()

  const isLoading = loadingSemestres || loadingMaterias || loadingActividades
  const semestreActual = semestres?.find((s) => s.es_actual)
  const materiasActuales = materias?.filter((m) => m.semestre_id === semestreActual?.id) ?? []
  const actividadesActuales = actividades?.filter((a) =>
    materiasActuales.some((m) => m.id === a.materia_id)
  ) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {semestreActual ? semestreActual.nombre : 'Sin semestre activo'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UrgentWidget actividades={actividadesActuales} />
          <GradeOverview
            materias={materiasActuales}
            actividades={actividadesActuales}
          />
          <ProgressChart actividades={actividadesActuales} />
        </div>
      )}
    </div>
  )
}
