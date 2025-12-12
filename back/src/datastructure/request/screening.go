package request

import "time"

type CreateScreeningRequest struct {
	ScreeningPeriodID uint      `json:"screening_period_id" binding:"required"`
	Date              time.Time `json:"date" binding:"required"`
	StartTime         time.Time `json:"start_time" binding:"required"`
	Duration          int       `json:"duration" binding:"required"`
	ScreenID          uint      `json:"screen_id" binding:"required"`
}
