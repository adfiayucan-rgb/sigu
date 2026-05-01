'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MarkdownRenderer } from './markdown-renderer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CATEGORIAS_APUNTE, type Materia } from '@/lib/types'
import { Eye, Pencil, Save, X } from 'lucide-react'

interface EditorApunteProps {
  apunte?: {
    id: string
    titulo: string
    contenido: string
    categoria: number
    materia_id: string | null
  }
  materias: Pick<Materia, 'id' | 'nombre'>[]
  onSave: (data: {
    titulo: string
    contenido: string
    categoria: number
    materia_id: string | null
  }) => Promise<void>
  onCancel: () => void
  isSaving?: boolean
}

export function EditorApunte({
  apunte,
  materias,
  onSave,
  onCancel,
  isSaving = false,
}: EditorApunteProps) {
  const [titulo, setTitulo] = useState(apunte?.titulo || '')
  const [contenido, setContenido] = useState(apunte?.contenido || '')
  const [categoria, setCategoria] = useState(apunte?.categoria ?? 0)
  const [materiaId, setMateriaId] = useState<string | null>(
    apunte?.materia_id || null
  )

  const handleSubmit = async () => {
    if (!titulo.trim()) return
    await onSave({
      titulo,
      contenido,
      categoria,
      materia_id: materiaId,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Label htmlFor="titulo">Titulo</Label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Formulas de Interes Compuesto"
            className="mt-1"
          />
        </div>
        <div className="w-full sm:w-40">
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            value={categoria.toString()}
            onValueChange={(v) => setCategoria(parseInt(v))}
          >
            <SelectTrigger id="categoria" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS_APUNTE.map((cat) => (
                <SelectItem key={cat.value} value={cat.value.toString()}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="materia">Materia (opcional)</Label>
          <Select
            value={materiaId || 'none'}
            onValueChange={(v) => setMateriaId(v === 'none' ? null : v)}
          >
            <SelectTrigger id="materia" className="mt-1">
              <SelectValue placeholder="Sin materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin materia</SelectItem>
              {materias.map((mat) => (
                <SelectItem key={mat.id} value={mat.id}>
                  {mat.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="edit" className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            Vista previa
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-3">
          <Textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder={`Escribe tu apunte en Markdown...

Ejemplos de formulas (KaTeX):
- Inline: $E = mc^2$
- Bloque: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$

# Titulo
## Subtitulo
**Negrita** y *cursiva*`}
            className="min-h-[300px] font-mono text-sm"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-3">
          <div className="min-h-[300px] rounded-md border border-border bg-card p-4">
            {contenido ? (
              <MarkdownRenderer content={contenido} />
            ) : (
              <p className="text-muted-foreground">
                Escribe algo para ver la vista previa...
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="mr-1.5 h-4 w-4" />
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isSaving || !titulo.trim()}>
          <Save className="mr-1.5 h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  )
}
