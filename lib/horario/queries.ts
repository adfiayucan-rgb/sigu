"use server";

import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "../supabase/server";
import { requireUser } from "../supabase/auth";
import { HorarioConMateria } from "../types";

export async function getHorariosByMateriaId(materiaId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("horarios")
    .select(
      `
            `,
    )
    .eq("materia_id", materiaId);

  return { data, error };
}

export async function getHorarioIdsByMateriaId(materiaId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("horarios").select("id").eq("materia_id", materiaId);

  return {
    data: data?.map((horario) => horario.id) ?? [],
    error,
  };
}

export async function getHorarios() {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheTag(`horarios-${user.id}`);
  cacheLife("hours");

  const { data, error } = await supabase
    .from("horarios")
    .select(
      `
    id,
    dia,
    hora_inicio,
    hora_fin,
    salon,
    materia:materias(
      id,
      nombre,
      color_hex,
      semestre:semestres!inner()
    )
  `,
    )
    .eq("materia.semestre.es_actual", true);

  if (error) throw error

  return data as unknown as HorarioConMateria[]
}

export async function getHorariosConMateria() {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheTag(`horarios-${user.id}`);
  cacheLife("hours");

  const { data, error } = await supabase
    .from("horarios")
    .select(
      `
    id,
    dia,
    hora_inicio,
    hora_fin,
    salon,
    materia:materias!inner(
      id,
      nombre,
      color_hex,
      semestre:semestres!inner()
    )
  `,
    )
    .eq("materia.semestre.es_actual", true);

  if (error) throw error

  return data as unknown as HorarioConMateria[]
}
