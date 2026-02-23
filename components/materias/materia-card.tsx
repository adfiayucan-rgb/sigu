'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Materia, ActividadConMateria } from '@/lib/types'
import { toast } from 'sonner'

function calcularGrading(actividades: ActividadConMateria[]) {
  const parciales = actividades.filter((a) =>
    ['Parcial 1', 'Parcial 2', 'Parcial 3'].includes(a.tipo)
  )
  const final = actividades.find((a) => a.tipo === 'Final')

  const pesoPorParcial = 70 / 3
  let acumulado70 = 0
  let porcentajeCubierto = 0

  parciales.forEach((p) => {
    if (p.nota !== null) {
      const peso = p.porcentaje_manual ?? pesoPorParcial
      acumulado70 += ((p.nota) / 5) * peso
      porcentajeCubierto += peso
    }
  })

  let acumuladoTotal = acumulado70
  if (final?.nota !== null && final?.nota !== undefined) {
    acumuladoTotal += ((final.nota) / 5) * 30
    porcentajeCubierto += 30
  }

  const notaProyectada = porcentajeCubierto > 0 ? (acumuladoTotal / porcentajeCubierto) * 5 : 0

  // Calculate minimum final exam grade to pass (3.0)
  const notaMinAprobacion = 3.0
  const faltaPara3 = (notaMinAprobacion / 5) * 100 - acumulado70
  const notaFinalNecesaria = faltaPara3 > 0 ? (faltaPara3 / 30) * 5 : 0

  return {
    acumulado70,
    porcentajeCubierto,
    notaProyectada,
    notaFinalNecesaria: Math.min(Math.max(notaFinalNecesaria, 0), 5),
    parciales,
    final,
  }
}

export function   MateriaCard({
  materia,
  actividades,
  onAddActividad,
  onDeleteMateria,
}: {
  materia: Materia
  actividades: ActividadConMateria[]
  onAddActividad: () => void
  onDeleteMateria: () => void
}) {
  const { acumulado70, porcentajeCubierto, notaProyectada, notaFinalNecesaria, parciales } =
    calcularGrading(actividades)

  const handleToggle = async (id: string, completada: boolean) => {
    await fetch(`/api/actividades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completada }),
    })
  }

  const handleNoteChange = async (id: string, nota: number) => {
    if (nota < 0 || nota > 5) return
    await fetch(`/api/actividades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nota }),
    })
    toast.success('Nota actualizada')
  }

  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ backgroundColor: materia.color_hex }}
      />
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: materia.color_hex }}
          />
          <CardTitle className="text-base font-medium">{materia.nombre}</CardTitle>
          <Badge variant="secondary" className="text-xs">{materia.creditos} cr</Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddActividad}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive-foreground"
            onClick={onDeleteMateria}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Grade summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Acumulado 70%</span>
            <span className="text-lg font-semibold">{acumulado70.toFixed(1)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Proyectada</span>
            <span className="text-lg font-semibold">
              {porcentajeCubierto > 0 ? notaProyectada.toFixed(1) : '--'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Necesitas Final</span>
            <span className={`text-lg font-semibold ${notaFinalNecesaria > 4.5 ? 'text-destructive-foreground' : notaFinalNecesaria > 3.5 ? 'text-chart-4' : 'text-primary'}`}>
              {parciales.filter(p => p.nota !== null).length > 0 ? notaFinalNecesaria.toFixed(1) : '--'}
            </span>
          </div>
        </div>

        <Progress value={Math.min(porcentajeCubierto, 100)} className="h-1.5" />

        {/* Activities list */}
        <div className="flex flex-col gap-2">
          {actividades.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">
              Sin actividades
            </p>
          ) : (
            actividades.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={a.completada}
                  onCheckedChange={(checked) => handleToggle(a.id, checked as boolean)}
                />
                <span className={`flex-1 truncate ${a.completada ? 'line-through text-muted-foreground' : ''}`}>
                  {a.titulo}
                </span>
                <Badge variant="outline" className="text-xs shrink-0">{a.tipo}</Badge>
                {['Parcial 1', 'Parcial 2', 'Parcial 3', 'Final'].includes(a.tipo) && (
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    placeholder="--"
                    defaultValue={a.nota ?? ''}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) handleNoteChange(a.id, val)
                    }}
                    className="w-12 rounded border bg-transparent px-1.5 py-0.5 text-center text-xs"
                  />
                )}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(a.fecha_entrega), 'dd/MM', { locale: es })}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
