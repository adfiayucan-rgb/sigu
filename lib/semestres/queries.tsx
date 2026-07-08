import { createClient } from "../supabase/server";

export async function getSemestreActual() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("semestres")
        .select("id, nombre")
        .eq("es_actual", true)
        .single();

    if (error) throw error;

    return data;
}