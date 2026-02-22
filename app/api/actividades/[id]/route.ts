import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { data, error } = await supabase
    .from('actividades')
    .update(body)
    .eq('id', id)
    .select('*, materias(nombre, color_hex)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const mapped = {
    ...data,
    materia: data.materias ? { nombre: data.materias.nombre, color_hex: data.materias.color_hex } : null,
    materias: undefined,
  }

  return NextResponse.json(mapped)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { error } = await supabase
    .from('actividades')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
