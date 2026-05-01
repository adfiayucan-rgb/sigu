import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('apuntes')
    .select(`
      id, titulo, contenido, categoria, created_at, updated_at, materia_id,
      materia:materias(nombre, color_hex)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { titulo, contenido, categoria, materia_id } = body

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (titulo !== undefined) updateData.titulo = titulo.trim()
  if (contenido !== undefined) updateData.contenido = contenido
  if (categoria !== undefined) updateData.categoria = categoria
  if (materia_id !== undefined) updateData.materia_id = materia_id

  const { data, error } = await supabase
    .from('apuntes')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select(`
      id, titulo, contenido, categoria, created_at, updated_at, materia_id,
      materia:materias(nombre, color_hex)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { error } = await supabase
    .from('apuntes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
