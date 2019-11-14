package main

import (
	"log"
	"math/rand"
	"strings"
	"time"

	owm "github.com/briandowns/openweathermap"
	pb "github.com/hashimiya/siiid-gke/backend/proto"
	"golang.org/x/net/context"
	"googlemaps.github.io/maps"
)

const (
	defaultRadius = 100
)

// server is used to implement SiiidServer.
type server struct {
	repository Repository
}

func (s *server) Hello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloResponse, error) {
	name := in.Name
	if name == "" {
		name = "unknown"
	}
	log.Printf("Received: %v", name)
	return &pb.HelloResponse{Message: "Hello " + name}, nil
}

func (s *server) ListPoints(ctx context.Context, in *pb.ListPointsRequest) (*pb.ListPointsResponse, error) {
	points, _ := s.repository.FindList()
	return &pb.ListPointsResponse{
		Points: points,
	}, nil
}

func (s *server) GetPoint(ctx context.Context, in *pb.GetPointsRequest) (*pb.PointSummary, error) {
	id := in.GetId()
	point, err := s.repository.Find(ID(id))
	if err != nil {
		return &pb.PointSummary{}, err
	}
	return point, nil
}

func (s *server) RecordPoint(ctx context.Context, in *pb.RecordPointRequest) (*pb.PointSummary, error) {
	lat := float64(in.GetLatitude())
	lng := float64(in.GetLongitude())

	h, err := NewOpenWeatherMapHandler(&owm.Coordinates{
		Latitude:  lat,
		Longitude: lng,
	})
	if err != nil {
		return nil, err
	}

	place := in.GetPlace()
	if place == "" {
		place = h.Name()
		client, err := maps.NewClient(maps.WithAPIKey(strings.TrimSpace(PlaceAPIKey)))
		if err != nil {
			return nil, err
		}
		req := &maps.NearbySearchRequest{
			Location: &maps.LatLng{Lat: lat, Lng: lng},
			Radius:   defaultRadius,
			Language: "ja",
			Type:     maps.PlaceType("point_of_interest"),
		}
		res, err := client.NearbySearch(context.Background(), req)
		if err != nil {
			return nil, err
		}
		resLen := len(res.Results)
		if resLen > 0 {
			rand.Seed(time.Now().UnixNano())
			place = res.Results[rand.Intn(resLen)].Name
		}
	}

	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		loc = time.FixedZone(location, 9*60*60)
	}
	time.Local = loc

	w, err := h.Weather()
	if err != nil {
		return nil, err
	}
	point, _ := s.repository.Create(&pb.PointSummary{
		Place:       place,
		Weather:     w,
		Temperature: h.Temperature(),
		Humidity:    h.Humidity(),
		Latitude:    float32(lat),
		Longitude:   float32(lng),
		ActionedAt:  time.Now().Format("2006-1-2 3:4:5"),
	})

	log.Printf("Recorded: %v", point)
	return point, nil
}

func (s *server) UpdatePoint(ctx context.Context, in *pb.UpdatePointRequest) (*pb.UpdatePointResponse, error) {
	id := in.GetId()
	place := in.GetPlace()

	log.Printf("Updated: %v %v", id, place)
	return &pb.UpdatePointResponse{}, nil
}

func (s *server) DeletePoint(ctx context.Context, in *pb.DeletePointRequest) (*pb.DeletePointResponse, error) {
	id := in.GetId()

	log.Printf("Deleted: %v", id)
	return &pb.DeletePointResponse{}, nil
}
