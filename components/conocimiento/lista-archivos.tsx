'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Search,
  Trash2,
  Download,
  FileText,
  Image as ImageIcon,
  File,
  FolderOpen,
} from 'lucide-react'
import { type ArchivoConMateria } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ListaArchivosProps {
  materiaId?: string
  refreshKey?: number
}

export function ListaArchivos({ materiaId, refreshKey }: ListaArchivosProps) {
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [allArchivos, setAllArchivos] = useState<ArchivoConMateria[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const limit = 20

  const url = materiaId
    ? `/api/archivos?materia_id=${materiaId}&limit=${limit}&offset=${offset}`
    : `/api/archivos?limit=${limit}&offset=${offset}`

  const { data, error, isLoading, mutate } = useSWR<ArchivoConMateria[]>(
    [url, refreshKey],
    ([u]) => fetcher(u)
  )

  // Lazy loading: acumular archivos
  useEffect(() => {
    if (data) {
      if (offset === 0) {
        setAllArchivos(data)
      } else {
        setAllArchivos((prev) => [...prev, ...data])
      }
    }
  }, [data, offset])

  // Reset cuando cambia el filtro o refreshKey
  useEffect(() => {
    setOffset(0)
    setAllArchivos([])
  }, [materiaId, refreshKey])

  const handleDelete = useCallback(async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/archivos/${deleteId}`, { method: 'DELETE' })
      setAllArchivos((prev) => prev.filter((a) => a.id !== deleteId))
      mutate()
    } catch (error) {
      console.error('Error deleting archivo:', error)
    } finally {
      setDeleteId(null)
    }
  }, [deleteId, mutate])

  const filteredArchivos = allArchivos.filter((a) =>
    a.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const hasMore = data?.length === limit

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getFileIcon = (tipo: number) => {
    switch (tipo) {
      case 0:
        return FileText
      case 1:
        return ImageIcon
      default:
        return File
    }
  }

  const getTipoLabel = (tipo: number) => {
    switch (tipo) {
      case 0:
        return 'PDF'
      case 1:
        return 'Imagen'
      default:
        return 'Archivo'
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar archivos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading && offset === 0 ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center text-destructive">
            Error al cargar los archivos
          </CardContent>
        </Card>
      ) : filteredArchivos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              {search ? 'No se encontraron archivos' : 'No hay archivos subidos'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {filteredArchivos.map((archivo) => {
              const Icon = getFileIcon(archivo.tipo)
              return (
                <Card key={archivo.id}>
                  <CardContent className="flex items-center gap-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {archivo.nombre}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {formatSize(archivo.tamano)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getTipoLabel(archivo.tipo)}
                        </Badge>
                        {archivo.materia && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: archivo.materia.color_hex,
                              color: archivo.materia.color_hex,
                            }}
                          >
                            {archivo.materia.nombre}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(archivo.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        asChild
                      >
                        <a
                          href={archivo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(archivo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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
            <AlertDialogTitle>Eliminar archivo</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. El archivo se eliminara
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
