import { cacheLife, cacheTag } from "next/cache";
import { requireUser } from "../supabase/auth";
import { createClient } from "../supabase/server";
import { Semestre } from "../types/semestre";

export async function getSemestreActual(): Promise<Semestre> {
  "use cache: private";

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return {
      es_actual: false,
      fecha_fin: "",
      fecha_inicio: "",
      id: "",
      nombre: "",
    };
  }

  cacheTag(`semestres-${user.id}`);
  cacheLife("weeks");

  const { data, error } = await supabase
    .from("semestres")
    .select("id, nombre, fecha_fin, fecha_inicio, es_actual")
    .eq("es_actual", true)
    .maybeSingle();

  if (error) throw error;

  return (
    data ?? {
      es_actual: false,
      fecha_fin: "",
      fecha_inicio: "",
      id: "",
      nombre: "",
    }
  );
}
