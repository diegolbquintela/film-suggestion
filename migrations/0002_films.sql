create table if not exists films (
  id text primary key,
  name text not null,
  payload text not null,
  source text not null default 'seed',
  created_at timestamptz not null default now()
);

create index if not exists films_name_idx on films (lower(name));
