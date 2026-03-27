'use client'

import { useSemestres, useMaterias, useActividades, useHorarios } from '@/lib/hooks'
import { MateriaCard } from '@/components/materias/materia-card'
import { AddMateriaDialog } from '@/components/materias/add-materia-dialog'
import { EditMateriaDialog } from '@/components/materias/edit-materia-dialog'
import { AddActividadDialog } from '@/components/materias/add-actividad-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, BookOpen, GraduationCap, TrendingUp } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { Materia } from '@/lib/types'

export default function MateriasPage() {
  const { data: semestres, isLoading: ls } = useSemestres()
  const semestreActual = semestres?.find((s) => s.es_actual)
  const { data: materias, isLoading: lm, mutate: mutateMaterias } = useMaterias(semestreActual?.id)
  const { data: actividades, isLoading: la, mutate: mutateActividades } = useActividades()
  const { data: horarios, isLoading: lh, mutate: mutateHorarios } = useHorarios()
  const [showAddMateria, setShowAddMateria] = useState(false)
  const [showAddActividad, setShowAddActividad] = useState(false)
  const [selectedMateriaId, setSelectedMateriaId] = useState<string | null>(null)
  const [editingMateria, setEditingMateria] = useState<Materia | null>(null)

  const isLoading = ls || lm || la || lh
  const materiasActuales = useMemo(() => 
    materias?.filter((m) => m.semestre_id === semestreActual?.id) ?? [],
    [materias, semestreActual]
  )
  const actividadesActuales = useMemo(() =>
    actividades?.filter((a) => materiasActuales.some((m) => m.id === a.materia_id)) ?? [],
    [actividades, materiasActuales]
  )
  const horariosActuales = useMemo(() =>
    horarios?.filter((h) => materiasActuales.some((m) => m.id === h.materia_id)) ?? [],
    [horarios, materiasActuales]
  )

  // Stats
  const totalCreditos = materiasActuales.reduce((acc, m) => acc + m.creditos, 0)
  const actividadesCompletadas = actividadesActuales.filter(a => a.completada).length
  const actividadesPendientes = actividadesActuales.filter(a => !a.completada).length

  const handleAddActividad = (materiaId: string) => {
    setSelectedMateriaId(materiaId)
    setShowAddActividad(true)
  }

  const handleRefresh = () => {
    mutateMaterias()
    mutateActividades()
    mutateHorarios()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Mis Materias</h1>
          <p className="text-sm text-muted-foreground">
            {semestreActual ? semestreActual.nombre : 'Selecciona un semestre en Ajustes'}
          </p>
        </div>
        {semestreActual && (
          <Button onClick={() => setShowAddMateria(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Materia
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {!isLoading && materiasActuales.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{materiasActuales.length}</p>
                <p className="text-xs text-muted-foreground">Materias</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-chart-2/5 border-chart-2/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCreditos}</p>
                <p className="text-xs text-muted-foreground">Créditos</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-chart-1/5 border-chart-1/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold">{actividadesCompletadas}</p>
                <p className="text-xs text-muted-foreground">Completadas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-chart-4/5 border-chart-4/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{actividadesPendientes}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Materias Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : materiasActuales.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {semestreActual ? 'Sin materias registradas' : 'Sin semestre activo'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {semestreActual
                ? 'Comienza agregando tus materias del semestre para trackear tus notas y actividades.'
                : 'Crea un semestre activo en Ajustes para comenzar a agregar materias.'}
            </p>
            {semestreActual && (
              <Button onClick={() => setShowAddMateria(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Primera Materia
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {materiasActuales.map((materia) => (
            <MateriaCard
              key={materia.id}
              materia={materia}
              actividades={actividadesActuales.filter((a) => a.materia_id === materia.id)}
              horarios={horariosActuales.filter((h) => h.materia_id === materia.id)}
              onAddActividad={() => handleAddActividad(materia.id)}
              onEditMateria={() => setEditingMateria(materia)}
              onDeleteMateria={async () => {
                if (confirm('¿Estás seguro de eliminar esta materia? Se eliminarán todas las actividades asociadas.')) {
                  await fetch(`/api/materias/${materia.id}`, { method: 'DELETE' })
                  handleRefresh()
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      {semestreActual && (
        <AddMateriaDialog
          open={showAddMateria}
          onOpenChange={setShowAddMateria}
          semestreId={semestreActual.id}
          onSuccess={handleRefresh}
        />
      )}

      {editingMateria && (
        <EditMateriaDialog
          open={!!editingMateria}
          onOpenChange={(open) => !open && setEditingMateria(null)}
          materia={editingMateria}
          horarios={horariosActuales.filter((h) => h.materia_id === editingMateria.id)}
          onSuccess={handleRefresh}
        />
      )}

      {selectedMateriaId && (
        <AddActividadDialog
          open={showAddActividad}
          onOpenChange={(open) => {
            setShowAddActividad(open)
            if (!open) setSelectedMateriaId(null)
          }}
          onSuccess={() => mutateActividades()}
        />
      )}
    </div>
  )
}
