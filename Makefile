CLUSTER=${siiid}
PROTOC_GEN_TS_PATH=./node_modules/.bin/protoc-gen-ts
OUT_DIR=./generated

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
