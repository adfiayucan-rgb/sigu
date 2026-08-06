import { Database } from "../database.types";

export type SemestreDatabase = Database["public"]["Tables"]["semestres"]["Row"];

export type SemestreInsert = Database["public"]["Tables"]["semestres"]["Insert"];

export type SemestreUpdate = Database["public"]["Tables"]["semestres"]["Update"];

export type Semestre = Omit<SemestreDatabase, "created_at" | "user_id">