package response

import "time"

type MovieInfo struct {
	ID         uint   `json:"id"`
	Title      string `json:"title"`
	PosterPath string `json:"poster_path"`
}

type ScreenInfo struct {
	ID uint `json:"id"`
}

type ScreeningResponse struct {
	ID                uint       `json:"id"`
	ScreeningPeriodID uint       `json:"screening_period_id"`
	Movie             MovieInfo  `json:"movie"`
	Screen            ScreenInfo `json:"screen"`
	Date              time.Time  `json:"date"`
	StartTime         time.Time  `json:"start_time"`
	EndTime           string     `json:"end_time"`
}

type ShowingInfo struct {
	ScreeningID uint   `json:"screening_id"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
}

type MovieTLResponse struct {
	MovieId    uint          `json:"movie_id"`
	Title      string        `json:"title"`
	PosterPath string        `json:"poster_path"`
	ScreenID   uint          `json:"screen_id"`
	Showings   []ShowingInfo `json:"showings"`
	Date       string        `json:"date"`
}
