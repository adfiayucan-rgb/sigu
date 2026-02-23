import useSWR from 'swr'
import type { Semestre, Materia, ActividadConMateria } from '@/lib/types'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useSemestres() {
  return useSWR<Semestre[]>('/api/semestres', fetcher)
}

export function useMaterias(semestreId?: string) {
  const url = semestreId ? `/api/materias?semestreId=${semestreId}` : '/api/materias'

  return useSWR<Materia[]>('/api/materias', fetcher, {
    dedupingInterval: 10000,
    revalidateOnFocus: false
  })
}

export function useActividades() {
  return useSWR<ActividadConMateria[]>('/api/actividades', fetcher)
}
