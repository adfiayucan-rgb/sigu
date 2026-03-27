'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { format, differenceInHours, isPast, isToday, isTomorrow } from 'date-fns'
import { es } from 'date-fns/locale'
import type { ActividadConMateria } from '@/lib/types'

export function UrgentWidget({ actividades }: { actividades: ActividadConMateria[] }) {
  const now = new Date()
  const upcoming = actividades
    .filter((a) => !a.completada && !isPast(new Date(a.fecha_entrega)))
    .sort((a, b) => new Date(a.fecha_entrega).getTime() - new Date(b.fecha_entrega).getTime())
    .slice(0, 5)

  const getUrgencyStyles = (fecha: string) => {
    const hours = differenceInHours(new Date(fecha), now)
    if (hours < 24) return 'border-l-destructive bg-destructive/5'
    if (hours < 72) return 'border-l-chart-4 bg-chart-4/5'
    return 'border-l-primary bg-muted/30'
  }

  const getDateLabel = (fecha: string) => {
    const date = new Date(fecha)
    if (isToday(date)) return 'Hoy'
    if (isTomorrow(date)) return 'Mañana'
    return format(date, 'EEE d', { locale: es })
  }

  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Clock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <CardTitle className="text-sm font-medium">Próximas Entregas</CardTitle>
          <p className="text-xs text-muted-foreground">{upcoming.length} pendientes</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Todo al día</p>
            <p className="text-xs text-muted-foreground">No tienes entregas pendientes</p>
          </div>
        ) : (
          upcoming.map((a) => {
            const hoursLeft = differenceInHours(new Date(a.fecha_entrega), now)
            const isUrgent = hoursLeft < 24

            return (
              <div
                key={a.id}
                className={`flex items-center justify-between rounded-lg border-l-4 p-3 transition-colors ${getUrgencyStyles(a.fecha_entrega)}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: a.materia?.color_hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.titulo}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {a.materia?.nombre} - {a.tipo}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  {isUrgent && (
                    <Badge variant="destructive" className="gap-1 text-[10px] px-1.5 py-0">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      Urgente
                    </Badge>
                  )}
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium">
                      {getDateLabel(a.fecha_entrega)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(a.fecha_entrega), 'HH:mm', { locale: es })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
