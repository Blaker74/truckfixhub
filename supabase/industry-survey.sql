-- Applied through Supabase migration: create_tfh_industry_survey_2026_10.
-- New isolated table; no changes to existing community data or policies.
create table public.tfh_industry_survey (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 survey_version text not null default '2026-10' check (survey_version='2026-10'),
 role text not null check (role in ('company_driver','owner_operator','fleet_business','technician','parts','training','student_newcomer','other')),
 issues text[] not null check (
  array_ndims(issues)=1 and array_lower(issues,1)=1 and cardinality(issues) between 1 and 3
  and array_position(issues,null) is null
  and issues <@ array['fuel','freight','emissions','repairs','technicians','next_generation','parking','detention','pay_conditions','insurance','regulations_training','fraud','other']::text[]
  and coalesce(issues[1]<>issues[2],true) and coalesce(issues[1]<>issues[3],true) and coalesce(issues[2]<>issues[3],true)
 ),
 priority text not null check (priority=any(issues)),
 impact text not null default '' check (length(impact)<=1000),
 improvement text not null default '' check (length(improvement)<=1000),
 consent boolean not null check (consent=true),
 created_at timestamptz not null default now(),
 unique (user_id,survey_version)
);
alter table public.tfh_industry_survey enable row level security;
revoke all on public.tfh_industry_survey from public,anon,authenticated;
grant select,delete on public.tfh_industry_survey to authenticated;
grant insert (user_id,survey_version,role,issues,priority,impact,improvement,consent) on public.tfh_industry_survey to authenticated;
grant all on public.tfh_industry_survey to service_role;
create policy survey_read_own on public.tfh_industry_survey for select to authenticated
 using ((select auth.uid())=user_id);
create policy survey_submit_own on public.tfh_industry_survey for insert to authenticated
 with check ((select auth.uid())=user_id and (select auth.jwt()->>'is_anonymous') is distinct from 'true');
create policy survey_withdraw_own on public.tfh_industry_survey for delete to authenticated
 using ((select auth.uid())=user_id);
