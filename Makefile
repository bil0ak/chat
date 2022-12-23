build:
	docker build -t chat-app .

run:
	docker compose up --remove-orphans -d