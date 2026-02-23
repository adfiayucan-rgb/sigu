// lib/google/tokens.ts
import { createClient } from "@/lib/supabase/server";

export async function getFreshGoogleToken(userId: string) {
  const supabase = await createClient();

  // 1. Obtener el Refresh Token de nuestra tabla de la DB
  const { data: tokenData, error } = await supabase
    .from('user_google_tokens')
    .select('refresh_token')
    .eq('user_id', userId)
    .single();

  if (error || !tokenData) {
    throw new Error("No se encontró el Refresh Token. El usuario debe re-autenticarse.");
  }

  // 2. Solicitar a Google un nuevo Access Token
  // Nota: Estas variables deben estar en tu .env.local
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: tokenData.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error al refrescar token: ${data.error_description || data.error}`);
  }

  // Este es el nuevo Access Token válido por 1 hora
  return data.access_token;
}