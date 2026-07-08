import z from "zod";

export const horarioSchema = z.object({
  id: z.string().optional(),
  materia_id: z.string(),
  dia: z.coerce
    .number()
    .int("Debe ser un número entero")
    .min(0, "El día seleccionado no es válido. Elige un número del 0 (Domingo) al 6 (Sábado).")
    .max(6, "El día seleccionado no es válido. Elige un número del 0 (Domingo) al 6 (Sábado)."),
  hora_inicio: z.string().min(1, "La hora de inicio es requerida"),
  hora_fin: z.string().min(1, "La hora de fin es requerida"),
  salon: z.string().optional(),
});

export type HorarioFormData = z.infer<typeof horarioSchema>;