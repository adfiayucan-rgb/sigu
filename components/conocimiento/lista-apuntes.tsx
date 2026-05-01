'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Search, Trash2, Edit, FileText } from 'lucide-react'
import { CATEGORIAS_APUNTE, type ApunteConMateria } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ListaApuntesProps {
  materiaId?: string
  onSelectApunte: (apunte: ApunteConMateria) => void
  onNuevoApunte: () => void
}

export function ListaApuntes({
  materiaId,
  onSelectApunte,
  onNuevoApunte,
}: ListaApuntesProps) {
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [allApuntes, setAllApuntes] = useState<ApunteConMateria[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const limit = 20

  const url = materiaId
    ? `/api/apuntes?materia_id=${materiaId}&limit=${limit}&offset=${offset}`
    : `/api/apuntes?limit=${limit}&offset=${offset}`

  const { data, error, isLoading, mutate } = useSWR<ApunteConMateria[]>(
    url,
    fetcher
  )

  // Lazy loading: acumular apuntes
  useEffect(() => {
    if (data) {
      if (offset === 0) {
        setAllApuntes(data)
      } else {
        setAllApuntes((prev) => [...prev, ...data])
      }
    }
  }, [data, offset])

  // Reset cuando cambia el filtro de materia
  useEffect(() => {
    setOffset(0)
    setAllApuntes([])
  }, [materiaId])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/apuntes/${deleteId}`, { method: 'DELETE' })
      setAllApuntes((prev) => prev.filter((a) => a.id !== deleteId))
      mutate()
    } catch (error) {
      console.error('Error deleting apunte:', error)
    } finally {
      setDeleteId(null)
    }
  }, [deleteId, mutate])

  const filteredApuntes = allApuntes.filter(
    (a) =>
      a.titulo.toLowerCase().includes(search.toLowerCase()) ||
      a.contenido.toLowerCase().includes(search.toLowerCase())
  )

  const hasMore = data?.length === limit

  const getCategoriaLabel = (cat: number) => {
    return CATEGORIAS_APUNTE.find((c) => c.value === cat)?.label || 'General'
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar apuntes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onNuevoApunte} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nuevo apunte
        </Button>
      </div>

      {isLoading && offset === 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center text-destructive">
            Error al cargar los apuntes
          </CardContent>
        </Card>
      ) : filteredApuntes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {search ? 'No se encontraron apuntes' : 'No tienes apuntes aun'}
            </p>
            {!search && (
              <Button variant="outline" onClick={onNuevoApunte}>
                Crear tu primer apunte
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApuntes.map((apunte) => (
              <Card
                key={apunte.id}
                className="cursor-pointer transition-colors hover:bg-accent/50"
                onClick={() => onSelectApunte(apunte)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-1">
                      {apunte.titulo}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectApunte(apunte)
                        }}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(apunte.id)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {apunte.contenido.slice(0, 120) || 'Sin contenido'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoriaLabel(apunte.categoria)}
                    </Badge>
                    {apunte.materia && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: apunte.materia.color_hex,
                          color: apunte.materia.color_hex,
                        }}
                      >
                        {apunte.materia.nombre}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDistanceToNow(new Date(apunte.updated_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setOffset((prev) => prev + limit)}
                disabled={isLoading}
              >
                {isLoading ? 'Cargando...' : 'Cargar mas'}
              </Button>
            </div>
          )}
        </>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar apunte</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El apunte se eliminara
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
