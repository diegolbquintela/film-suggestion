create table if not exists suggest_log (
  id text primary key,
  ran_at timestamptz not null default now(),
  added int not null default 0
);
