"use server";

import { SupabaseClient } from "@supabase/supabase-js";


export async function deleteMateria(materiaId: string, userId: string, supabase: SupabaseClient) {

  return await supabase
    .from("materias")
    .delete()
    .eq("id", materiaId)
    .eq("user_id", userId);
}
