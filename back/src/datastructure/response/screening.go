package response

import "time"

type ScreeningResponse struct {
	ID                uint      `json:"id"`
	ScreeningPeriodID uint      `json:"screening_period_id"`
	MovieID           uint      `json:"movie_id"`
	ScreenID          uint      `json:"screen_id"`
	Date              time.Time `json:"date" binding:"required"`
	StartTime         time.Time `json:"start_time" binding:"required"`
	EndTime           string    `json:"end_time"`
}

type ShowingInfo struct {
	ScreeningID uint   `json:"screening_id"`
	StartTime   string `json:"start_time"`
	EndTime     string `json:"end_time"`
}

type MovieTLResponse struct {
	MovieId uint   `json:"movie_id"`
	Title   string `json:"title"`
	// PosterURL string        `json:"poster_url"`
	ScreenID uint          `json:"screen_id"`
	Showings []ShowingInfo `json:"showings"`
	Date     string        `json:"date"`
}
