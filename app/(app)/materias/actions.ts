"use server";
import { createClient } from "@/lib/supabase/server";
import { MateriaFormData, materiaSchema } from "./schemas";
import { revalidatePath } from "next/cache";
import { saveHorariosByMateria } from "@/lib/horario/mutations";
import { requireUser } from "@/lib/supabase/auth";
import { deleteMateria } from "@/lib/materias/mutations";

export type MateriaFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createMateria(
  _prevState: MateriaFormState,
  formData: MateriaFormData,
): Promise<MateriaFormState> {
  const parsed = materiaSchema.safeParse(formData);

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

  const { horarios, ...materiaData } = parsed.data;

  const { data: materiaCreada, error: materiaError } = await supabase
    .from("materias")
    .insert({
      ...materiaData,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (materiaError || !materiaCreada) {
    return {
      success: false,
      message: `Error al crear: ${materiaError.message ?? "Sin datos"}`,
    };
  }

  if (horarios) {
    try {
      await saveHorariosByMateria(horarios, materiaCreada.id);
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Error al guardar los horarios.",
      };
    }
  }

  revalidatePath("/materias");

  return {
    success: true,
    message: "Materia creada correctamente.",
  };
}

export async function updateMateria(
  id: string,
  _prevState: MateriaFormState,
  formData: MateriaFormData,
): Promise<MateriaFormState> {
  const parsed = materiaSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa los campos marcados.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "No autorizado",
      errors: { user_id: ["No se pudo identificar al usuario"] },
    };
  }

  const { horarios, ...materiaData } = parsed.data;

  const { error: materiaError } = await supabase
    .from("materias")
    .update(materiaData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (materiaError) {
    return {
      success: false,
      message: `Error al actualizar materia: ${materiaError.message}`,
    };
  }

  if (horarios) {
    try {
      await saveHorariosByMateria(horarios, id);
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Error al guardar los horarios.",
      };
    }
  }

  revalidatePath("/materias");

  return {
    success: true,
    message: "Materia actualizada correctamente.",
  };
}

export async function deleteMateriaAction(materiaId: string): Promise<MateriaFormState> {
  console.log("Eliminando materia con id", materiaId);
  
  const supabase = await createClient();

  const user = await requireUser(supabase);

  if (!user) {
    return {
      success: false,
      message: "No autenticado",
    };
  }

  const { error } = await deleteMateria(materiaId, user.id, supabase);

  if (error) {
    return {
      success: false,
      message: `Error al eliminar materia: ${error.message}`
    }
  }

  revalidatePath("/materias")

  return {
    success: true,
    message: "Materia eliminada correctamente."
  }
}
