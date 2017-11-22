package server

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/nathan-osman/go-sunrise"
)

const iso8601 = "2006-01-02T15:04:05-0700"

type apiInput struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Year      int     `json:"year"`
	Month     int     `json:"month"`
	Day       int     `json:"day"`
}

func (s *Server) api(w http.ResponseWriter, r *http.Request) {
	var d interface{}
	defer func() {
		b, err := json.Marshal(d)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Length", strconv.Itoa(len(b)))
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(b)
	}()
	var a apiInput
	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		d = map[string]string{"error": err.Error()}
		return
	}
	rise, set := sunrise.SunriseSunset(
		a.Latitude,
		a.Longitude,
		a.Year,
		time.Month(a.Month),
		a.Day,
	)
	d = map[string]string{
		"sunrise": rise.Format(iso8601),
		"sunset":  set.Format(iso8601),
	}
}
