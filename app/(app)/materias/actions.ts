"use server";
import { createClient } from "@/lib/supabase/server";
import { MateriaFormData, materiaSchema } from "./schemas";
import { updateTag } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { deleteMateria } from "@/lib/materias/mutations";
import { getSemestreActual } from "@/lib/semestres/queries";

export type MateriaFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createMateriaAction(
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

  const { id: semestreId } = await getSemestreActual();

  if (!semestreId) {
    return {
      success: false,
      message: "No se obtuvo el semestre actual."
    }
  }

  const materiaCrear: MateriaFormData = {
    ...parsed.data,
    semestre_id: semestreId
  }

  const { data: materiaCreada, error: materiaError } = await supabase
    .from("materias")
    .insert(materiaCrear)
    .select("id")
    .single();

  if (materiaError || !materiaCreada) {
    return {
      success: false,
      message: `Error al crear: ${materiaError.message ?? "Sin datos"}`,
    };
  }

  updateTag(`materias-${user.id}`);

  return {
    success: true,
    message: "Materia creada correctamente.",
  };
}

export async function updateMateriaAction(
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

  const { error: materiaError } = await supabase.from("materias").update(parsed.data).eq("id", id);

  if (materiaError) {
    return {
      success: false,
      message: `Error al actualizar materia: ${materiaError.message}`,
    };
  }

  updateTag(`materias-${user.id}`);

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
      message: `Error al eliminar materia: ${error.message}`,
    };
  }

  updateTag("materias");

  return {
    success: true,
    message: "Materia eliminada correctamente.",
  };
}
