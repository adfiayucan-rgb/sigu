import z from "zod";

export const materiaSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  codigo: z.coerce
    .string()
    .regex(/^\d+$/, "El código solo puede contener números")
    .optional(),
  creditos: z.coerce
    .number()
    .int("Los créditos deben ser un número entero")
    .min(1, "Debe tener al menos 1 crédito")
    .max(4, "No puede superar 4 créditos"),
  color_hex: z
    .string()
    .min(1, "Debe elegir un color"),
  profesor: z.
    string()
    .nullable()
    .optional(),
  semestre_id: z
    .string()
});

export type MateriaFormData = z.infer<typeof materiaSchema>;

export const materiaSchemaImport = materiaSchema.pick({
  codigo: true,
  nombre: true,
  creditos: true,
  semestre_id: true
});

export type MateriaFormDataImport = z.infer<typeof materiaSchemaImport>

export function crearMateriaPorDefecto(): MateriaFormData {
  return {
    codigo: "",
    nombre: "",
    creditos: 1,
    color_hex: "",
    semestre_id: ""
  }
}