import { z } from "zod";

export const actividadSchema = z.object({
  materia_id: z.string().min(1, "Debes seleccionar una materia"),

  titulo: z
    .string()
    .trim()
    .min(3, "El titulo debe tener mínimo 3 caracteres")
    .max(120, "El titulo solo puede tener máximo 120 caracteres"),

  tipo: z.enum(["Parcial 1", "Parcial 2", "Parcial 3", "Final", "Tarea", "Quiz"]),

  fecha_entrega: z.string(),

  descripcion: z.string().trim().max(500).optional(),

  nota: z.number().min(0).max(5).nullable(),

  porcentaje_manual: z.number().min(0).max(100).nullable(),

  completada: z.boolean(),

  es_examen: z.boolean(),

  hora_inicio: z.string().min(1, "La hora de inicio es requerida"),

  hora_fin: z.string().min(1, "La hora de fin es requerida"),
});

export type ActividadFormData = z.infer<typeof actividadSchema>;

export function crearActividadPorDefecto(fecha_entrega: string, hora_inicio: string): ActividadFormData {
  return {
    titulo: "",
    tipo: "Tarea",
    descripcion: "",
    completada: false,
    fecha_entrega,
    materia_id: "",
    es_examen: false,
    nota: 0,
    porcentaje_manual: 0,
    hora_inicio,
    hora_fin: "",
  };
}
