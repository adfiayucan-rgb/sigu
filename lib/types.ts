export type Semestre = {
  id: string
  user_id: string
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  es_actual: boolean
  created_at: string
}

export type Materia = {
  id: string
  user_id: string
  semestre_id: string
  nombre: string
  creditos: number
  color_hex: string
  created_at: string
}

export type Actividad = {
  id: string
  user_id: string
  materia_id: string
  titulo: string
  tipo: 'Parcial 1' | 'Parcial 2' | 'Parcial 3' | 'Final' | 'Tarea' | 'Quiz'
  fecha_entrega: string
  completada: boolean
  nota: number | null
  porcentaje_manual: number | null
  created_at: string
  descripcion: string
}

export type ActividadResponse = Pick<ActividadConMateria, 'id' | 'materia_id' | 'titulo' | 'tipo' | 'fecha_entrega' | 'completada' | 'nota' | 'materia'>

export type ActividadConMateria = Actividad & {
  materia: Pick<Materia, 'nombre' | 'color_hex'>
}

export type Horario = {
  id: string
  user_id: string
  materia_id: string
  dia: number // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  hora_inicio: string // "HH:mm:ss"
  hora_fin: string // "HH:mm:ss"
  salon: string | null
}

export type HorarioConMateria = Horario & {
  materia: Pick<Materia, 'nombre' | 'color_hex'>
}

export type MateriaConHorarios = Materia & {
  horarios: Horario[]
}

export const DIAS_SEMANA = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
] as const

export const TIPOS_ACTIVIDAD = [
  'Parcial 1',
  'Parcial 2',
  'Parcial 3',
  'Final',
  'Tarea',
  'Quiz',
] as const

export const COLORES_MATERIA = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
] as const
