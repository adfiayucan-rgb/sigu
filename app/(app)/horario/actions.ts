"use server";

import { type ActionState } from "@/lib/types";
import { HorarioFormData, horarioSchema } from "./schema";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/auth";
import { createHorario, updateHorario } from "@/lib/horario/mutations";
import { updateTag } from "next/cache";

export async function updateHorarioAction(
  id: string,
  _prevState: ActionState,
  formData: HorarioFormData,
): Promise<ActionState> {
  const parsed = horarioSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Error al crear materia",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Insertamos en la base de datos
  const supabase = await createClient();
  const user = await requireUser(supabase);

  if (!user) {
    return {
      success: false,
      message: "No autorizado",
      errors: { user_id: ["No se pudo identificar al usuario"] },
    };
  }

  const { error } = await updateHorario(id, parsed.data);

  if (error) {
    return {
      success: true,
      message: `Error al actualizar el horario por: ${error.message}`,
    };
  }

  updateTag(`horarios-${user.id}`);

  return {
    success: true,
    message: "Horario actualizado exitosamente.",
  };
}

export async function createHorarioAction(
  _prevState: ActionState,
  formData: HorarioFormData,
): Promise<ActionState> {
  const parsed = horarioSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Error al crear materia",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Insertamos en la base de datos
  const supabase = await createClient();
  const user = await requireUser(supabase);

  if (!user) {
    return {
      success: false,
      message: "No autorizado",
      errors: { user_id: ["No se pudo identificar al usuario"] },
    };
  }

  const { error } = await createHorario(parsed.data);

  if (error) {
    return {
      success: true,
      message: `Error al crear el horario por: ${error.message}`,
    };
  }

  updateTag(`horarios-${user.id}`);

  return {
    success: true,
    message: "Horario creado exitosamente.",
  };
}
