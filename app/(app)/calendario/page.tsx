'use client'

import { useState, useMemo } from 'react'
import { useActividades, useMaterias, useSemestres } from '@/lib/hooks'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { format, isSameDay, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertTriangle } from 'lucide-react'

export default function CalendarioPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { data: semestres } = useSemestres()
  const { data: materias } = useMaterias()
  const { data: actividades, isLoading } = useActividades()

  const semestreActual = semestres?.find((s) => s.es_actual)
  const materiasActuales = materias?.filter((m) => m.semestre_id === semestreActual?.id) ?? []
  const actividadesActuales = actividades?.filter((a) =>
    materiasActuales.some((m) => m.id === a.materia_id)
  ) ?? []

  const datesWithEvents = useMemo(() => {
    const dates = new Set<string>()
    actividadesActuales.forEach((a) => {
      dates.add(format(new Date(a.fecha_entrega), 'yyyy-MM-dd'))
    })
    return dates
  }, [actividadesActuales])

  const selectedActividades = useMemo(() => {
    if (!selectedDate) return []
    return actividadesActuales.filter((a) =>
      isSameDay(new Date(a.fecha_entrega), selectedDate)
    )
  }, [selectedDate, actividadesActuales])

  const modifiers = useMemo(() => {
    return {
      hasEvent: (date: Date) => datesWithEvents.has(format(date, 'yyyy-MM-dd')),
    }
  }, [datesWithEvents])

  const modifiersClassNames = {
    hasEvent: 'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary',
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Calendario</h1>
        <p className="text-sm text-muted-foreground">
          Vista mensual de entregas y examenes
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 rounded-lg" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={es}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {selectedDate
                  ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })
                  : 'Selecciona una fecha'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedActividades.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Sin actividades para este dia
                </p>
              ) : (
                selectedActividades.map((a) => {
                  const hoursLeft = differenceInHours(new Date(a.fecha_entrega), new Date())
                  const isUrgent = hoursLeft > 0 && hoursLeft < 24

                  return (
                    <div
                      key={a.id}
                      className={`flex items-center justify-between rounded-md border p-3 ${
                        isUrgent ? 'border-destructive-foreground/50 bg-destructive/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: a.materia?.color_hex ?? '#3b82f6' }}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-sm font-medium ${a.completada ? 'line-through text-muted-foreground' : ''}`}>
                            {a.titulo}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {a.materia?.nombre} - {a.tipo}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isUrgent && (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            Urgente
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(a.fecha_entrega), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
