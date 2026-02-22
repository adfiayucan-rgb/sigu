'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle } from 'lucide-react'
import { format, differenceInHours, isPast } from 'date-fns'
import { es } from 'date-fns/locale'
import type { ActividadConMateria } from '@/lib/types'

export function UrgentWidget({ actividades }: { actividades: ActividadConMateria[] }) {
  const now = new Date()
  const upcoming = actividades
    .filter((a) => !a.completada && !isPast(new Date(a.fecha_entrega)))
    .sort((a, b) => new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime())
    .slice(0, 5)

  const getUrgencyClass = (fecha: string) => {
    const hours = differenceInHours(new Date(fecha), now)
    if (hours < 24) return 'border-destructive-foreground/50 bg-destructive/10'
    if (hours < 72) return 'border-chart-4/50 bg-chart-4/10'
    return ''
  }

  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <Clock className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium">Proximas Entregas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No hay entregas pendientes
          </p>
        ) : (
          upcoming.map((a) => {
            const hoursLeft = differenceInHours(new Date(a.fecha_entrega), now)
            const isUrgent = hoursLeft < 24

            return (
              <div
                key={a.id}
                className={`flex items-center justify-between rounded-md border p-3 transition-colors ${getUrgencyClass(a.fecha_entrega)}`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium leading-none">{a.titulo}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.materia?.nombre} - {a.tipo}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isUrgent && (
                    <Badge variant="destructive" className="gap-1 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      Urgente
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(a.fecha_entrega), 'dd MMM, HH:mm', { locale: es })}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
