create table if not exists "user_saved_places" (
  "id" text not null primary key,
  "user_id" text not null,
  "place_id" text not null,
  "created_at" timestamptz default CURRENT_TIMESTAMP not null,
  unique ("user_id", "place_id")
);

create table if not exists "user_itineraries" (
  "user_id" text not null primary key,
  "city_id" text not null,
  "place_ids_json" text not null,
  "updated_at" timestamptz default CURRENT_TIMESTAMP not null
);

create index if not exists "user_saved_places_user_idx" on "user_saved_places" ("user_id");
