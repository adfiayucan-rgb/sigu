'use client'

import { useSemestres, useMaterias, useActividades } from '@/lib/hooks'
import { MateriaCard } from '@/components/materias/materia-card'
import { AddMateriaDialog } from '@/components/materias/add-materia-dialog'
import { AddActividadDialog } from '@/components/materias/add-actividad-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function MateriasPage() {
  const { data: semestres, isLoading: ls } = useSemestres()
  const semestreActual = semestres?.find((s) => s.es_actual)
  const { data: materias, isLoading: lm, mutate: mutateMaterias } = useMaterias(semestreActual?.id)
  const { data: actividades, isLoading: la, mutate: mutateActividades } = useActividades()
  const [showAddMateria, setShowAddMateria] = useState(false)
  const [showAddActividad, setShowAddActividad] = useState(false)
  const [selectedMateriaId, setSelectedMateriaId] = useState<string | null>(null)

  const isLoading = ls || lm || la
  const materiasActuales = materias ?? []

  const handleAddActividad = (materiaId: string) => {
    setSelectedMateriaId(materiaId)
    setShowAddActividad(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Materias</h1>
          <p className="text-sm text-muted-foreground">
            {semestreActual ? semestreActual.nombre : 'Selecciona un semestre en Ajustes'}
          </p>
        </div>
        {semestreActual && (
          <Button onClick={() => setShowAddMateria(true)} size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Materia
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      ) : materiasActuales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground mb-4">
            {semestreActual
              ? 'No tienes materias registradas en este semestre'
              : 'Crea un semestre activo en Ajustes para comenzar'}
          </p>
          {semestreActual && (
            <Button onClick={() => setShowAddMateria(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Materia
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {materiasActuales.map((materia) => (
            <MateriaCard
              key={materia.id}
              materia={materia}
              actividades={actividades?.filter((a) => a.materia_id === materia.id) ?? []}
              onAddActividad={() => handleAddActividad(materia.id)}
              onDeleteMateria={async () => {
                await fetch(`/api/materias/${materia.id}`, { method: 'DELETE' })
                mutateMaterias()
                mutateActividades()
              }}
            />
          ))}
        </div>
      )}

      {semestreActual && (
        <AddMateriaDialog
          open={showAddMateria}
          onOpenChange={setShowAddMateria}
          semestreId={semestreActual.id}
          onSuccess={() => mutateMaterias()}
        />
      )}

      {selectedMateriaId && (
        <AddActividadDialog
          open={showAddActividad}
          onOpenChange={setShowAddActividad}
          materiaId={selectedMateriaId}
          onSuccess={() => mutateActividades()}
        />
      )}
    </div>
  )
}
