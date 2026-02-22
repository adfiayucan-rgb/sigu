-- Create semestres table
CREATE TABLE IF NOT EXISTS public.semestres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  es_actual BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.semestres ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "semestres_select_own" ON public.semestres;
CREATE POLICY "semestres_select_own" ON public.semestres FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "semestres_insert_own" ON public.semestres;
CREATE POLICY "semestres_insert_own" ON public.semestres FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "semestres_update_own" ON public.semestres;
CREATE POLICY "semestres_update_own" ON public.semestres FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "semestres_delete_own" ON public.semestres;
CREATE POLICY "semestres_delete_own" ON public.semestres FOR DELETE USING (auth.uid() = user_id);

-- Create materias table
CREATE TABLE IF NOT EXISTS public.materias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  semestre_id UUID NOT NULL REFERENCES public.semestres(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  creditos INTEGER NOT NULL DEFAULT 3,
  color_hex TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.materias ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "materias_select_own" ON public.materias;
CREATE POLICY "materias_select_own" ON public.materias FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "materias_insert_own" ON public.materias;
CREATE POLICY "materias_insert_own" ON public.materias FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "materias_update_own" ON public.materias;
CREATE POLICY "materias_update_own" ON public.materias FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "materias_delete_own" ON public.materias;
CREATE POLICY "materias_delete_own" ON public.materias FOR DELETE USING (auth.uid() = user_id);

-- Create actividades table
CREATE TABLE IF NOT EXISTS public.actividades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia_id UUID NOT NULL REFERENCES public.materias(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Parcial 1', 'Parcial 2', 'Parcial 3', 'Final', 'Tarea', 'Quiz')),
  fecha_entrega TIMESTAMPTZ NOT NULL,
  completada BOOLEAN DEFAULT false,
  nota NUMERIC(3,1) DEFAULT NULL,
  porcentaje_manual NUMERIC(5,2) DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.actividades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "actividades_select_own" ON public.actividades;
CREATE POLICY "actividades_select_own" ON public.actividades FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "actividades_insert_own" ON public.actividades;
CREATE POLICY "actividades_insert_own" ON public.actividades FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "actividades_update_own" ON public.actividades;
CREATE POLICY "actividades_update_own" ON public.actividades FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "actividades_delete_own" ON public.actividades;
CREATE POLICY "actividades_delete_own" ON public.actividades FOR DELETE USING (auth.uid() = user_id);
