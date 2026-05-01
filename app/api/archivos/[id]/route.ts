import { createClient } from '@/lib/supabase/server'
import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'

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

  // Obtener el archivo primero para borrar del blob
  const { data: archivo, error: fetchError } = await supabase
    .from('archivos')
    .select('url')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !archivo) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
  }

  try {
    // Eliminar de Vercel Blob
    await del(archivo.url)
  } catch (error) {
    console.error('Error deleting from blob:', error)
    // Continuar con la eliminación de la BD aunque falle el blob
  }

  // Eliminar de Supabase
  const { error } = await supabase
    .from('archivos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
