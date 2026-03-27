'use client'

import { useSemestres, useMaterias, useHorarios } from '@/lib/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Calendar } from 'lucide-react'
import { useMemo } from 'react'
import type { HorarioConMateria } from '@/lib/types'

const DIAS = [
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
]

const HORAS = Array.from({ length: 15 }, (_, i) => i + 6) // 6am to 8pm

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function HorarioBlock({ horario }: { horario: HorarioConMateria }) {
  const startMinutes = timeToMinutes(horario.hora_inicio)
  const endMinutes = timeToMinutes(horario.hora_fin)
  const durationMinutes = endMinutes - startMinutes
  
  const startHour = Math.floor(startMinutes / 60)
  const startOffset = (startMinutes % 60) / 60
  
  const top = ((startHour - 6) + startOffset) * 64 // 64px per hour
  const height = (durationMinutes / 60) * 64

  return (
    <div
      className="absolute left-1 right-1 rounded-lg p-2 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] shadow-sm"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: horario.materia?.color_hex || '#3b82f6',
        minHeight: '48px',
      }}
    >
      <div className="flex flex-col h-full text-white">
        <span className="font-semibold text-xs leading-tight truncate">
          {horario.materia?.nombre}
        </span>
        <span className="text-[10px] opacity-90 flex items-center gap-1 mt-0.5">
          <Clock className="h-2.5 w-2.5" />
          {horario.hora_inicio.slice(0, 5)} - {horario.hora_fin.slice(0, 5)}
        </span>
        {horario.salon && height > 60 && (
          <span className="text-[10px] opacity-90 flex items-center gap-1 mt-auto">
            <MapPin className="h-2.5 w-2.5" />
            {horario.salon}
          </span>
        )}
      </div>
    </div>
  )
}

export default function HorarioPage() {
  const { data: semestres, isLoading: ls } = useSemestres()
  const semestreActual = semestres?.find((s) => s.es_actual)
  const { data: materias, isLoading: lm } = useMaterias(semestreActual?.id)
  const { data: horarios, isLoading: lh } = useHorarios()

  const isLoading = ls || lm || lh

  const materiasActuales = useMemo(() => 
    materias?.filter((m) => m.semestre_id === semestreActual?.id) ?? [],
    [materias, semestreActual]
  )

  const horariosActuales = useMemo(() =>
    horarios?.filter((h) => materiasActuales.some((m) => m.id === h.materia_id)) ?? [],
    [horarios, materiasActuales]
  )

  const horariosPorDia = useMemo(() => {
    const grouped: Record<number, HorarioConMateria[]> = {}
    DIAS.forEach(d => { grouped[d.value] = [] })
    horariosActuales.forEach(h => {
      if (grouped[h.dia]) {
        grouped[h.dia].push(h)
      }
    })
    return grouped
  }, [horariosActuales])

  const totalHoras = useMemo(() => {
    return horariosActuales.reduce((acc, h) => {
      const start = timeToMinutes(h.hora_inicio)
      const end = timeToMinutes(h.hora_fin)
      return acc + (end - start) / 60
    }, 0)
  }, [horariosActuales])

  const today = new Date().getDay()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Horario de Clases</h1>
          <p className="text-sm text-muted-foreground">
            {semestreActual ? semestreActual.nombre : 'Selecciona un semestre en Ajustes'}
          </p>
        </div>
        {!isLoading && horariosActuales.length > 0 && (
          <div className="flex gap-3">
            <Badge variant="secondary" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {horariosActuales.length} clases/semana
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {totalHoras.toFixed(0)}h semanales
            </Badge>
          </div>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-[700px] rounded-xl" />
      ) : horariosActuales.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Sin horario registrado</h3>
            <p className="text-muted-foreground max-w-sm">
              {semestreActual
                ? 'Agrega horarios a tus materias para ver tu semana académica.'
                : 'Crea un semestre activo en Ajustes para comenzar.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-medium">Vista Semanal</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-1 mb-2">
                  <div className="text-xs font-medium text-muted-foreground text-center py-2">
                    Hora
                  </div>
                  {DIAS.map((dia) => (
                    <div 
                      key={dia.value} 
                      className={`text-xs font-medium text-center py-2 rounded-lg ${
                        dia.value === today 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span className="hidden sm:inline">{dia.label}</span>
                      <span className="sm:hidden">{dia.short}</span>
                    </div>
                  ))}
                </div>
                
                {/* Grid */}
                <div className="grid grid-cols-[60px_repeat(6,1fr)] gap-1">
                  {/* Time column */}
                  <div className="flex flex-col">
                    {HORAS.map((hora) => (
                      <div 
                        key={hora} 
                        className="h-16 text-[11px] text-muted-foreground text-right pr-2 pt-0.5"
                      >
                        {hora.toString().padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>
                  
                  {/* Day columns */}
                  {DIAS.map((dia) => (
                    <div 
                      key={dia.value} 
                      className={`relative border-l ${
                        dia.value === today ? 'bg-primary/5' : ''
                      }`}
                    >
                      {/* Hour lines */}
                      {HORAS.map((hora) => (
                        <div 
                          key={hora} 
                          className="h-16 border-t border-dashed border-border/50"
                        />
                      ))}
                      {/* Horarios */}
                      {horariosPorDia[dia.value]?.map((h) => (
                        <HorarioBlock key={h.id} horario={h} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      {!isLoading && horariosActuales.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Materias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {materiasActuales
                .filter(m => horariosActuales.some(h => h.materia_id === m.id))
                .map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: m.color_hex }} 
                    />
                    <span className="text-sm">{m.nombre}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
