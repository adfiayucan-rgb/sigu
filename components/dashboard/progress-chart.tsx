'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, ListTodo } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import type { ActividadConMateria } from '@/lib/types'

export function ProgressChart({ actividades }: { actividades: ActividadConMateria[] }) {
  const completadas = actividades.filter((a) => a.completada).length
  const pendientes = actividades.filter((a) => !a.completada).length
  const total = actividades.length
  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0

  const data = [
    { name: 'Completadas', value: completadas },
    { name: 'Pendientes', value: pendientes },
  ]

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))']

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="h-8 w-8 rounded-lg bg-chart-1/10 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-chart-1" />
        </div>
        <div>
          <CardTitle className="text-sm font-medium">Progreso</CardTitle>
          <p className="text-xs text-muted-foreground">Actividades del semestre</p>
        </div>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <ListTodo className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Sin actividades</p>
            <p className="text-xs text-muted-foreground">Agrega actividades para ver tu progreso</p>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{porcentaje}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{completadas}</p>
                  <p className="text-xs text-muted-foreground">Completadas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{pendientes}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
