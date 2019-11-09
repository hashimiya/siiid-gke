FROM golang:1.13 AS gw-build-stage
RUN go get google.golang.org/grpc \
          github.com/grpc-ecosystem/grpc-gateway/protoc-gen-grpc-gateway \
          github.com/golang/protobuf/protoc-gen-go
RUN apt-get update && apt-get upgrade && \
  apt-get install unzip && \
  curl -OL https://github.com/protocolbuffers/protobuf/releases/download/v3.10.0/protoc-3.10.0-linux-x86_64.zip && \
  unzip protoc-3.10.0-linux-x86_64.zip -d protoc && \
  mv protoc/bin/* /usr/local/bin/ && \
  mv protoc/include/* /usr/local/include/
WORKDIR /go/src/github.com/hashimiya/siiid-gke/backend/
ADD ./proto ./proto
ADD ./backend/gateway.go ./gateway.go
RUN protoc -I/usr/local/include -I. \
      -I$GOPATH/src \
      -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
      --grpc-gateway_out=logtostderr=true:. \
      proto/siiid_service.proto && \
    protoc -I/usr/local/include -I. \
      -I$GOPATH/src \
      -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
      --go_out=plugins=grpc:. \
      proto/siiid_service.proto
RUN CGO_ENABLED=0 GOOS=linux go build -o gateway gateway.go
RUN mkdir /app && mv gateway /app/gateway

FROM scratch AS gw-run-stage
WORKDIR /app
COPY --from=0 /app/gateway .
CMD ["/app/gateway"]
EXPOSE 8080
