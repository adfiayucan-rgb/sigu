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
import { COLORES_MATERIA } from '@/lib/types'
import { toast } from 'sonner'

export function AddMateriaDialog({
  open,
  onOpenChange,
  semestreId,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  semestreId: string
  onSuccess: () => void
}) {
  const [nombre, setNombre] = useState('')
  const [creditos, setCreditos] = useState('3')
  const [colorHex, setColorHex] = useState(COLORES_MATERIA[0])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          creditos: parseInt(creditos),
          color_hex: colorHex,
          semestre_id: semestreId,
        }),
      })

      if (!res.ok) throw new Error('Error al crear materia')
      toast.success('Materia creada')
      onSuccess()
      onOpenChange(false)
      setNombre('')
      setCreditos('3')
    } catch {
      toast.error('Error al crear materia')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva Materia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Calculo II"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="creditos">Creditos</Label>
            <Input
              id="creditos"
              type="number"
              min={1}
              max={10}
              value={creditos}
              onChange={(e) => setCreditos(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {COLORES_MATERIA.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorHex(c)}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    colorHex === c ? 'scale-125 ring-2 ring-ring ring-offset-2 ring-offset-background' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Materia'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
