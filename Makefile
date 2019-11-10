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
	docker build -t gcr.io/siiid-prd/siiid-backend-gk -f ./backend/gateway-docker/Dockerfile ./
	docker build -t gcr.io/siiid-prd/siiid-backend-sv -f ./backend/server-docker/Dockerfile ./
.PHONY: build

build_web:
	cd web && \
	docker build -t gcr.io/siiid-prd/siiid-web .
.PHONY: build_web

deploy:
	gcloud docker -- push gcr.io/siiid-prd/siiid-web
	gcloud docker -- push gcr.io/siiid-prd/siiid-backend-gk
	gcloud docker -- push gcr.io/siiid-prd/siiid-backend-sv
.PHONY: deploy

protoc:
	protoc -I/usr/local/include -I. \
		-I\${GOPATH}/src \
		-I\${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
		--plugin=protoc-gen-ts=./web/node_modules/.bin/protoc-gen-ts \
		--grpc-gateway_out=logtostderr=true:. \
		--go_out=plugins=grpc:. \
		--ts_out=service=grpc-web:. \
    --js_out=import_style=commonjs,binary:. \
		proto/siiid_service.proto

	cp proto/siiid_service.pb.go proto/siiid_service.pb.gw.go backend/proto/
	cp proto/siiid_service_pb.d.ts proto/siiid_service_pb_service.d.ts \
		proto/siiid_service_pb.js proto/siiid_service_pb_service.js \
		web/src/proto/
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
