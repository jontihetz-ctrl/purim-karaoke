-- Pub Quiz Trainer — Supabase schema
-- Run this in the Supabase SQL editor

create table public.quiz_teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text unique not null,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table public.quiz_players (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  team_id uuid references public.quiz_teams(id) on delete set null,
  created_at timestamptz default now()
);

create table public.quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  player_id uuid references public.quiz_players(id) on delete cascade,
  team_id uuid references public.quiz_teams(id) on delete set null,
  category text,
  difficulty text,
  total_questions int not null,
  correct_count int default 0,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table public.quiz_answers (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.quiz_sessions(id) on delete cascade,
  player_id uuid references public.quiz_players(id) on delete cascade,
  question_text text not null,
  category text not null,
  difficulty text not null,
  correct_answer text not null,
  player_answer text not null,
  is_correct boolean not null,
  time_taken_ms int not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.quiz_teams enable row level security;
alter table public.quiz_players enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;

create policy "teams_read"   on public.quiz_teams for select using (true);
create policy "teams_insert" on public.quiz_teams for insert with check (auth.uid() = owner_id);
create policy "teams_update" on public.quiz_teams for update using (auth.uid() = owner_id);

create policy "profiles_read"   on public.quiz_players for select using (true);
create policy "profiles_insert" on public.quiz_players for insert with check (auth.uid() = id);
create policy "profiles_update" on public.quiz_players for update using (auth.uid() = id);

create policy "sessions_read" on public.quiz_sessions for select using (
  player_id = auth.uid() or
  team_id in (select team_id from public.quiz_players where id = auth.uid() and team_id is not null)
);
create policy "sessions_insert" on public.quiz_sessions for insert with check (player_id = auth.uid());
create policy "sessions_update" on public.quiz_sessions for update using (player_id = auth.uid());

create policy "answers_read" on public.quiz_answers for select using (
  player_id = auth.uid() or
  session_id in (
    select qs.id from public.quiz_sessions qs
    join public.quiz_players p on p.id = auth.uid()
    where qs.team_id = p.team_id and p.team_id is not null
  )
);
create policy "answers_insert" on public.quiz_answers for insert with check (player_id = auth.uid());
