ENV_FILE := back/.env

POSTGRES_CONTAINER := $(shell grep -E '^POSTGRES_NAME=' $(ENV_FILE) | cut -d= -f2)
POSTGRES_DB := $(shell grep -E '^POSTGRES_DATABASE=' $(ENV_FILE) | cut -d= -f2)
POSTGRES_USER := $(shell grep -E '^POSTGRES_USER=' $(ENV_FILE) | cut -d= -f2)

BACKEND_PORT := $(shell grep -E '^BACKEND_PORT=' $(ENV_FILE) | cut -d= -f2)
ifeq ($(BACKEND_PORT),)
BACKEND_PORT := 8080
endif
BACKEND_HOST ?= 127.0.0.1
BACKEND_BASE_URL := http://$(BACKEND_HOST):$(BACKEND_PORT)

COMPOSE := docker compose -f back/docker-compose.yml --env-file $(ENV_FILE)
PSQL := docker exec -i $(POSTGRES_CONTAINER) psql -v ON_ERROR_STOP=1 -U $(POSTGRES_USER) -d $(POSTGRES_DB)
PG_ISREADY := docker exec -i $(POSTGRES_CONTAINER) pg_isready -U $(POSTGRES_USER) -d $(POSTGRES_DB) -h 127.0.0.1

.PHONY: build up reset-db wait-db wait-schema wait-backend db-bash psql seed-roles seed-admin seed-all

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

wait-backend: wait-schema
	@echo "バックエンド起動待ち中..."
	@until curl -s -o /dev/null --fail "$(BACKEND_BASE_URL)/users/"; do sleep 1; done

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

seed-admin: seed-roles wait-backend
	@echo "管理者ユーザーをAPI経由で作成し、管理者権限を付与します..."
	@set -e; \
	PAYLOAD='{"name":"管理 太郎","email":"admin@example.com","password":"AdminPass123!","role_name":"一般","phone":"070-1111-2222","card_number":"9999-8888-7777-6666","card_expiration":"2028-03-31T00:00:00+09:00"}'; \
	BODY_FILE=$$(mktemp); \
	HTTP_STATUS=$$(curl -s -o $$BODY_FILE -w "%{http_code}" -H "Content-Type: application/json" -X POST "$(BACKEND_BASE_URL)/users/" -d "$$PAYLOAD"); \
	if [ "$$HTTP_STATUS" = "201" ]; then \
		echo "ユーザーを新規作成しました。"; \
	elif [ "$$HTTP_STATUS" = "409" ]; then \
		echo "ユーザーは既に存在します。既存レコードを使用します。"; \
	else \
		echo "ユーザー作成に失敗しました (status: $$HTTP_STATUS)"; \
		cat $$BODY_FILE; rm -f $$BODY_FILE; exit 1; \
	fi; \
		USER_ID=$$(BODY_FILE=$$BODY_FILE python3 -c 'import json, os; path=os.environ.get("BODY_FILE"); data=json.load(open(path, "r", encoding="utf-8")) if path and os.path.exists(path) else {}; print(data.get("user_id",""))'); \
	if [ -z "$$USER_ID" ]; then \
		USER_ID=$$(curl -s "$(BACKEND_BASE_URL)/users/" | python3 -c 'import json, sys; users=json.load(sys.stdin); target="admin@example.com"; print(next((str(u.get("id","")) for u in users if u.get("email")==target),""))'); \
	fi; \
	rm -f $$BODY_FILE; \
	if [ -z "$$USER_ID" ]; then \
		echo "管理者ユーザーIDの取得に失敗しました。"; \
		exit 1; \
	fi; \
	PROMOTE_FILE=$$(mktemp); \
	PROMOTE_STATUS=$$(curl -s -o $$PROMOTE_FILE -w "%{http_code}" -H "Content-Type: application/json" -X POST "$(BACKEND_BASE_URL)/admin/promote" -d "{\"user_id\": $$USER_ID}"); \
	if [ "$$PROMOTE_STATUS" = "201" ] || [ "$$PROMOTE_STATUS" = "409" ]; then \
		echo "管理者権限の付与が完了しました (status: $$PROMOTE_STATUS)。"; \
	else \
		echo "管理者権限の付与に失敗しました (status: $$PROMOTE_STATUS)"; \
		cat $$PROMOTE_FILE; rm -f $$PROMOTE_FILE; exit 1; \
	fi; \
	rm -f $$PROMOTE_FILE

seed-all: seed-admin
