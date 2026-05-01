'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListaApuntes } from '@/components/conocimiento/lista-apuntes'
import { EditorApunte } from '@/components/conocimiento/editor-apunte'
import { MarkdownRenderer } from '@/components/conocimiento/markdown-renderer'
import { SubidaArchivos } from '@/components/conocimiento/subida-archivos'
import { ListaArchivos } from '@/components/conocimiento/lista-archivos'
import { FileText, FolderOpen, ArrowLeft, Edit } from 'lucide-react'
import { type ApunteConMateria, type Materia } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type View = 'list' | 'editor' | 'detail'

export default function ConocimientoPage() {
  const [activeTab, setActiveTab] = useState('apuntes')
  const [view, setView] = useState<View>('list')
  const [selectedApunte, setSelectedApunte] = useState<ApunteConMateria | null>(null)
  const [filterMateria, setFilterMateria] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [refreshArchivos, setRefreshArchivos] = useState(0)

  const { data: materias = [] } = useSWR<Pick<Materia, 'id' | 'nombre'>[]>(
    '/api/materias',
    fetcher
  )

  const handleSelectApunte = useCallback((apunte: ApunteConMateria) => {
    setSelectedApunte(apunte)
    setView('detail')
  }, [])

  const handleNuevoApunte = useCallback(() => {
    setSelectedApunte(null)
    setView('editor')
  }, [])

  const handleEditApunte = useCallback(() => {
    setView('editor')
  }, [])

  const handleBackToList = useCallback(() => {
    setView('list')
    setSelectedApunte(null)
  }, [])

  const handleSaveApunte = useCallback(
    async (data: {
      titulo: string
      contenido: string
      categoria: number
      materia_id: string | null
    }) => {
      setIsSaving(true)
      try {
        if (selectedApunte) {
          // Update
          const response = await fetch(`/api/apuntes/${selectedApunte.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (response.ok) {
            const updated = await response.json()
            setSelectedApunte(updated)
            setView('detail')
          }
        } else {
          // Create
          const response = await fetch('/api/apuntes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          if (response.ok) {
            const created = await response.json()
            setSelectedApunte(created)
            setView('detail')
          }
        }
      } catch (error) {
        console.error('Error saving apunte:', error)
      } finally {
        setIsSaving(false)
      }
    },
    [selectedApunte]
  )

  const handleUploadComplete = useCallback(() => {
    setRefreshArchivos((prev) => prev + 1)
  }, [])

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Base de Conocimiento</h1>
        <p className="text-muted-foreground">
          Organiza tus apuntes y archivos de estudio
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="apuntes" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Apuntes
            </TabsTrigger>
            <TabsTrigger value="archivos" className="gap-1.5">
              <FolderOpen className="h-4 w-4" />
              Archivos
            </TabsTrigger>
          </TabsList>

          <div className="w-full sm:w-48">
            <Select
              value={filterMateria || 'all'}
              onValueChange={(v) => setFilterMateria(v === 'all' ? null : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por materia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las materias</SelectItem>
                {materias.map((mat) => (
                  <SelectItem key={mat.id} value={mat.id}>
                    {mat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="apuntes" className="mt-0">
          {view === 'list' && (
            <ListaApuntes
              materiaId={filterMateria || undefined}
              onSelectApunte={handleSelectApunte}
              onNuevoApunte={handleNuevoApunte}
            />
          )}

          {view === 'editor' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={handleBackToList}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle>
                    {selectedApunte ? 'Editar apunte' : 'Nuevo apunte'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <EditorApunte
                  apunte={
                    selectedApunte
                      ? {
                          id: selectedApunte.id,
                          titulo: selectedApunte.titulo,
                          contenido: selectedApunte.contenido,
                          categoria: selectedApunte.categoria,
                          materia_id: selectedApunte.materia_id,
                        }
                      : undefined
                  }
                  materias={materias}
                  onSave={handleSaveApunte}
                  onCancel={handleBackToList}
                  isSaving={isSaving}
                />
              </CardContent>
            </Card>
          )}

          {view === 'detail' && selectedApunte && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleBackToList}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <CardTitle>{selectedApunte.titulo}</CardTitle>
                  </div>
                  <Button variant="outline" onClick={handleEditApunte}>
                    <Edit className="mr-1.5 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {selectedApunte.contenido ? (
                  <MarkdownRenderer content={selectedApunte.contenido} />
                ) : (
                  <p className="text-muted-foreground">Este apunte esta vacio</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archivos" className="mt-0 space-y-6">
          <SubidaArchivos
            materias={materias}
            onUploadComplete={handleUploadComplete}
          />
          <ListaArchivos
            materiaId={filterMateria || undefined}
            refreshKey={refreshArchivos}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
