"use server";

import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "../supabase/server";
import { MateriaWithDetails } from "../types";

export async function getMateriasConDetalles() {
  const supabase = await createClient();

  const hoy = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("materias")
    .select(
      `
        id,
        nombre,
        creditos,
        color_hex,
        profesor,
        semestre_id,
        semestres!inner(
            es_actual
        ),
        horarios(
            id,
            dia,
            hora_inicio,
            hora_fin,
            salon,
            materia_id
        ),
        actividades(
            id,
            titulo,
            tipo,
            fecha_entrega,
            completada,
            nota,
            porcentaje_manual,
            es_examen
        )
    `,
    )
    .eq("semestres.es_actual", true)
    .eq("actividades.es_examen", true);
  // .gte("actividades.fecha_entrega", hoy);

  if (error) throw error;

  return data as unknown as MateriaWithDetails[];
}

export async function getMateriasParaSelect() {
  "use cache: private";

  cacheLife("hours");
  cacheTag("materias");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("materias")
    .select(
      `
        id,
        nombre,
        color_hex,
        semestres!inner()
      `,
    )
    .eq("semestres.es_actual", true)
    .order("nombre");

  if (error) throw error;

  return data;
}
