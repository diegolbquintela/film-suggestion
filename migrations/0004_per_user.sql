drop table if exists films;
drop table if exists suggest_log;

create table films (
  user_id text not null,
  id text not null,
  name text not null,
  payload text not null,
  source text not null default 'seed',
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index films_user_name_idx on films (user_id, lower(name));

create table suggest_log (
  user_id text not null,
  id text not null,
  ran_at timestamptz not null default now(),
  added int not null default 0,
  primary key (user_id, id)
);

create table taste (
  user_id text primary key,
  payload text not null,
  updated_at timestamptz not null default now()
);
