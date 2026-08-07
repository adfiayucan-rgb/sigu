import { Database } from "../database.types";
import type { Actividad } from "./actividad";
import type { Horario } from "./horario";

export type Materia = Omit<Database["public"]["Tables"]["materias"]["Row"], "user_id" | "created_at">;

export type MateriaInsert = Omit<Database["public"]["Tables"]["materias"]["Insert"], "user_id" | "created_at">;

export type MateriaUpdate = Omit<Database["public"]["Tables"]["materias"]["Update"], "user_id" | "created_at">;

export type MateriaParaSelect = Pick<Materia, "id" | "codigo" | "nombre" | "color_hex">;

export type MateriaConHorarioYActividades = Materia & {
    horarios: Horario[],
    actividades: Actividad[]
}

export type MateriasStats = {
  total_materias: number;
  total_creditos: number;
  actividades_completadas: number;
  actividades_pendientes: number;
}