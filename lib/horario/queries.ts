"use server"

import { createClient } from "../supabase/server"

export async function getHorariosByMateriaId(materiaId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("horarios")
        .select(`
            `)
        .eq("materia_id", materiaId)
    
    return { data, error }
}

export async function getHorarioIdsByMateriaId(materiaId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("horarios")
    .select("id")
    .eq("materia_id", materiaId);

  return {
    data: data?.map((horario) => horario.id) ?? [],
    error,
  };
}