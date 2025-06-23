package response

import "time"

type ScreeningResponse struct {
	PlanID  uint `json:"plan_id"`
	MovieID uint `json:"movie_id"`
	// ScreenID  uint      `json:"screen_id"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
}
