import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
    .from('apuntes')
    .select(`
      id, titulo, contenido, categoria, created_at, updated_at, materia_id,
      materia:materias(nombre, color_hex)
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
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

  const body = await request.json()
  const { titulo, contenido, categoria, materia_id } = body

  if (!titulo || titulo.trim() === '') {
    return NextResponse.json({ error: 'El titulo es requerido' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('apuntes')
    .insert({
      user_id: user.id,
      titulo: titulo.trim(),
      contenido: contenido || '',
      categoria: categoria || 0,
      materia_id: materia_id || null,
    })
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
