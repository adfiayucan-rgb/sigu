import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "../supabase/server";
import { addDays, format, startOfDay } from "date-fns";
import { requireUser } from "../supabase/auth";
import { Actividad, ActividadConMateria } from "../types/actividad";
import { CACHE_TAGS } from "../cache-keys";

export async function getActividadConMateriaByDate(date: string): Promise<ActividadConMateria[]> {
  "use cache: private";
  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return [];
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.actividades(user.id));

  const start = format(startOfDay(date), "yyyy-MM-dd");
  const end = format(addDays(startOfDay(date), 1), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("actividades")
    .select(
      `
        id,
        titulo,
        tipo,
        fecha_entrega,
        hora_inicio,
        hora_fin,
        completada,
        nota,
        porcentaje_manual,
        es_examen,
        descripcion,
        materia_id,
        materia:materias (
          id,
          codigo,
          nombre,
          creditos,
          color_hex,
          profesor,
          semestre_id,
          semestres!inner()
        )
      `,
    )
    .eq("materia.semestres.es_actual", true)
    .gte("fecha_entrega", start)
    .lt("fecha_entrega", end)
    .order("fecha_entrega");

  if (error) throw error;

  return data;
}

export async function getActividadById(id: string): Promise<ActividadConMateria | null> {
  "use cache: private";
  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return null;
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.actividades(user.id));

  const { data, error } = await supabase
    .from("actividades")
    .select(
      `
        id,
        titulo,
        tipo,
        fecha_entrega,
        hora_inicio,
        hora_fin,
        completada,
        nota,
        porcentaje_manual,
        es_examen,
        descripcion,
        materia_id,
        materia:materias (
          id,
          codigo,
          nombre,
          creditos,
          color_hex,
          profesor,
          semestre_id,
          semestres!inner()
        )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function getCalendarioModifiers(year: number, month: number) {
  const supabase = await createClient();

  const start = new Date(year, month, 1);

  const end = new Date(year, month + 1, 1);

  const { data, error } = await supabase
    .from("actividades")
    .select("fecha_entrega")
    .gte("fecha_entrega", start.toISOString())
    .lt("fecha_entrega", end.toISOString());

  if (error) throw error;

  const uniqueDates = [...new Set(data.map((item) => item.fecha_entrega.slice(0, 10)))];

  return uniqueDates;
}

export async function getActividades(): Promise<Actividad[]> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.actividades(user.id));

  const { data, error } = await supabase
    .from("actividades")
    .select(
      `
      id,
      titulo,
      tipo,
      fecha_entrega,
      completada,
      nota,
      porcentaje_manual,
      es_examen,
      descripcion,
      materia_id,
      hora_inicio,
      hora_fin, 
      materia:materias!inner (
        semestre:semestres!inner()
      )
    `,
    )
    .eq("materia.semestre.es_actual", true);

  if (error) throw error;

  return data;
}

export async function getActividadesConMateria(): Promise<ActividadConMateria[]> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return [];
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.actividades(user.id));

  const { data, error } = await supabase
    .from("actividades")
    .select(
      `
        id,
        titulo,
        tipo,
        fecha_entrega,
        hora_inicio,
        hora_fin,
        completada,
        nota,
        porcentaje_manual,
        es_examen,
        descripcion,
        materia_id,
        materia:materias (
          id,
          codigo,
          nombre,
          creditos,
          color_hex,
          profesor,
          semestre_id,
          semestres!inner()
        )
      `,
    )
    .eq("materia.semestres.es_actual", true);

  if (error) throw error;

  return data;
}
