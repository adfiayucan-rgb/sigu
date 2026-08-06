import { Database } from "../database.types";
import { Materia } from "./materia";

export type Actividad = Omit<Database["public"]["Tables"]["actividades"]["Row"], "user_id" | "created_at">;

export type ActividadInsert = Database["public"]["Tables"]["actividades"]["Insert"];

export type ActividadUpdate = Database["public"]["Tables"]["actividades"]["Update"];

export type ActividadConMateria = Actividad & {
    materia: Materia;
}


