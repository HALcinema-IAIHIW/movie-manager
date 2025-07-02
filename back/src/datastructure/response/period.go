package response

import (
	"time"
)

type PeriodResponse struct {
	ID        uint      `json:"id"`
	MovieID   uint      `json:"movieID"`
	ScreenID  uint      `json:"screenID"`
	StartDate time.Time `json:"startDate" binding:"required" time_format:"2006-01-02"`
	EndDate   time.Time `json:"endDate" binding:"required" time_format:"2006-01-02"`
}
