start:
	cd ./frontend/ && nohup npm run dev > front.log 2>&1 & echo $$! > front.pid
stop:
	kill `cat front.pid` || true
	rm -f front.pid
up:
	docker-compose up -d --build
down:
	docker-compose down
reset: up down
