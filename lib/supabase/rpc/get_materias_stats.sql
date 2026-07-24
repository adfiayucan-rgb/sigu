create or replace function public.get_materias_stats()
returns table (
  total_materias bigint,
  total_creditos bigint,
  actividades_completadas bigint,
  actividades_pendientes bigint
)
language sql
security invoker
set search_path = public
as $$
with materias_stats as (
  select
    count(*) as total_materias,
    coalesce(sum(creditos), 0) as total_creditos
  from materias
  where user_id = auth.uid()
),
actividades_stats as (
  select
    count(*) filter (where a.completada) as actividades_completadas,
    count(*) filter (where not a.completada) as actividades_pendientes
  from actividades a
  inner join materias m
    on m.id = a.materia_id
  where m.user_id = auth.uid()
)
select
  m.total_materias,
  m.total_creditos,
  a.actividades_completadas,
  a.actividades_pendientes
from materias_stats m
cross join actividades_stats a;
$$;