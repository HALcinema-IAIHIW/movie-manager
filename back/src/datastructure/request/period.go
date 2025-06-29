package request

import "time"

type PeriodRequest struct {
	MovieID   uint      `json:"movieID" binding:"required"`
	ScreenID  uint      `json:"screenID" binding:"required"`
	StartDate time.Time `json:"startDate" binding:"required" time_format:"2006-01-02"`
	EndDate   time.Time `json:"endDate" binding:"required" time_format:"2006-01-02"`
}
