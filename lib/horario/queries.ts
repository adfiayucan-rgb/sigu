"use server";

import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "../supabase/server";
import { requireUser } from "../supabase/auth";
import { Horario, HorarioConMateria } from "../types";



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
    materia_id,
    materia:materias(
      semestre:semestres!inner()
    )
  `,
    )
    .eq("materia.semestre.es_actual", true);

  if (error) throw error;

  return data as unknown as Horario[];
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

  if (error) throw error;

  return data as unknown as HorarioConMateria[];
}

export async function getHorariosByDay(dia: number) {
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
      materia:materias!inner (
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
    throw error;
  }

  return data as unknown as HorarioConMateria[];
}

export async function getClaseActual(): Promise<{
  claseActual: HorarioConMateria | null
}> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return {
      claseActual: null
    }
  }

  cacheLife({
    stale: 60,
  });
  cacheTag(`horarios-${user.id}`);

  const now = new Date();

  const day = now.getDay();
  const time = now.toTimeString().slice(0, 5); // "08:35"
  console.log(time);
  

  const { data } = await supabase
    .from("horarios")
    .select(
      `
    id,
    dia,
    hora_inicio,
    hora_fin,
    salon,
    materia:materias!inner (
        id,
        nombre,
        semestre:semestres!inner ()
      )
  `,
    )
    .eq("materia.semestre.es_actual", true)
    .eq("dia", day)
    .lte("hora_inicio", time)
    .gte("hora_fin", time)
    .single();

  if (!data) {
    return {
      claseActual: null
    };
  }

  return {
    claseActual: data as unknown as HorarioConMateria
  };
}
