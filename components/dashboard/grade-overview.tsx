'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Award } from 'lucide-react'
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

function getGradeColor(nota: number): string {
  if (nota >= 4.0) return 'text-primary'
  if (nota >= 3.0) return 'text-chart-4'
  return 'text-destructive'
}

export function GradeOverview({
  materias,
  actividades,
}: {
  materias: Materia[]
  actividades: ActividadConMateria[]
}) {
  // Calculate overall average
  const materiasConNotas = materias.map(m => {
    const { acumulado, porcentajeCubierto } = calcularNota70(m, actividades)
    const nota = porcentajeCubierto > 0 ? (acumulado / porcentajeCubierto) * 5 : null
    return { ...m, nota, porcentajeCubierto }
  })

  const materiasConNota = materiasConNotas.filter(m => m.nota !== null)
  const promedioGeneral = materiasConNota.length > 0
    ? materiasConNota.reduce((acc, m) => acc + (m.nota ?? 0), 0) / materiasConNota.length
    : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="h-8 w-8 rounded-lg bg-chart-2/10 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-chart-2" />
        </div>
        <div>
          <CardTitle className="text-sm font-medium">Resumen de Notas</CardTitle>
          <p className="text-xs text-muted-foreground">Rendimiento académico</p>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {materias.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Award className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Sin materias</p>
            <p className="text-xs text-muted-foreground">Agrega materias para ver tu progreso</p>
          </div>
        ) : (
          <>
            {/* Overall average */}
            {promedioGeneral !== null && (
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium">Promedio General</span>
                <span className={`text-2xl font-bold ${getGradeColor(promedioGeneral)}`}>
                  {promedioGeneral.toFixed(2)}
                </span>
              </div>
            )}

            {/* Per subject breakdown */}
            <div className="flex flex-col gap-3">
              {materiasConNotas.map((m) => {
                const displayNota = m.nota !== null ? m.nota.toFixed(1) : '--'

                return (
                  <div key={m.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: m.color_hex }}
                        />
                        <span className="text-sm truncate max-w-[150px]">{m.nombre}</span>
                      </div>
                      <span className={`text-sm font-semibold ${m.nota !== null ? getGradeColor(m.nota) : 'text-muted-foreground'}`}>
                        {displayNota}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(m.porcentajeCubierto, 100)}
                      className="h-1.5"
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
