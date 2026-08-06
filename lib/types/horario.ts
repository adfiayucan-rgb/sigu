import { Database } from "../database.types";
import { Materia } from "./materia";

export type HorarioDatabase = Database["public"]["Tables"]["horarios"]["Row"];

export type HorarioInsert = Database["public"]["Tables"]["horarios"]["Insert"];

export type HorarioUpdate = Database["public"]["Tables"]["horarios"]["Update"];

export type Horario = Omit<HorarioDatabase, "user_id">

export type HorarioConMateria = Horario & {
  materia: Pick<Materia, "id" | "codigo" | "nombre" | "color_hex">;
};
