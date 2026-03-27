'use client'

import { useSemestres, useMaterias, useActividades, useHorarios } from '@/lib/hooks'
import { UrgentWidget } from '@/components/dashboard/urgent-widget'
import { GradeOverview } from '@/components/dashboard/grade-overview'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { QuickTaskWidget } from '@/components/dashboard/quick-task-widget'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, Clock, Target } from 'lucide-react'
import { useMemo } from 'react'
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

const DIAS_LABEL: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
}

export default function DashboardPage() {
  const { data: semestres, isLoading: loadingSemestres } = useSemestres()
  const { data: materias, isLoading: loadingMaterias } = useMaterias()
  const { data: actividades, isLoading: loadingActividades, mutate: mutateActividades } = useActividades()
  const { data: horarios, isLoading: loadingHorarios } = useHorarios()

  const isLoading = loadingSemestres || loadingMaterias || loadingActividades || loadingHorarios
  const semestreActual = semestres?.find((s) => s.es_actual)
  const materiasActuales = useMemo(() =>
    materias?.filter((m) => m.semestre_id === semestreActual?.id) ?? [],
    [materias, semestreActual]
  )
  const actividadesActuales = useMemo(() =>
    actividades?.filter((a) => materiasActuales.some((m) => m.id === a.materia_id)) ?? [],
    [actividades, materiasActuales]
  )
  const horariosActuales = useMemo(() =>
    horarios?.filter((h) => materiasActuales.some((m) => m.id === h.materia_id)) ?? [],
    [horarios, materiasActuales]
  )

  // Today's classes
  const today = new Date().getDay()
  const clasesHoy = useMemo(() =>
    horariosActuales
      .filter((h) => h.dia === today)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)),
    [horariosActuales, today]
  )

  // Days until semester ends
  const diasRestantes = useMemo(() => {
    if (!semestreActual?.fecha_fin) return null
    return differenceInDays(new Date(semestreActual.fecha_fin), new Date())
  }, [semestreActual])

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-balance">{getGreeting()}</h1>
        <p className="text-sm text-muted-foreground">
          {semestreActual 
            ? `${semestreActual.nombre} ${diasRestantes !== null && diasRestantes > 0 ? `- ${diasRestantes} días restantes` : ''}` 
            : 'Sin semestre activo'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl md:col-span-2" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : (
        <>
          {/* Today's Schedule Card */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-medium">Hoy, {DIAS_LABEL[today]}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {format(new Date(), 'd MMM', { locale: es })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {clasesHoy.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    No tienes clases programadas hoy.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {clasesHoy.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-background/50"
                      >
                        <div
                          className="h-10 w-1 rounded-full"
                          style={{ backgroundColor: h.materia?.color_hex }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{h.materia?.nombre}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                            </span>
                            {h.salon && (
                              <>
                                <span className="text-muted-foreground/50">|</span>
                                <span>{h.salon}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{materiasActuales.length}</p>
                  <p className="text-xs text-muted-foreground">Materias activas</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {actividadesActuales.filter((a) => !a.completada).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Task Widget */}
          <QuickTaskWidget
            horarios={horariosActuales}
            materias={materiasActuales}
            onTaskCreated={() => mutateActividades()}
          />

          {/* Main Widgets */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <UrgentWidget actividades={actividadesActuales} />
            <GradeOverview materias={materiasActuales} actividades={actividadesActuales} />
            <ProgressChart actividades={actividadesActuales} />
          </div>
        </>
      )}
    </div>
  )
}
