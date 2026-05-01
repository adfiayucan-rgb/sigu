'use client'

import { useState, useCallback, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react'
import { LIMITE_ARCHIVO_MB, LIMITE_ARCHIVO_BYTES, type Materia } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SubidaArchivosProps {
  materias: Pick<Materia, 'id' | 'nombre'>[]
  onUploadComplete: () => void
}

export function SubidaArchivos({ materias, onUploadComplete }: SubidaArchivosProps) {
  const [file, setFile] = useState<File | null>(null)
  const [compressedFile, setCompressedFile] = useState<File | null>(null)
  const [materiaId, setMateriaId] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const processFile = useCallback(async (selectedFile: File) => {
    setError(null)
    setFile(selectedFile)
    setCompressedFile(null)
    setProgress(0)

    // Validar tamaño inicial
    if (selectedFile.size > LIMITE_ARCHIVO_BYTES) {
      // Si es imagen, intentar comprimir
      if (selectedFile.type.startsWith('image/')) {
        setIsCompressing(true)
        try {
          const compressed = await imageCompression(selectedFile, {
            maxSizeMB: LIMITE_ARCHIVO_MB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            onProgress: (p) => setProgress(p),
          })
          
          if (compressed.size > LIMITE_ARCHIVO_BYTES) {
            setError(`La imagen comprimida (${formatSize(compressed.size)}) sigue excediendo el limite de ${LIMITE_ARCHIVO_MB}MB`)
            setFile(null)
          } else {
            setCompressedFile(compressed as File)
          }
        } catch (err) {
          console.error('Compression error:', err)
          setError('Error al comprimir la imagen')
          setFile(null)
        } finally {
          setIsCompressing(false)
          setProgress(0)
        }
      } else {
        setError(`El archivo excede el limite de ${LIMITE_ARCHIVO_MB}MB. Solo las imagenes se comprimen automaticamente.`)
        setFile(null)
      }
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        processFile(droppedFile)
      }
    },
    [processFile]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    const uploadFile = compressedFile || file
    if (!uploadFile) return

    setIsUploading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      if (materiaId) {
        formData.append('materia_id', materiaId)
      }

      const response = await fetch('/api/archivos', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al subir archivo')
      }

      setFile(null)
      setCompressedFile(null)
      setMateriaId(null)
      onUploadComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivo')
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return FileText
    if (type.startsWith('image/')) return ImageIcon
    return File
  }

  const activeFile = compressedFile || file
  const FileIcon = activeFile ? getFileIcon(activeFile.type) : File

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={cn(
            'relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            activeFile && 'border-solid border-primary/50 bg-primary/5'
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.ppt,.pptx"
          />

          {activeFile ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex items-center gap-3 w-full max-w-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activeFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(activeFile.size)}
                    {compressedFile && file && (
                      <span className="text-green-600 dark:text-green-400">
                        {' '}(comprimido de {formatSize(file.size)})
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setFile(null)
                    setCompressedFile(null)
                    setError(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="w-full max-w-sm">
                <Label htmlFor="materia-upload" className="text-xs">
                  Asociar a materia (opcional)
                </Label>
                <Select
                  value={materiaId || 'none'}
                  onValueChange={(v) => setMateriaId(v === 'none' ? null : v)}
                >
                  <SelectTrigger id="materia-upload" className="mt-1">
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

              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full max-w-sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Subiendo...' : 'Subir archivo'}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Arrastra un archivo aqui o{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => inputRef.current?.click()}
                  >
                    selecciona uno
                  </button>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, imagenes, documentos (max {LIMITE_ARCHIVO_MB}MB)
                </p>
                <p className="text-xs text-muted-foreground">
                  Las imagenes se comprimen automaticamente
                </p>
              </div>
            </>
          )}

          {(isCompressing || isUploading) && (
            <div className="w-full max-w-sm">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground mt-1">
                {isCompressing ? 'Comprimiendo imagen...' : 'Subiendo...'}
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive mt-3 text-center">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
