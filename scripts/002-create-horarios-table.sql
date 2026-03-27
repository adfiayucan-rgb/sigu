-- Tabla para almacenar los horarios de clases de cada materia
-- Una materia puede tener múltiples horarios (ej: Lunes 6-8am, Viernes 8-10am)
CREATE TABLE IF NOT EXISTS horarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  materia_id UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6), -- 0=Domingo, 1=Lunes, ..., 6=Sábado
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  aula TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT horarios_hora_valida CHECK (hora_fin > hora_inicio)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_horarios_user_id ON horarios(user_id);
CREATE INDEX IF NOT EXISTS idx_horarios_materia_id ON horarios(materia_id);
CREATE INDEX IF NOT EXISTS idx_horarios_dia_semana ON horarios(dia_semana);

-- RLS policies
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own horarios" ON horarios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own horarios" ON horarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own horarios" ON horarios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own horarios" ON horarios
  FOR DELETE USING (auth.uid() = user_id);
