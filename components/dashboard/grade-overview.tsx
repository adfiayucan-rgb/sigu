'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp } from 'lucide-react'
import type { Materia, ActividadConMateria } from '@/lib/types'

function calcularNota70(materia: Materia, actividades: ActividadConMateria[]) {
  const acts = actividades.filter((a) => a.materia_id === materia.id)
  const parciales = acts.filter((a) =>
    ['Parcial 1', 'Parcial 2', 'Parcial 3'].includes(a.tipo) && a.nota !== null
  )

  if (parciales.length === 0) return { acumulado: 0, porcentajeCubierto: 0 }

  const pesoPorParcial = 70 / 3
  let acumulado = 0
  let porcentajeCubierto = 0

  parciales.forEach((p) => {
    const peso = p.porcentaje_manual ?? pesoPorParcial
    acumulado += ((p.nota ?? 0) / 5) * peso
    porcentajeCubierto += peso
  })

  return { acumulado, porcentajeCubierto }
}

export function GradeOverview({
  materias,
  actividades,
}: {
  materias: Materia[]
  actividades: ActividadConMateria[]
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium">Resumen de Notas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {materias.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Agrega materias para ver tu progreso
          </p>
        ) : (
          materias.map((m) => {
            const { acumulado, porcentajeCubierto } = calcularNota70(m, actividades)
            const displayNota = porcentajeCubierto > 0
              ? ((acumulado / porcentajeCubierto) * 5).toFixed(1)
              : '--'

            return (
              <div key={m.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: m.color_hex }}
                    />
                    <span className="text-sm">{m.nombre}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {displayNota}
                  </span>
                </div>
                <Progress
                  value={Math.min(porcentajeCubierto, 100)}
                  className="h-1.5"
                />
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
