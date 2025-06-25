package request

import "time"

type CreateScreeningRequest struct {
	PlanId    uint      `json:"plan_id" binding:"required"`
	ScreenId  uint      `json:"screen_id"`
	StartTime time.Time `json:"start_time"`
	Duration  int       `json:"duration"`
}
