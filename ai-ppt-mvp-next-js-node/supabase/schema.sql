create extension if not exists "pgcrypto";

create table if not exists public.ppt_generations (
  id uuid primary key default gen_random_uuid(),
  ppt_type text not null check (ppt_type in ('investment', 'course', 'event')),
  topic text not null,
  audience text not null,
  goal text not null,
  tone text not null,
  slide_count integer not null check (slide_count between 5 and 12),
  requirements text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  model text,
  outline_json jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_ppt_generations_updated_at on public.ppt_generations;

create trigger set_ppt_generations_updated_at
before update on public.ppt_generations
for each row
execute function public.set_updated_at();

alter table public.ppt_generations enable row level security;

create policy "Service role can manage ppt generations"
on public.ppt_generations
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
