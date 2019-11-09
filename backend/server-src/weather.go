package main

import (
	"errors"
	"strings"

	owm "github.com/briandowns/openweathermap"
	pb "github.com/hashimiya/siiid-gke/backend/proto"
)

type OpenWeatherMapHandler struct {
	current *owm.CurrentWeatherData
}

func NewOpenWeatherMapHandler(coordinates *owm.Coordinates) (*OpenWeatherMapHandler, error) {
	w, err := owm.NewCurrent("C", "EN", strings.TrimSpace(OwmAPIKey))
	if err != nil {
		return nil, err
	}
	err = w.CurrentByCoordinates(coordinates)
	if err != nil {
		return nil, err
	}
	return &OpenWeatherMapHandler{
		current: w,
	}, nil
}

func (w OpenWeatherMapHandler) Name() string {
	return w.current.Name
}

func (w OpenWeatherMapHandler) Temperature() float32 {
	return float32(w.current.Main.Temp)
}

func (w OpenWeatherMapHandler) Humidity() int32 {
	return int32(w.current.Main.Humidity)
}

func (w OpenWeatherMapHandler) Weather() (pb.Weather, error) {
	currentWeather := w.current.Weather[0]
	if val, ok := pb.Weather_value[currentWeather.Main]; ok {
		return pb.Weather(val), nil
	}
	return pb.Weather(0), errors.New("not weather")
}
