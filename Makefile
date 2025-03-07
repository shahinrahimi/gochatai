start:
	cd ./frontend/ && npm run dev 
up:
	docker-compose up -d --build
down:
	docker-compose down
reset: down up start
