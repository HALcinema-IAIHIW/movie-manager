package request

import "time"

type ScreenResponse struct {
	ID        uint      `json:"id"`
	MaxRow    int       `json:"max_row"`
	MaxColumn string    `json:"max_column"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
