'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TIPOS_ACTIVIDAD } from '@/lib/types'
import { toast } from 'sonner'

export function AddActividadDialog({
  open,
  onOpenChange,
  materiaId,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  materiaId: string
  onSuccess: () => void
}) {
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<string>('Tarea')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/actividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          tipo,
          fecha_entrega: new Date(fechaEntrega).toISOString(),
          materia_id: materiaId,
        }),
      })

      if (!res.ok) throw new Error('Error al crear actividad')
      toast.success('Actividad creada')
      onSuccess()
      onOpenChange(false)
      setTitulo('')
      setTipo('Tarea')
      setFechaEntrega('')
    } catch {
      toast.error('Error al crear actividad')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Actividad</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="titulo">Titulo</Label>
            <Input
              id="titulo"
              placeholder="Examen parcial de algebra"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_ACTIVIDAD.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fecha">Fecha de Entrega</Label>
            <Input
              id="fecha"
              type="datetime-local"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Actividad'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
