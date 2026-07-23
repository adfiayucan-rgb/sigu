"use server";

import { updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ActividadFormData, actividadSchema } from "@/app/(app)/calendario/schemas";
import { requireUser } from "@/lib/supabase/auth";
import { createActividad, deleteActividad, updateActividad } from "@/lib/actividades/mutations";

export type ActividadFormState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createActividadAction(
  _prevState: ActividadFormState,
  formData: ActividadFormData,
): Promise<ActividadFormState> {
  const parsed = actividadSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Datos inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return {
      success: false,
      message: "Usuario no autenticado",
    };
  }

  const { data: actividadCreada, error: actividadError } = await createActividad(parsed.data, supabase, user.id);

  if (actividadError || !actividadCreada) {
    return {
      success: false,
      message: `Error al crear la actividad en la DB: ${actividadError.message}`,
    };
  }

  updateTag(`actividades-${user.id}`);

  return {
    success: true,
    message: "Actividad creada exitosamente.",
  };
}

export async function updateActividadAction(
  id: string,
  _prevState: ActividadFormState,
  formData: ActividadFormData,
): Promise<ActividadFormState> {
  const parsed = actividadSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Datos inválidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return {
      success: false,
      message: "Usuario no autenticado",
    };
  }

  const { error: actividadError } = await updateActividad(id, parsed.data, user.id, supabase);

  if (actividadError) {
    return {
      success: false,
      message: `Error al actualizar la actividad en DB: ${actividadError.message}`,
    };
  }

  updateTag(`actividades-${user.id}`);

  return {
    success: true,
    message: "Actividad actualizada correctamente.",
  };
}

export async function deleteActividadAction(id: string): Promise<ActividadFormState> {
  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return {
      success: false,
      message: "Usuario no autenticado",
    };
  }

  const { error } = await deleteActividad(id, supabase, user.id);

  if (error) {
    return {
      success: false,
      message: `Error al eliminar la actividad en la DB: ${error.message}`,
    };
  }

  updateTag(`actividades-${user.id}`);

  return {
    success: true,
    message: "Actividad eliminada exitosamente.",
  };
}

export async function toggleActividadCompletada(id: string, completada: boolean): Promise<ActividadFormState> {
  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return {
      success: false,
      message: "Usuario no autenticado",
    };
  }

  const { error: updateError } = await supabase
    .from("actividades")
    .update({
      completada,
    })
    .eq("id", id);

  if (updateError) {
    return {
      success: false,
      message: `Error al actualizar el estado de completado en la DB: ${updateError.message}`,
    };
  }

  // updateTag("actividades");
  updateTag(`actividades-${user.id}`);

  return {
    success: true,
    message: "Se actualizó correctamente el estado",
  };
}

export async function updateActividadFechaAction(
  id: string,
  data: {
    fecha_entrega?: string;
    hora_inicio?: string;
    hora_fin?: string;
  },
): Promise<ActividadFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Usuario no autenticado",
    };
  }

  const { error } = await supabase.from("actividades").update(data).eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  updateTag(`actividades-${user.id}`);

  return {
    success: true,
    message: "Actividad actualizada correctamente.",
  };
}
