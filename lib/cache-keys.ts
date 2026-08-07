export const CACHE_TAGS = {
  materias: (userId: string) => `materias-${userId}`,
  horarios: (userId: string) => `horarios-${userId}`,
  actividades: (userId: string) => `actividades-${userId}`,
  semestres: (userId: string) => `semestres-${userId}`,
  // otras llaves a futuro
};
