import z from "zod";

export const materiaSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  creditos: z.coerce
    .number()
    .int("Los créditos deben ser un número entero")
    .min(1, "Debe tener al menos 1 crédito")
    .max(4, "No puede superar 4 créditos"),
  color_hex: z
    .string()
    .min(1, "Debe elegir un color"),
  semestre_id: z
    .string()
});

export type MateriaFormData = z.infer<typeof materiaSchema>;

export function crearMateriaPorDefecto(): MateriaFormData {
  return {
    color_hex: "",
    creditos: 1,
    nombre: "",
    semestre_id: ""
  }
}