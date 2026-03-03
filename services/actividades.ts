// services/actividades.ts
import { createClient } from "@/lib/supabase/server";

export async function createActividad(payload: any, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("actividades")
    .insert({ ...payload, user_id: userId })
    .select(
      "id, titulo, tipo, fecha_entrega, materia_id, completada, nota, descripcion, materia:materias!inner (nombre, color_hex)",
    )
    .single();

  return { data, error };
}

export async function updateActividad(id: string, payload: any, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("actividades")
    .update({ ...payload, user_id: userId })
    .eq("id", id)
    .select(
      "id, titulo, tipo, fecha_entrega, materia_id, completada, nota, descripcion, materia:materias!inner (nombre, color_hex)",
    )
    .single();

  return { data, error };
}

export async function deleteActividad(id: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("actividades").delete().eq("id", id).eq("user_id", userId);

  return { data, error };
}

export async function getActividades() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) return { data: null, error: authError };

  const { data, error } = await supabase
    .from("actividades")
    .select(
      `
      id,
      materia_id,
      titulo,
      tipo,
      fecha_entrega,
      completada,
      nota,
      descripcion,
      materia:materias!inner (
        nombre,
        color_hex,
        semestre:semestres!inner (
          es_actual
        )
      )
    `,
    )
    .eq("materia.semestre.es_actual", true)
    .eq("user_id", user.id);

    return { data, error };
}
