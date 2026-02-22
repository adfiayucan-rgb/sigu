'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { ActividadConMateria } from '@/lib/types'

export function ProgressChart({ actividades }: { actividades: ActividadConMateria[] }) {
  const completadas = actividades.filter((a) => a.completada).length
  const pendientes = actividades.filter((a) => !a.completada).length
  const total = actividades.length

  const data = [
    { name: 'Completadas', value: completadas },
    { name: 'Pendientes', value: pendientes },
  ]

  const COLORS = ['var(--color-primary)', 'var(--color-muted)']

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-medium">Progreso</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Sin actividades registradas
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="h-28 w-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.5rem',
                      color: 'var(--color-popover-foreground)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-sm">{completadas} completadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="text-sm">{pendientes} pendientes</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {total > 0 ? Math.round((completadas / total) * 100) : 0}% completado
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
