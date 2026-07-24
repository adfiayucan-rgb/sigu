"use server";

import { HorarioFormData } from "@/app/(app)/horario/schema";
import { createClient } from "../supabase/server";
import { Horario } from "../types";
import { getHorarioIdsByMateriaId } from "./queries";

export async function saveHorariosByMateria(horarios: HorarioFormData[], materiaId: string) {
  const supabase = await createClient();

  const { data: existentes, error } = await getHorarioIdsByMateriaId(materiaId);

  if (error) {
    throw new Error(`Error al leer los horarios existentes: ${error.message}`);
  }

  const idsExistentes = new Set((existentes ?? []).map((h) => h.id as string));
  const idsEnPayload = new Set(
    horarios.filter((h): h is HorarioFormData & { id: string } => Boolean(h.id)).map((h) => h.id),
  );
  console.log("idsExistentes: ", idsExistentes);
  console.log("idsEnPayload: ", idsEnPayload);

  const aCrear = horarios.filter((h) => !h.id);
  const aActualizar = horarios.filter((h) => h.id && idsExistentes.has(h.id));
  const aEliminar = [...idsExistentes].filter((id) => !idsEnPayload.has(id));
  console.log("aCrear: ", aCrear);
  console.log("aActualizar: ", aActualizar);
  console.log("aEliminar: ", aEliminar);

  if (aCrear.length > 0) {
    console.log("Creando horarios");

    const { error } = await supabase
      .from("horarios")
      .insert(aCrear.map(({ id: _id, ...resto }) => ({ ...resto, materia_id: materiaId })));

    if (error) throw new Error(`Error al crear horarios: ${error.message}`);
  }

  for (const horario of aActualizar) {
    console.log("Actualizando horario: ", horario);

    const { id, ...resto } = horario;
    const { error } = await supabase.from("horarios").update(resto).eq("id", id).eq("materia_id", materiaId);
    if (error) throw new Error(`Error al actualizar horario con ID: ${id} por la siguiente razón: ${error.message}`);
  }

  if (aEliminar.length > 0) {
    console.log("Eliminando horarios");

    const { error } = await supabase.from("horarios").delete().in("id", aEliminar);
    if (error) throw new Error(`Error al eliminar los horarios: ${error.message}`);
  }
}

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
