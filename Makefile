ENV?=$(env)
ENV := $(if $(ENV),$(ENV),dev)

helper-start:
	@if [ -f docker-compose.$(ENV).yml ]; then \
		docker-compose -f docker-compose.$(ENV).yml up -d; \
	else \
		echo "File docker-compose.$(ENV).yml does not exist."; \
	fi

helper-stop:
	@if [ -f docker-compose.$(ENV).yml ]; then \
		docker-compose -f docker-compose.$(ENV).yml down; \
	else \
		echo "File docker-compose.$(ENV).yml does not exist."; \
	fi

run:
	@if [ -f .env.$(target) ]; then \
		echo "Copying .env.$(target) to .env"; \
		cp .env.$(target) .env; \
		npx tsc; \
		npm run start; \
	else \
		echo "File .env.$(target) does not exist."; \
	fi
