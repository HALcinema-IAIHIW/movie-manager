package dto

import "time"

type ScreeningResponse struct {
	ID          uint      `json:"id"`
	MovieID     uint      `json:"movie_id"`
	ScreenID    uint      `json:"screen_id"`
	StartTime   time.Time `json:"start_time"`
	Duration    int       `json:"duration"`
	Language    string    `json:"language"`
	IsSubtitled bool      `json:"is_subtitled"`
	IsDubbed    bool      `json:"is_dubbed"`
	IsActive    bool      `json:"is_active"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
