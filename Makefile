CLUSTER=${siiid}

cluster_list:
	gcloud container clusters list
.PHONY: cluster_list

cluster_describe:
	gcloud container clusters describe ${CLUSTER}
.PHONY: cluster_describe

get_pods:
	kubectl get pods
.PHONY: get_pods

get_service:
	kubectl get service
.PHONY: get_service

get_ingress:
	kubectl get ingress
.PHONY: get_ingress

get_pod_log:
	kubectl logs -f ${POD}
.PHONY: get_pod_log

get_address:
	gcloud compute addresses describe ${IP} --global
.PHONY: get_address

create:
	kubectl create -f ${FILE}
.PHONY: create

update:
	kubectl apply -f ${FILE}
.PHONY: update

delete:
	kubectl delete -f ${FILE}
.PHONY: delete

build:
	docker build -t gcr.io/siiid-prd/siiid-frontend ./frontend
	docker build -t gcr.io/siiid-prd/siiid-backend-gk -f ./backend/gateway-docker/Dockerfile ./
	docker build -t gcr.io/siiid-prd/siiid-backend-sv -f ./backend/server-docker/Dockerfile ./
.PHONY: build

deploy:
	gcloud docker -- push gcr.io/siiid-prd/siiid-frontend
	gcloud docker -- push gcr.io/siiid-prd/siiid-backend-gk
	gcloud docker -- push gcr.io/siiid-prd/siiid-backend-sv
.PHONY: deploy

dev:
	docker-compose up -d
.PHONY: dev

check_hello:
	curl -vvv -X GET http://0.0.0.0:8765
.PHOYNY: check_hello

protoc:
	protoc -I/usr/local/include -I. \
		-I\${GOPATH}/src \
		-I\${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
		--grpc-gateway_out=logtostderr=true:. \
		proto/siiid_service.proto && \
	protoc -I/usr/local/include -I. \
		-I${GOPATH}/src \
		-I${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
		--go_out=plugins=grpc:. \
		proto/siiid_service.proto && \
	cp proto/siiid_service.pb.go proto/siiid_service.pb.gw.go backend/proto/
.PHONY: protoc

fmt:
	gofmt -d backend/*.go backend/**/*.go
.PHONY: fmt

encrypt:
	echo ${TARGET} | \
	gcloud kms encrypt \
		--location global \
		--keyring siiid-keyring \
		--key siiid-key \
		--ciphertext-file=- \
		--plaintext-file=- | \
	base64
.PHONY: encrypt

decrypt:
	echo ${TARGET} | \
	base64 --decode| \
	gcloud kms decrypt \
		--location global \
		--keyring siiid-keyring \
		--key siiid-key \
		--ciphertext-file=- \
		--plaintext-file=-
.PHONY: decrypt
