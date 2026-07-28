"use server";
import z from "zod";
import { createClient } from "@/lib/supabase/server";
import { MateriaFormData, materiaSchema, MateriaFormDataImport, materiaSchemaImport } from "./schemas";
import { updateTag } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { deleteMateria } from "@/lib/materias/mutations";
import { getSemestreActual } from "@/lib/semestres/queries";
import { getMateriasByNombres } from "@/lib/materias/queries";
import { extractZodArrayErrors} from "@/lib/utils";
import pdfParse from "pdf-parse";
import { ActionState } from "@/lib/types";

export type MateriaFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: any | null;
};

type ProcesarMateriasPdfData = {
  materiasExistentes: string[];
  materiasNuevas: MateriaFormData[];
};

export type MateriaImportState = {
  success: boolean;
  message: string;
  errors?: any;
  title?: string | null
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
      message: "No se obtuvo el semestre actual.",
    };
  }

  const materiaCrear: MateriaFormData = {
    ...parsed.data,
    semestre_id: semestreId,
  };

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

export async function createMateriasAction(materias: MateriaFormData[]): Promise<MateriaImportState> {
  const parsed = z.array(materiaSchema).safeParse(materias);

  if (!parsed.success) {
    return {
      success: false,
      title: "Errores de validación",
      message: "Se encontraron los siguientes problemas al importar las materias:",
      errors: extractZodArrayErrors(parsed.error.issues),
    };
  }

  const supabase = await createClient();

  const user = await requireUser(supabase);
  if (!user) {
    return {
      success: false,
      message: "No hay usuario autenticado",
    };
  }

  const { id: semestre_id } = await getSemestreActual();
  if (!semestre_id) {
    return {
      success: false,
      message: "No tenemos semestre activo",
    };
  }

  const materiasInsert = materias.map((materia) => ({
    ...materia,
    semestre_id,
  }));

  const { error } = await supabase.from("materias").insert(materiasInsert);

  if (error) {
    return {
      success: false,
      message: `Error al insertar las materias por: ${error.message}`,
    };
  }

  updateTag(`materias-${user.id}`);
  return {
    success: true,
    message: "Se guardaron todas las materias exitosamente",
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

export async function procesarMateriasPdf(pdf: File): Promise<ActionState<ProcesarMateriasPdfData>> {
  // 1. Extraer materias del PDF
  const materias = await extraerMateriasPdf(pdf);
  if (materias.length === 0) {
    return {
      success: false,
      message: "Error al extraer las materias del pdf, no encontró materias",
    };
  }

  // 2. Validar la información obtenida
  const resultadoValidacion = validarMateriasImportadas(materias);
  if (!resultadoValidacion.success) {
    return {
      success: false,
      message: resultadoValidacion.message,
      errors: resultadoValidacion.errors
    };
  }

  if (!resultadoValidacion.data) {
    return {
      success: false,
      message: "La validación no retornó las materias"
    }
    
  }
  const materiasValidadas: MateriaFormDataImport[] = resultadoValidacion.data;

  // 3. Consultar las materias que ya existen
  const materiasExistentes = await obtenerNombresDeMateriasExistentes(materiasValidadas.map((m) => m.nombre));

  // 4. Obtener únicamente las materias nuevas
  const materiasNuevas = materias.filter((materia) => !materiasExistentes.has(materia.nombre));

  return {
    success: true,
    message: "Todo correcto",
    data: {
      materiasExistentes: [...materiasExistentes],
      materiasNuevas,
    },
  };
}

async function extraerMateriasPdf(pdf: File): Promise<MateriaFormData[]> {
  const arrayBuffer = await pdf.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const contenidoPdf = await pdfParse(buffer);
  const textoPdf = contenidoPdf.text;

  const patronMateria = /(\d{7})([A-ZÁÉÍÓÚÑ\s]+?)\d{7}-[A-Z](\d)/g;

  const materiasExtraidas: MateriaFormData[] = [];
  let coincidencia;

  while ((coincidencia = patronMateria.exec(textoPdf)) !== null) {
    const [, codigo, nombre, creditos] = coincidencia;

    materiasExtraidas.push({
      codigo: codigo, // Convertimos el texto a número
      nombre: nombre.trim(),
      creditos: Number(creditos),
      semestre_id: "",
      color_hex: ""
    });
  }
  
  return materiasExtraidas;
}

function validarMateriasImportadas(materiasExtraidas: MateriaFormDataImport[]): ActionState<MateriaFormDataImport[]> {
  const parsed = z.array(materiaSchemaImport).safeParse(materiasExtraidas);

  if (!parsed.success) {
    return {
      success: false,
      message: "Error al validar las materias importadas",
      errors: extractZodArrayErrors(parsed.error.issues),
    };
  }

  return {
    success: true,
    message: "Materias validadas correctamente",
    data: parsed.data,
  };
}

async function obtenerNombresDeMateriasExistentes(nombresMaterias: string[]): Promise<Set<string>> {
  const materiasExistentes = (await getMateriasByNombres(nombresMaterias)) ?? [];
  return new Set(materiasExistentes.map((materia) => materia.nombre));
}
