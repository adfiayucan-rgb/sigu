"use server";

import { HorarioFormData } from "@/app/(app)/horario/schema";
import { createClient } from "../supabase/server";

export async function createHorario(horarioAGuardar: HorarioFormData) {
  const supabase = await createClient();

  const { data: horarioCreado, error } = await supabase.from("horarios").insert(horarioAGuardar).select("*").single();

  return { horarioCreado, error };
}

export async function updateHorario(horarioId: string, horarioAActualizar: HorarioFormData) {
  const supabase = await createClient();

  const { data: horarioCreado, error } = await supabase
    .from("horarios")
    .update(horarioAActualizar)
    .eq("id", horarioId)
    .select("*")
    .single();

  return { horarioCreado, error };
}

export async function createHorarios(horarios: HorarioFormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("horarios").insert(horarios);

  return { error };
}
