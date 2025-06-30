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
