package main

import (
	"encoding/base64"
	"log"
	"net"
	"os"

	cloudkms "cloud.google.com/go/kms/apiv1"
	pb "github.com/hashimiya/siiid-gke/backend/proto"
	"golang.org/x/net/context"
	kmspb "google.golang.org/genproto/googleapis/cloud/kms/v1"
	"google.golang.org/grpc"
)

const (
	port = ":5001"
)

// PlaceAPIKey .
var PlaceAPIKey string

// OwmAPIKey .
var OwmAPIKey string

func main() {
	PlaceAPIKey = decryptKey("PLACE_API_KEY")
	OwmAPIKey = decryptKey("OWM_API_KEY")

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterSiiidServiceServer(s, &server{
		repository: NewRedisRepository(),
	})
	log.Printf("liten: :%s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func decryptKey(envName string) string {
	ctx := context.Background()
	client, err := cloudkms.NewKeyManagementClient(ctx)
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()
	cipherText, err := base64.StdEncoding.DecodeString(os.Getenv(envName))
	if err != nil {
		log.Fatalln(err)
	}
	req := &kmspb.DecryptRequest{
		Name:       "projects/siiid-prd/locations/global/keyRings/siiid-keyring/cryptoKeys/siiid-key",
		Ciphertext: cipherText,
	}
	resp, err := client.Decrypt(ctx, req)
	if err != nil {
		log.Fatalln(err)
	}
	return string(resp.Plaintext)
}
