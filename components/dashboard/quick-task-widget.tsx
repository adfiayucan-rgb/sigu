'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Send, BookOpen, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { HorarioConMateria, Materia } from '@/lib/types'
import { formatearA12Horas } from '@/lib/utils'

function getCurrentClassMateria(
  horarios: HorarioConMateria[],
  materias: Materia[]
): { materia: Materia | null; horario: HorarioConMateria | null; message: string } {
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes()

  // Find horario that matches current day and time
  const activeHorario = horarios.find((h) => {
    if (h.dia !== currentDay) return false

    const [startHour, startMin] = h.hora_inicio.split(':').map(Number)
    const [endHour, endMin] = h.hora_fin.split(':').map(Number)
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin

    return currentTime >= startTime && currentTime <= endTime
  })

  if (activeHorario) {
    const materia = materias.find((m) => m.id === activeHorario.materia_id)
    if (materia) {
      return {
        materia,
        horario: activeHorario,
        message: `Actualmente en clase de ${materia.nombre}`,
      }
    }
  }

  // No active class
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return {
    materia: null,
    horario: null,
    message: `No hay clases programadas para ${diasSemana[currentDay]} a las ${formatearA12Horas(now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }))}`,
  }
}

export function QuickTaskWidget({
  horarios,
  materias,
  onTaskCreated,
}: {
  horarios: HorarioConMateria[]
  materias: Materia[]
  onTaskCreated: () => void
}) {
  const [titulo, setTitulo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { materia, message } = useMemo(
    () => getCurrentClassMateria(horarios, materias),
    [horarios, materias]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!materia || !titulo.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.trim(),
          tipo: 'Tarea',
          materia_id: materia.id,
          fecha_entrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          completada: false,
        }),
      })

      if (!res.ok) throw new Error('Error al crear tarea')

      toast.success(`Tarea creada para ${materia.nombre}`)
      setTitulo('')
      onTaskCreated()
    } catch {
      toast.error('Error al crear la tarea')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div>
          <CardTitle className="text-sm font-medium">Tarea Rápida</CardTitle>
          <p className="text-xs text-muted-foreground">Basada en tu horario actual</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {materia ? (
          <>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: materia.color_hex }}
              />
              <span className="text-sm font-medium">{materia.nombre}</span>
              <Badge variant="secondary" className="text-xs ml-auto">
                <BookOpen className="h-3 w-3 mr-1" />
                En clase
              </Badge>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Título de la tarea..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="flex-1 h-9"
                required
              />
              <Button type="submit" size="sm" disabled={isLoading || !titulo.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex items-center gap-3 py-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-sm">{message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
