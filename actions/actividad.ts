"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createActividad, deleteActividad, updateActividad } from "@/services/actividades";

const ActividadSchema = z.object({
  descripcion: z.string(),
  titulo: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  tipo: z.string().min(1, "El tipo de tarea es requerido"),
  fecha_entrega: z.string().min(1, "La fecha de entrega es requerida"),
  materia_id: z.string().min(1, "El ID de la materia es requerido"),
  id: z.string(),
});

export type FormState = {
  success?: boolean;
  errors?: { [key: string]: string[] };
  message?: string | null;
  data?: any;
  fields?: {
    // Guardamos los valores "sucios" del formulario aquí
    descripcion?: string;
    titulo?: string;
    tipo?: string;
    fecha_entrega?: string;
    materia_id?: string;
    id?: string;
  };
};

export async function saveActividad(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = ActividadSchema.safeParse(rawData);

  console.log(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Revisa los campos.",
      fields: rawData as any,
      data: null,
    };
  }

  const { id, ...data } = validatedFields.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { message: "No autorizado", errors: { server: ["Sesión expirada"] } };

  const dataParaGuardar = {
    ...data,
    fecha_entrega: new Date(data.fecha_entrega).toISOString(),
    user_id: user.id,
  };

  try {
    if (id) {
      console.log("actualizando la actividad en la base de datos", dataParaGuardar);
      const { data: actividad, error } = await updateActividad(id, dataParaGuardar, user.id);

      if (error) throw error; // Si Supabase falla, lanzamos el error
      console.log("Actividad actualizada exitosamente", actividad);
      return { message: "Actualizado con éxito", data: actividad };
    } else {
      // Lógica de CREATE (prisma.materia.create...)
      console.log("Creando la actividad en la base de datos", dataParaGuardar);
      const { data: actividad, error } = await createActividad(dataParaGuardar, user.id);
      console.log("Response de la db", actividad);

      if (error) throw error; // Si Supabase falla, lanzamos el error
      console.log("Creado con exito", actividad);
      return { message: "Creado con éxito", data: actividad };
    }
  } catch (e: any) {
    console.error("Error al crear la actividad", e);

    return {
      message: "Error al crear la actividad",
      errors: { server: [e.message] },
      fields: rawData as any,
    };
  }
}

export async function toggleActividad(id: string, nuevoEstado: boolean) {
  try {
    const supabase = await createClient();

    console.log(`Actualizando estado de actividad ${id} a ${nuevoEstado}`);

    const { error } = await supabase
      .from("actividades")
      .update({ completada: nuevoEstado }) // Usamos el valor que viene del cliente
      .eq("id", id);

    if (error) throw error; // Si Supabase falla, lanzamos el error
    console.log("Actividad actualizada exitosamente");

    revalidatePath("/calendario");
  } catch (error) {
    console.error("Error en toggleActividad:", error);
    throw error; // Re-lanzamos para que useOptimistic haga el rollback
  }
}

export async function deleteActividadAction(id: string): Promise<FormState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "No autorizado",
        errors: { server: ["Sesión expirada"] },
      };
    }

    const { error } = await deleteActividad(id, user.id);

    if (error) throw error;

    console.log("Actividad eliminada exitosamente");

    // Retornamos el ID para que el mutate sepa qué quitar del caché
    return {
      success: true,
      data: id,
    };
  } catch (error: any) {
    console.error("Error en deleteActividad:", error);
    // Es mejor retornar un objeto de error que lanzar un throw crudo
    // para que el cliente pueda manejarlo sin romper el flujo de ejecución
    return {
      success: false,
      message: "Error al eliminar la actividad",
      errors: { server: [error.message] },
    };
  }
}
