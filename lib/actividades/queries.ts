"use server";

import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "../supabase/server";
import { addDays, format, startOfDay } from "date-fns";
import { requireUser } from "../supabase/auth";
import { Actividad, ActividadConMateria } from "../types";

export async function getActividadByDate(date: string) {
  const supabase = await createClient();

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
      completada,
      nota,
      porcentaje_manual,
      es_examen,
      descripcion,
      materia_id,

      materia:materias (
        nombre,
        color_hex,
        semestres!inner()
      )
    `,
    )
    .eq("materia.semestres.es_actual", true)
    .gte("fecha_entrega", start)
    .lt("fecha_entrega", end)
    .order("fecha_entrega");

  if (error) throw error;

  return data as unknown as ActividadConMateria[];
}

export async function getActividadById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("actividades")
    .select(
      `
      *,
      materia:materias(*)
    `,
    )
    .eq("id", id)
    .single();

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

export async function getActividades() {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheTag(`actividades-${user.id}`);
  cacheLife({ stale: 60 });

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

  return data as unknown as Actividad[];
}

export async function getActividadesConMateria() {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return [];
  }

  cacheTag(`actividades-${user.id}`);
  cacheLife({ stale: 60 });

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
        nombre,
        color_hex,
        semestres!inner()
      )
    `,
    )
    .eq("materia.semestres.es_actual", true);

  if (error) throw error;

  return data as unknown as ActividadConMateria[];
}
