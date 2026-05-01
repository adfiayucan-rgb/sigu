import { createClient } from '@/lib/supabase/server'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { LIMITE_ARCHIVO_BYTES } from '@/lib/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const materiaId = searchParams.get('materia_id')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('archivos')
    .select(`
      id, nombre, url, tipo, tamano, created_at, materia_id,
      materia:materias(nombre, color_hex)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (materiaId) {
    query = query.eq('materia_id', materiaId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const materiaId = formData.get('materia_id') as string | null

  if (!file) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }

  // Validar tamaño (doble verificación del lado servidor)
  if (file.size > LIMITE_ARCHIVO_BYTES) {
    return NextResponse.json(
      { error: `El archivo excede el limite de 5MB` },
      { status: 400 }
    )
  }

  // Determinar tipo de archivo
  let tipo = 2 // Otro por defecto
  if (file.type === 'application/pdf') {
    tipo = 0
  } else if (file.type.startsWith('image/')) {
    tipo = 1
  }

  try {
    // Subir a Vercel Blob (más económico que Supabase Storage)
    const blob = await put(`archivos/${user.id}/${file.name}`, file, {
      access: 'public',
    })

    // Guardar metadata en Supabase
    const { data, error } = await supabase
      .from('archivos')
      .insert({
        user_id: user.id,
        nombre: file.name,
        url: blob.url,
        tipo,
        tamano: file.size,
        materia_id: materiaId || null,
      })
      .select(`
        id, nombre, url, tipo, tamano, created_at, materia_id,
        materia:materias(nombre, color_hex)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}
