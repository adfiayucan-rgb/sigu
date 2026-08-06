import { Materia } from "./types/materia";

export type Semestre = {
  id: string;
  user_id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  es_actual: boolean;
  created_at: string;
};


// Tipos para el módulo de conocimiento
export type Apunte = {
  id: string;
  user_id: string;
  materia_id: string | null;
  titulo: string;
  contenido: string;
  categoria: number; // 0=General, 1=Fórmulas, 2=Resumen, 3=Ejercicios
  created_at: string;
  updated_at: string;
};

export type ApunteConMateria = Apunte & {
  materia: Pick<Materia, "nombre" | "color_hex"> | null;
};

export type Archivo = {
  id: string;
  user_id: string;
  materia_id: string | null;
  nombre: string;
  url: string;
  tipo: number; // 0=PDF, 1=Imagen, 2=Otro
  tamano: number; // bytes
  created_at: string;
};

export type ArchivoConMateria = Archivo & {
  materia: Pick<Materia, "nombre" | "color_hex"> | null;
};

export const CATEGORIAS_APUNTE = [
  { value: 0, label: "General" },
  { value: 1, label: "Formulas" },
  { value: 2, label: "Resumen" },
  { value: 3, label: "Ejercicios" },
] as const;

export const TIPOS_ARCHIVO = [
  { value: 0, label: "PDF", icon: "file-text" },
  { value: 1, label: "Imagen", icon: "image" },
  { value: 2, label: "Otro", icon: "file" },
] as const;
