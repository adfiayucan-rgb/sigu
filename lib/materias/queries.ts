import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "../supabase/server";
import { requireUser } from "../supabase/auth";
import type { Materia, MateriaConHorarioYActividades, MateriaParaSelect, MateriasStats } from "../types/materia";
import { CACHE_TAGS } from "../cache-keys";

export async function getMateriaConHorarioYActividades(): Promise<MateriaConHorarioYActividades[]> {
  "use cache: private";
  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return [];
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.materias(user.id));

  const { data, error } = await supabase
    .from("materias")
    .select(
      `
        id,
        codigo,
        nombre,
        creditos,
        color_hex,
        profesor,
        semestre_id,
        semestres!inner(),
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
            es_examen,
            hora_fin, 
            hora_inicio, 
            descripcion,
            materia_id
        )
    `,
    )
    .eq("semestres.es_actual", true);

  if (error) {
    console.error("Error en getMateriaConHorarioYActividades:", error.message);
    throw new Error(`Error al cargar las materias con horarios y actividades: ${error.message}`);
  }

  return data;
}

export async function getMaterias(): Promise<Materia[]> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return [];
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.materias(user.id));

  const { data, error } = await supabase
    .from("materias")
    .select(
      `
        *,
        semestre:semestres!inner()
      `,
    )
    .eq("semestre.es_actual", true)
    .order("nombre");

  if (error) {
    console.error("Error en getMaterias:", error.message);
    throw new Error(`Error al cargar las materias: ${error.message}`)
  }

  return data;
}

export async function getMateriasParaSelect(): Promise<MateriaParaSelect[]> {
  "use cache: private";

  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) {
    return [];
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.materias(user.id));

  const { data, error } = await supabase
    .from("materias")
    .select(
      `
        id,
        codigo,
        nombre,
        color_hex,
        semestres!inner()
      `,
    )
    .eq("semestres.es_actual", true)
    .order("nombre");

  if (error) {
    console.error("Error en getMateriasParaSelect:", error.message);
    throw new Error(`Error al cargar las materias para el select: ${error.message}`)
  }

  return data;
}

export async function getMateriasStats(): Promise<MateriasStats> {
  "use cache: private";

  const supabase = await createClient();
  const user = await requireUser(supabase);

  if (!user) {
    return {
      actividades_completadas: 0,
      actividades_pendientes: 0,
      total_creditos: 0,
      total_materias: 0,
    };
  }

  cacheLife("weeks");
  cacheTag(CACHE_TAGS.materias(user.id));

  const { data, error } = await supabase.rpc("get_materias_stats");

  if (error) {
    console.error("Error en getMateriasStats:", error.message);
    throw new Error(`Error al cargar las estadisticas de las materias: ${error.message}`)
  }

  const stats = data[0] as MateriasStats;

  return stats;
}

export async function getMateriasByNombres(nombres: string[]) {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return null;
  }

  cacheLife("hours");
  cacheTag(`materias-${user.id}`);

  const { data } = await supabase.from("materias").select("id, nombre, color_hex").in("nombre", nombres);

  return data ?? null;
}
