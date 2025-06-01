package dto

import "time"

type CreateScreeningRequest struct {
	MovieId     uint      `json:"movie_id" binding:"required"`
	ScreenId    uint      `json:"screen_id" binding:"required"`
	StartTime   time.Time `json:"start_time" binding:"required,datetime=2025-05-26T11:43:00Z07:00 "`
	Duration    int       `json:"duration" binding:"required,gte=1"`
	Language    string    `json:"language"`
	IsSubtitled bool      `json:"is_subtitled,omitempty"`
	IsDubbed    bool      `json:"is_dubbed,omitempty"`
	IsActive    bool      `json:"is_active,omitempty"`
	Status      string    `json:"status" binding:"required,omitempty,oneof=scheduled cancelled delayed"`
}
