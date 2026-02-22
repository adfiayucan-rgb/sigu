import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('actividades')
    .select('*, materias(nombre, color_hex)')
    .order('fecha_entrega', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const mapped = data?.map((a) => ({
    ...a,
    materia: a.materias ? { nombre: a.materias.nombre, color_hex: a.materias.color_hex } : null,
    materias: undefined,
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('actividades')
    .insert({ ...body, user_id: user.id })
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
