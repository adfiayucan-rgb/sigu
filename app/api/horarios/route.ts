import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('horarios')
    .select('*, materias(nombre, color_hex, semestre_id)')
    .order('dia')
    .order('hora_inicio')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const mapped = data.map((h) => ({
    ...h,
    materia: h.materias ? { nombre: h.materias.nombre, color_hex: h.materias.color_hex, semestre_id: h.materias.semestre_id } : null,
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
    .from('horarios')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
