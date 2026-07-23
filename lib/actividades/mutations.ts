"use server";

import { ActividadFormData } from "@/app/(app)/calendario/schemas";
import { SupabaseClient } from "@supabase/supabase-js";

export async function createActividad(actividad: ActividadFormData, supabase: SupabaseClient, userId: string) {
  return supabase
    .from("actividades")
    .insert({
      ...actividad,
      user_id: userId,
    })
    .select("id")
    .single();
}

export async function updateActividad(id: string, actividad: ActividadFormData, userId: string, supabase: SupabaseClient) {
  return supabase.from("actividades").update(actividad).eq("id", id).eq("user_id", userId);
}

export async function deleteActividad(id:string, supabase: SupabaseClient, userId: string) {
    return supabase.from("actividades").delete().eq("id", id).eq("user_id", userId)
}