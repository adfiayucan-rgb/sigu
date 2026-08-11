import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "../supabase/server";
import { requireUser } from "../supabase/auth";
import type { Horario, HorarioConMateria } from "../types/horario";
import { CACHE_TAGS } from "../cache-keys";
import { getCurrentDay, getCurrentTime } from "../date";

export async function getHorarios(): Promise<Horario[]> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheTag(CACHE_TAGS.horarios(user.id));
  cacheLife("weeks");

  const { data, error } = await supabase
    .from("horarios")
    .select(
      `
        id,
        dia,
        hora_inicio,
        hora_fin,
        salon,
        materia_id,
        materias!inner(
          semestre:semestres!inner()
        )
      `,
    )
    .eq("materias.semestre.es_actual", true);

  if (error) {
    console.error("Error en getHorarios:", error.message);
    throw new Error(`Error al cargar los horarios: ${error.message}`);
  }

  return data;
}

export async function getHorariosConMateria(): Promise<HorarioConMateria[]> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheTag(CACHE_TAGS.horarios(user.id));
  cacheLife("weeks");

  const { data, error } = await supabase
    .from("horarios")
    .select(
      `
      id,
      dia,
      hora_inicio,
      hora_fin,
      salon,
      materia_id,
      materia:materias!inner(
        id,
        codigo,
        nombre,
        color_hex,
        semestre:semestres!inner()
      )
  `,
    )
    .eq("materia.semestre.es_actual", true);

  if (error) {
    console.error("Error en getHorariosConMateria:", error.message);
    throw new Error(`Error al cargar los horarios con materia: ${error.message}`);
  }

  return data;
}

export async function getHorariosConMateriaPorDia(dia: number): Promise<HorarioConMateria[]> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheTag(CACHE_TAGS.horarios(user.id));
  cacheLife("weeks");

  const { data, error } = await supabase
    .from("horarios")
    .select(
      `
      id,
      dia,
      hora_inicio,
      hora_fin,
      salon,
      materia_id,
      materia:materias!inner (
        id,
        codigo,
        nombre,
        color_hex,
        semestre:semestres!inner ()
      )
    `,
    )
    .eq("dia", dia)
    .eq("materia.semestre.es_actual", true)
    .order("hora_inicio");

  if (error) {
    console.error("Error en getHorariosConMateriaPorDia:", error.message);
    throw new Error(`Error al cargar los horarios con materia por dia: ${error.message}`);
  }

  return data;
}

export async function getClaseActual(): Promise<HorarioConMateria | null> {
  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return null;
  }

  const day = getCurrentDay();
  const time = getCurrentTime();

  console.log("day: ",day);
  console.log("time: ",time);

  

  const { data, error } = await supabase
    .from("horarios")
    .select(
      `
      *,
      materia:materias!inner (
          id,
          nombre,
          codigo,
          color_hex,
          semestre:semestres!inner ()
        )
  `,
    )
    .eq("materia.semestre.es_actual", true)
    .eq("dia", day)
    .lte("hora_inicio", time)
    .gte("hora_fin", time)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error al obtener la clase actual:", error.message);
    return null;
  }

  return data;
}
