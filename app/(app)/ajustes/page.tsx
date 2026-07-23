'use client'

import { useState } from 'react'
import { useSemestres } from '@/lib/hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AjustesPage() {
  const { data: semestres, isLoading, mutate } = useSemestres()
  const [showAdd, setShowAdd] = useState(false)
  const [nombre, setNombre] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/semestres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          es_actual: semestres?.length === 0,
        }),
      })

      if (!res.ok) throw new Error('Error')
      toast.success('Semestre creado')
      mutate()
      setShowAdd(false)
      setNombre('')
      setFechaInicio('')
      setFechaFin('')
    } catch {
      toast.error('Error al crear semestre')
    } finally {
      setCreating(false)
    }
  }

  const handleSetActual = async (id: string) => {
    // First un-set all others
    if (semestres) {
      for (const s of semestres) {
        if (s.es_actual) {
          await fetch(`/api/semestres/${s.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ es_actual: false }),
          })
        }
      }
    }

    await fetch(`/api/semestres/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ es_actual: true }),
    })

    toast.success('Semestre actualizado')
    mutate()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/semestres/${id}`, { method: 'DELETE' })
    toast.success('Semestre eliminado')
    mutate()
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Ajustes</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tus semestres y configuracion
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Semestres</CardTitle>
            <CardDescription>Administra tus periodos academicos</CardDescription>
          </div>
          <Button onClick={() => setShowAdd(true)} size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Nuevo
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-14 rounded-md" />
              <Skeleton className="h-14 rounded-md" />
            </div>
          ) : semestres?.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Crea tu primer semestre para comenzar
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {semestres?.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between rounded-md border p-3 ${
                    s.es_actual ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{s.nombre}</span>
                      {s.es_actual && (
                        <Badge variant="default" className="text-xs">Activo</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(s.fecha_inicio), 'dd MMM yyyy', { locale: es })} -{' '}
                      {format(new Date(s.fecha_fin), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {!s.es_actual && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleSetActual(s.id)}
                        title="Marcar como activo"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive-foreground"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Semestre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sem-nombre">Nombre</Label>
              <Input
                id="sem-nombre"
                placeholder="2026-1"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sem-inicio">Fecha Inicio</Label>
                <Input
                  id="sem-inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sem-fin">Fecha Fin</Label>
                <Input
                  id="sem-fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creando...' : 'Crear Semestre'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
