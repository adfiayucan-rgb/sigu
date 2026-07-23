import { cacheLife, cacheTag } from "next/cache";
import { requireUser } from "../supabase/auth";
import { createClient } from "../supabase/server";

export async function getSemestreActual() {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return {
      id: null,
      nombre: null,
      fecha_fin: null
    };
  }

  cacheTag(`semestres-${user.id}`)
  cacheLife("hours")

  const { data, error } = await supabase.from("semestres").select("id, nombre, fecha_fin").eq("es_actual", true).single();

  if (error) throw error;

  return data;
}
