FRONT_DIR = "./frontend"
FRONT_DOCKER_IMAGE = "frontend-image:latest"
FRONT_DOCKER_CONTAINER = "frontend-container"
BACK_DIR = "./backend"
build_front:
	@echo "Building frontend"
	cd $(FRONT_DIR) && docker build -t $(FRONT_DOCKER_IMAGE) .
run_front:
	@echo "Running frontend"
	docker run -d --name $(FRONT_DOCKER_CONTAINER) -p 3000:3000 $(FRONT_DOCKER_IMAGE)
	
front_docker:
	cd $(FRONT_DIR) && docker run -d -p 3000:3000 simpleapp:latest