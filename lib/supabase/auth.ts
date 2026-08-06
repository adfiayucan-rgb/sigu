"use server"
import { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function requireUser(
  supabase: Supabase
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}