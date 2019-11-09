package main

import (
	"testing"

	owm "github.com/briandowns/openweathermap"
)

func TestNew(t *testing.T) {
	w, err := NewWeatherHandler(&owm.Coordinates{
		Latitude:  43.05,
		Longitude: 141.38,
	})
	if err != nil {
		t.Error(err)
	}
	expect := "Toyohira"
	actual := w.Name()
	if expect != actual {
		t.Errorf("add failed. expect:%s, actual:%s", expect, actual)
	}
}
