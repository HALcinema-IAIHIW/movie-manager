ENV_FILE := back/.env

POSTGRES_CONTAINER := $(shell grep -E '^POSTGRES_NAME=' $(ENV_FILE) | cut -d= -f2)
POSTGRES_DB := $(shell grep -E '^POSTGRES_DATABASE=' $(ENV_FILE) | cut -d= -f2)
POSTGRES_USER := $(shell grep -E '^POSTGRES_USER=' $(ENV_FILE) | cut -d= -f2)

COMPOSE := docker compose -f back/docker-compose.yml --env-file $(ENV_FILE)
PSQL := docker exec -i $(POSTGRES_CONTAINER) psql -v ON_ERROR_STOP=1 -U $(POSTGRES_USER) -d $(POSTGRES_DB)
PG_ISREADY := docker exec -i $(POSTGRES_CONTAINER) pg_isready -U $(POSTGRES_USER) -d $(POSTGRES_DB) -h 127.0.0.1

.PHONY: build up reset-db wait-db wait-schema db-bash psql seed-roles seed-admin seed-all

build:
	$(COMPOSE) build --no-cache

up:
	$(COMPOSE) up -d

wait-db: up
	@echo "Postgres 起動待ち中..."
	@until $(PG_ISREADY) >/dev/null 2>&1; do sleep 1; done

wait-schema: wait-db
	@echo "roles テーブル作成待ち中..."
	@until echo "SELECT to_regclass('public.roles');" | $(PSQL) | grep -q roles; do sleep 1; done

reset-db:
	$(COMPOSE) down -v

db-bash:
	docker exec -it $(POSTGRES_CONTAINER) /bin/bash

psql:
	docker exec -it $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

seed-roles: wait-schema
	@printf "%s\n" \
	"INSERT INTO roles (role_name, price_yen) VALUES" \
	"    ('一般', 1800)," \
	"    ('大学生', 1500)," \
	"    ('中学生～高校生', 1200)," \
	"    ('小学生、幼児', 800)" \
	"ON CONFLICT (role_name) DO UPDATE SET" \
	"    price_yen = EXCLUDED.price_yen;" \
	| $(PSQL)

seed-admin: seed-roles
	@printf "%s\n" \
	"CREATE EXTENSION IF NOT EXISTS pgcrypto;" \
	"" \
	"WITH role_row AS (" \
	"  SELECT id FROM roles WHERE role_name = '一般' LIMIT 1" \
	")," \
	"upsert_user AS (" \
	"  INSERT INTO users (" \
	"    name, email, password, role_id, phone_number, card_number, card_expiration, created_at, updated_at" \
	"  )" \
	"  SELECT" \
	"    '管理 太郎'," \
	"    'admin@example.com'," \
	"    crypt('AdminPass123!', gen_salt('bf'))," \
	"    role_row.id," \
	"    '070-1111-2222'," \
	"    '9999-8888-7777-6666'," \
	"    '2028-03-31 00:00:00+09'," \
	"    NOW()," \
	"    NOW()" \
	"  FROM role_row" \
	"  ON CONFLICT (email) DO UPDATE SET" \
	"    name = EXCLUDED.name," \
	"    password = EXCLUDED.password," \
	"    role_id = EXCLUDED.role_id," \
	"    phone_number = EXCLUDED.phone_number," \
	"    card_number = EXCLUDED.card_number," \
	"    card_expiration = EXCLUDED.card_expiration," \
	"    updated_at = NOW()" \
	"  RETURNING id" \
	")" \
	"INSERT INTO admins (user_id, created_at, updated_at)" \
	"SELECT id, NOW(), NOW() FROM upsert_user" \
	"ON CONFLICT (user_id) DO NOTHING;" \
	| $(PSQL)

seed-all: seed-roles seed-admin
